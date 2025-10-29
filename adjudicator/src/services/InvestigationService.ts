import crypto from 'crypto';
import { prisma } from '../config/prisma';
import { decryptEscrowPackage, hashSha256Hex } from '../utils/crypto';

export interface InvestigationRequest {
  fileId: string;
  escrowedIdentity: string;
  investigationReason: string;
  adminApproval: string;
  legalAuthorization: string;
}

interface AdminApprovalPayload {
  version: number;
  adminUser: string;
  fileId: string;
  investigationReason: string;
  legalAuthorization: string;
  signedAt: string;
  signature: string;
}

export interface InvestigationReport {
  decryptedIdentity: {
    realPublicKey: string;
    publicKeyHash: string;
    ownershipPublicKey: string;
    consistencyCheck: boolean;
  };
  activitySummary: {
    filesWithSameOwnershipKey: number;
    totalRevocations: number;
    avgTimeBeforeRevokeHours: number;
    firstUploadTimestamp?: Date;
    lastActivityTimestamp?: Date;
  };
  redFlags: string[];
  riskAssessment: {
    overallRisk: 'HIGH' | 'MEDIUM' | 'LOW';
    threatType: string;
    confidence: number;
    reasoning: string;
  };
  recommendedActions: string[];
  legalCompliance: {
    investigationId: string;
    requestedBy: string;
    legalAuthorization: string;
    decryptionTimestamp: Date;
    auditLogId: string;
  };
}

export class InvestigationService {
  private readonly adjudicatorEciesPrivateKey: string;
  private readonly adminApprovalSecret: string;
  private readonly adminApprovalMaxSkewMs: number;

  constructor() {
    this.adjudicatorEciesPrivateKey = process.env.ADJUDICATOR_ECIES_PRIVATE_KEY ?? '';
    if (!this.adjudicatorEciesPrivateKey) {
      throw new Error('Adjudicator ECIES private key missing. Set ADJUDICATOR_ECIES_PRIVATE_KEY.');
    }

    this.adminApprovalSecret = process.env.ADMIN_APPROVAL_HMAC_SECRET
      ?? process.env.ADMIN_HMAC_SECRET
      ?? '';

    if (!this.adminApprovalSecret) {
      throw new Error('Admin approval secret missing. Set ADMIN_APPROVAL_HMAC_SECRET or ADMIN_HMAC_SECRET.');
    }

    const defaultSkewMs = 5 * 60 * 1000; // 5 minutes
    const configuredSkew = Number(process.env.ADMIN_APPROVAL_MAX_SKEW_MS ?? defaultSkewMs);
    this.adminApprovalMaxSkewMs = Number.isFinite(configuredSkew) && configuredSkew > 0
      ? configuredSkew
      : defaultSkewMs;
  }

  private parseAdminApproval(raw: string): AdminApprovalPayload {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error('Admin approval payload malformed: not valid JSON');
    }

    const payload = parsed as Partial<AdminApprovalPayload>;
    if (typeof payload !== 'object' || payload === null) {
      throw new Error('Admin approval payload malformed: expected object');
    }

    const requiredFields: Array<keyof AdminApprovalPayload> = [
      'version',
      'adminUser',
      'fileId',
      'investigationReason',
      'legalAuthorization',
      'signedAt',
      'signature',
    ];

    for (const field of requiredFields) {
      if (!(field in payload)) {
        throw new Error(`Admin approval payload missing field: ${field}`);
      }
    }

    if (payload.version !== 1) {
      throw new Error('Unsupported admin approval payload version');
    }

    const stringFields: Array<keyof AdminApprovalPayload> = [
      'adminUser',
      'fileId',
      'investigationReason',
      'legalAuthorization',
      'signedAt',
      'signature',
    ];

    for (const field of stringFields) {
      if (typeof payload[field] !== 'string') {
        throw new Error(`Admin approval payload field ${field} must be a string`);
      }
    }

