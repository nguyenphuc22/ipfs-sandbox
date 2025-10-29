"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.investigationService = exports.InvestigationService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../config/prisma");
const crypto_2 = require("../utils/crypto");
class InvestigationService {
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
    parseAdminApproval(raw) {
        let parsed;
        try {
            parsed = JSON.parse(raw);
        }
        catch {
            throw new Error('Admin approval payload malformed: not valid JSON');
        }
        const payload = parsed;
        if (typeof payload !== 'object' || payload === null) {
            throw new Error('Admin approval payload malformed: expected object');
        }
        const requiredFields = [
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
        const stringFields = [
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
        return payload;
    }
    verifyLegalAuthorization(value) {
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
    verifyInvestigationAuthorization(request) {
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
        const expectedSignature = crypto_1.default
            .createHmac('sha256', this.adminApprovalSecret)
            .update(canonicalPayload)
            .digest('hex');
        let providedSignature;
        let expectedSignatureBuffer;
        try {
            providedSignature = Buffer.from(approval.signature, 'hex');
            expectedSignatureBuffer = Buffer.from(expectedSignature, 'hex');
        }
        catch {
            throw new Error('Admin approval signature is not valid hex');
        }
        if (providedSignature.length !== expectedSignatureBuffer.length) {
            throw new Error('Admin approval signature length mismatch');
        }
        if (!crypto_1.default.timingSafeEqual(expectedSignatureBuffer, providedSignature)) {
            throw new Error('Admin approval signature invalid');
        }
        return {
            ...approval,
            adminUser: normalizedAdminUser,
        };
    }
    async logInvestigation(investigationId, request, decryptedPublicKey) {
        const audit = await prisma_1.prisma.investigationAudit.create({
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
    async investigate(request) {
        const normalizedRequest = {
            ...request,
            investigationReason: (request.investigationReason ?? '').trim(),
            legalAuthorization: (request.legalAuthorization ?? '').trim(),
        };
        const adminApproval = this.verifyInvestigationAuthorization(normalizedRequest);
        const realPublicKey = (0, crypto_2.decryptEscrowPackage)(this.adjudicatorEciesPrivateKey, normalizedRequest.escrowedIdentity);
        const publicKeyHash = (0, crypto_2.hashSha256Hex)(realPublicKey);
        const file = await prisma_1.prisma.file.findUnique({
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
        const relatedFiles = await prisma_1.prisma.file.findMany({
            where: { ownershipPublicKey: file.ownershipPublicKey },
            include: { revocations: true },
            orderBy: { createdAt: 'asc' },
        });
        const totalRevocations = relatedFiles.reduce((sum, current) => sum + current.revocations.length, 0);
        const timeDiffs = relatedFiles.flatMap((item) => item.revocations.map((revocation) => revocation.createdAt.getTime() - item.createdAt.getTime()));
        const avgTimeBeforeRevokeHours = timeDiffs.length
            ? timeDiffs.reduce((sum, diff) => sum + diff, 0) / timeDiffs.length / (1000 * 60 * 60)
            : 0;
        const redFlags = [];
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
        const investigationId = crypto_1.default.randomUUID();
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
    buildRecommendations(redFlags, consistencyCheck, publicKeyHash) {
        const recommendations = new Set();
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
exports.InvestigationService = InvestigationService;
exports.investigationService = new InvestigationService();
