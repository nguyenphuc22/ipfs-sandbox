import { filterFilesByOwnership } from '../fileListFilters';
import { FileData } from '../../types';

const buildFile = (overrides: Partial<FileData> = {}): FileData => ({
  id: overrides.id ?? `file-${Math.random().toString(36).slice(2, 8)}`,
  name: overrides.name ?? 'test.txt',
  size: overrides.size ?? 1024,
  uploadTime: overrides.uploadTime ?? new Date('2023-01-01T00:00:00Z'),
  status: overrides.status ?? 'active',
  ipfsHash: overrides.ipfsHash,
  metadataHash: overrides.metadataHash,
  ownershipPublicKey: overrides.ownershipPublicKey,
  masterKey: overrides.masterKey,
  keyStatus: overrides.keyStatus,
  hasLocalKey: overrides.hasLocalKey,
  keyIssuedAt: overrides.keyIssuedAt,
  keyPackageFingerprint: overrides.keyPackageFingerprint,
  localKeyPackage: overrides.localKeyPackage,
  ringMembers: overrides.ringMembers,
  mimeType: overrides.mimeType,
  grantedAt: overrides.grantedAt,
  uploaderName: overrides.uploaderName,
  chunkCount: overrides.chunkCount,
  chunks: overrides.chunks,
});

describe('filterFilesByOwnership', () => {
  const ownerKeyNormalized = '02aabbccddeeff00112233445566778899aabbccddee11223344556677889900';
  const ownerKeyVariant = '0x02AAbBCCdDEeFf00112233445566778899aaBBCcddeE11223344556677889900';
  const otherOwnerKey = '0355aa33bb66cc99ddeeff00112233445566778899aabbccddeeff0011223344';

  it('keeps only matching ownership files when filtering is enabled', () => {
    const files: FileData[] = [
      buildFile({ id: 'owner', ownershipPublicKey: ownerKeyVariant }),
      buildFile({ id: 'shared', ownershipPublicKey: otherOwnerKey }),
      buildFile({ id: 'no-owner', ownershipPublicKey: undefined }),
    ];

    const filtered = filterFilesByOwnership(files, {
      normalizedOwnerKey: ownerKeyNormalized,
      skipOwnershipFilter: false,
    });

    expect(filtered).toHaveLength(2);
    expect(filtered.map((file) => file.id)).toEqual(expect.arrayContaining(['owner', 'no-owner']));
    expect(filtered.find((file) => file.id === 'shared')).toBeUndefined();
  });

  it('returns all files when filtering is skipped (recipient view)', () => {
    const files: FileData[] = [
      buildFile({ id: 'owner', ownershipPublicKey: ownerKeyVariant }),
      buildFile({ id: 'shared', ownershipPublicKey: otherOwnerKey }),
    ];

    const filtered = filterFilesByOwnership(files, {
      normalizedOwnerKey: ownerKeyNormalized,
      skipOwnershipFilter: true,
    });

    expect(filtered).toHaveLength(2);
    expect(filtered.map((file) => file.id)).toEqual(expect.arrayContaining(['owner', 'shared']));
  });

  it('returns all files when normalized owner key is missing', () => {
    const files: FileData[] = [
      buildFile({ id: 'shared', ownershipPublicKey: otherOwnerKey }),
    ];

    const filtered = filterFilesByOwnership(files, {});

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('shared');
  });
});
