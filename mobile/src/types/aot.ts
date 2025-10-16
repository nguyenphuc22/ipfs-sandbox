import { FileData } from './file';

export interface AOTIdentity {
  identifier: string;
  displayName?: string;
  publicKey: string;
  privateKey: string;
  escrowedIdentity?: string | null;
  registeredAt?: string;
}

export interface RegisteredRingMember {
  identifier: string;
  publicKey: string;
  displayName?: string;
  escrowedIdentity?: string | null;
  createdAt?: string;
}

export interface RingContext {
  adjudicatorPublicKey?: string | null;
  ringMemberPublicKeys: string[];
  users: RegisteredRingMember[];
}

export interface AOTUploadPlan {
  metadataPayload: Record<string, any>;
  metadataHash: string;
  masterKey: string;
  ownershipPublicKey: string;
  ringMembers: string[];
  schnorr: {
    R: string;
    s: string;
    message: string;
  };
  ringSignature?: Record<string, any> | null;
}

export interface AOTUploadDraftResult {
  fileData: FileData;
  plan: AOTUploadPlan;
}