    return payload as AdminApprovalPayload;
  }

  private verifyLegalAuthorization(value: string): void {
    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error('Legal authorization is required');
    }
    if (trimmed.length < 10) {
      throw new Error('Legal authorization reference is too short');
    }
    if (trimmed.length > 180) {
      throw new Error('Legal authorization reference is too long');
    }
    if (!/[A-Za-z]/.test(trimmed) || !/[0-9]/.test(trimmed)) {
      throw new Error('Legal authorization must include both letters and numbers');
    }
    if (!/^[A-Za-z0-9#:@\/\-.,\s]+$/.test(trimmed)) {
      throw new Error('Legal authorization contains invalid characters');
    }
  }

  private verifyInvestigationAuthorization(request: InvestigationRequest): AdminApprovalPayload {
    const normalizedReason = (request.investigationReason ?? '').trim();
    const normalizedLegalAuth = (request.legalAuthorization ?? '').trim();

    if (!request.adminApproval) {
      throw new Error('Investigation requires admin approval payload');
    }

    if (!normalizedReason) {
      throw new Error('Investigation reason is required');
    }

    this.verifyLegalAuthorization(normalizedLegalAuth);

    const approval = this.parseAdminApproval(request.adminApproval);

    if (approval.fileId !== request.fileId) {
      throw new Error('Admin approval fileId does not match request');
    }

    if (approval.investigationReason !== normalizedReason) {
      throw new Error('Admin approval reason does not match request');
    }

    if (approval.legalAuthorization !== normalizedLegalAuth) {
      throw new Error('Admin approval legal authorization mismatch');
    }

    const signedAtMs = Date.parse(approval.signedAt);
    if (Number.isNaN(signedAtMs)) {
      throw new Error('Admin approval timestamp invalid');
    }

    if (Math.abs(Date.now() - signedAtMs) > this.adminApprovalMaxSkewMs) {
      throw new Error('Admin approval has expired');
    }

    const normalizedAdminUser = approval.adminUser.trim();

    const canonicalPayload = JSON.stringify({
      version: approval.version,
      adminUser: normalizedAdminUser,
      fileId: request.fileId,
      investigationReason: normalizedReason,
      legalAuthorization: normalizedLegalAuth,
      signedAt: approval.signedAt,
    });

    const expectedSignature = crypto
      .createHmac('sha256', this.adminApprovalSecret)
      .update(canonicalPayload)
      .digest('hex');

    let providedSignature: Buffer;
    let expectedSignatureBuffer: Buffer;
    try {
      providedSignature = Buffer.from(approval.signature, 'hex');
      expectedSignatureBuffer = Buffer.from(expectedSignature, 'hex');
    } catch {
      throw new Error('Admin approval signature is not valid hex');
    }

    if (providedSignature.length !== expectedSignatureBuffer.length) {
      throw new Error('Admin approval signature length mismatch');
    }

    if (!crypto.timingSafeEqual(expectedSignatureBuffer, providedSignature)) {
      throw new Error('Admin approval signature invalid');
    }

    return {
      ...approval,
      adminUser: normalizedAdminUser,
    };
  }

  private async logInvestigation(
    investigationId: string,
    request: InvestigationRequest,
    decryptedPublicKey: string
  ): Promise<string> {
    const audit = await prisma.investigationAudit.create({
      data: {
        investigationId,
        fileId: request.fileId,
        reason: request.investigationReason,
        adminApproval: request.adminApproval,
        legalAuthorization: request.legalAuthorization,
        decryptedPublicKey,
      },
    });
    return audit.id;
  }

  async investigate(request: InvestigationRequest): Promise<InvestigationReport> {
    const normalizedRequest: InvestigationRequest = {
      ...request,
      investigationReason: (request.investigationReason ?? '').trim(),
      legalAuthorization: (request.legalAuthorization ?? '').trim(),
    };

    const adminApproval = this.verifyInvestigationAuthorization(normalizedRequest);

    const realPublicKey = decryptEscrowPackage(this.adjudicatorEciesPrivateKey, normalizedRequest.escrowedIdentity);
    const publicKeyHash = hashSha256Hex(realPublicKey);

    const file = await prisma.file.findUnique({
      where: { id: normalizedRequest.fileId },
      include: {
        validationToken: true,
        revocations: true,
      },
    });

    if (!file) {
      throw new Error('File not found');
    }

    const consistencyCheck = file.validationToken?.userPublicKeyHash === publicKeyHash;

    const relatedFiles = await prisma.file.findMany({
      where: { ownershipPublicKey: file.ownershipPublicKey },
      include: { revocations: true },
      orderBy: { createdAt: 'asc' },
    });

    type FileWithRevocations = typeof relatedFiles[number];
    type RevocationRecord = FileWithRevocations['revocations'][number];

    const totalRevocations = relatedFiles.reduce(
      (sum: number, current: FileWithRevocations) => sum + current.revocations.length,
      0
    );
    const timeDiffs = relatedFiles.flatMap((item: FileWithRevocations) =>
      item.revocations.map(
        (revocation: RevocationRecord) => revocation.createdAt.getTime() - item.createdAt.getTime()
      )
    );

    const avgTimeBeforeRevokeHours = timeDiffs.length
      ? timeDiffs.reduce((sum: number, diff: number) => sum + diff, 0) / timeDiffs.length / (1000 * 60 * 60)
      : 0;

    const redFlags: string[] = [];
    if (avgTimeBeforeRevokeHours > 0 && avgTimeBeforeRevokeHours < 48) {
      redFlags.push('High churn: grants revoked within 48 hours on average');
    }
    if (relatedFiles.length >= 30) {
      redFlags.push(`Large footprint: ${relatedFiles.length} files bound to the same ownership key`);
    }
    if (totalRevocations > relatedFiles.length * 0.4) {
      redFlags.push('Revocation ratio exceeds 40% of uploads');
    }

    const riskLevel = redFlags.length >= 3 ? 'HIGH' : redFlags.length === 0 ? 'LOW' : 'MEDIUM';
    const threatType = avgTimeBeforeRevokeHours < 48 && avgTimeBeforeRevokeHours > 0
      ? 'Honeypot pattern'
      : redFlags.length > 0 ? 'Suspicious behavior' : 'Normal';

    const investigationId = crypto.randomUUID();
    const auditLogId = await this.logInvestigation(investigationId, normalizedRequest, realPublicKey);

    const firstUploadTimestamp = relatedFiles[0]?.createdAt;
    const lastActivityTimestamp = relatedFiles[relatedFiles.length - 1]?.createdAt;

    return {
      decryptedIdentity: {
        realPublicKey,
        publicKeyHash,
        ownershipPublicKey: file.ownershipPublicKey,
        consistencyCheck: Boolean(consistencyCheck),
      },
      activitySummary: {
        filesWithSameOwnershipKey: relatedFiles.length,
        totalRevocations,
        avgTimeBeforeRevokeHours,
        firstUploadTimestamp,
        lastActivityTimestamp,
      },
      redFlags,
      riskAssessment: {
        overallRisk: riskLevel,
        threatType,
        confidence: redFlags.length / 5,
        reasoning: redFlags.length
          ? redFlags.join('; ')
          : 'No anomalous patterns detected across associated uploads',
      },
      recommendedActions: this.buildRecommendations(redFlags, consistencyCheck ?? false, publicKeyHash),
      legalCompliance: {
        investigationId,
        requestedBy: adminApproval.adminUser,
        legalAuthorization: normalizedRequest.legalAuthorization,
        decryptionTimestamp: new Date(),
        auditLogId,
      },
    };
  }

  private buildRecommendations(redFlags: string[], consistencyCheck: boolean, publicKeyHash: string): string[] {
    const recommendations = new Set<string>();
    if (!consistencyCheck) {
      recommendations.add('Flag ValidationToken mismatch and trigger manual review');
    }
    if (redFlags.length >= 1) {
      recommendations.add('Notify security ops for follow-up review');
    }
    if (redFlags.length >= 2) {
      recommendations.add(`Consider blacklisting publicKeyHash ${publicKeyHash.slice(0, 12)}… for future tokens`);
    }
    if (redFlags.length === 0) {
      recommendations.add('No immediate action required');
    }
    return Array.from(recommendations);
  }
}

export const investigationService = new InvestigationService();
