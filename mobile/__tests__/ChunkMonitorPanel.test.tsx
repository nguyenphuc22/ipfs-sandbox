import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../src/styles';
import { ChunkMonitorPanel } from '../src/components/ipfs/ChunkMonitorPanel';
import type { FileAccessManifest } from '../src/services/AnonymousFileAccessService';
import type { ChunkProgressState } from '../src/types/download';

jest.mock('../src/utils/clipboard', () => ({
  setString: jest.fn(),
  getString: jest.fn(async () => ''),
}));

const renderWithTheme = (ui: React.ReactElement) => render(<ThemeProvider>{ui}</ThemeProvider>);

const createManifest = (): FileAccessManifest => ({
  success: true,
  file: {
    id: 'file-1',
    name: 'Demo File',
    size: 2048,
    chunkCount: 2,
    mimeType: 'text/plain',
  },
  chunkManifest: [
    { index: 0, cid: 'cid-0', size: 1024, hash: 'hash-0' },
    { index: 1, cid: 'cid-1', size: 1024, hash: 'hash-1' },
  ],
  ownershipPolicy: {
    publicKey: 'owner-public-key',
    status: 'active',
    revoked: false,
  },
  grantContext: {
    grantedAt: new Date().toISOString(),
    expiresAt: null,
    accessCount: 1,
    hasLocalKey: true,
    keyPackageFingerprint: 'fingerprint',
    keyStatus: 'client-managed',
  },
});

const createChunkState = (status: 'pending' | 'downloading' | 'verifying' | 'completed' | 'error'): ChunkProgressState => ({
  chunkProgress: [
    {
      index: 0,
      status,
      hash: 'hash-0',
      size: 1024,
      error: null,
      retries: 0,
    },
  ],
  progressPercent: status === 'completed' ? 100 : 0,
});

describe('ChunkMonitorPanel', () => {
  it('renders loading banner when loading', () => {
    const { getByText } = renderWithTheme(
      <ChunkMonitorPanel
        manifest={null}
        chunkState={createChunkState('pending')}
        isLoading
        error={null}
        demoModeEnabled={false}
        localKeyPackage={null}
      />,
    );

    expect(getByText('Đang tải manifest chunk…')).toBeTruthy();
  });

  it('renders error banner when error provided', () => {
    const { getByText } = renderWithTheme(
      <ChunkMonitorPanel
        manifest={null}
        chunkState={createChunkState('pending')}
        isLoading={false}
        error="Failed to load"
        demoModeEnabled={false}
        localKeyPackage={null}
      />,
    );

    expect(getByText('Failed to load')).toBeTruthy();
  });

  it('displays chunk information when manifest available', () => {
    const manifest = createManifest();
    const { getByText } = renderWithTheme(
      <ChunkMonitorPanel
        manifest={manifest}
        chunkState={createChunkState('completed')}
        isLoading={false}
        error={null}
        demoModeEnabled={true}
        localKeyPackage={{ masterKey: 'master', chunkKeys: { 0: 'chunk-key' } }}
      />,
    );

    expect(getByText('Storage Monitor')).toBeTruthy();
    expect(getByText('Chunk #0')).toBeTruthy();
    expect(getByText(/Tiến độ/)).toBeTruthy();
  });
});
