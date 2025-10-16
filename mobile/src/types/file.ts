export interface FileData {
  id: string;
  name: string;
  size: number;
  uploadTime: Date;
  status: FileStatus;
  ipfsHash?: string;
  metadataHash?: string;
  ownershipPublicKey?: string;
  masterKey?: string;
  keyStatus?: string;
  hasLocalKey?: boolean;
  keyIssuedAt?: string;
  keyPackageFingerprint?: string;
  localKeyPackage?: LocalKeyPackage;
  ringMembers?: string[];
  mimeType?: string;
  grantedAt?: string;
  uploaderName?: string;
  // Chunked upload fields
  chunkCount?: number;
  chunks?: Array<{
    index: number;
    cid: string;
    hash: string;
  }>;
}

export type FileStatus = 'uploading' | 'completed' | 'error' | 'active' | 'revoked';

export interface LocalKeyPackage {
  masterKey: string;
  chunkKeys: Record<number, string>;
  fingerprint?: string;
  storedAt?: string;
}

export interface FileUploadButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export interface FileItemProps {
  file: FileData;
  onDelete: (id: string) => void;
}

export interface FileListProps {
  files: FileData[];
  onDeleteFile: (id: string) => void;
}
