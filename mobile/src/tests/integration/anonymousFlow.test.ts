/**
 * Integration Smoke Test: Mobile Anonymous Flow
 * 
 * Tests the complete flow: init identity → fetch anonymous list → negotiate access → download chunk → send integrity alert
 */

import { AnonymousFileAccessService } from '../../services/AnonymousFileAccessService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage for testing
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

describe('AnonymousFileAccessService - Integration Smoke Test', () => {
  let anonymousService: AnonymousFileAccessService;
  const mockPublicKey = '02a34d7f1e8a1f2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c';
  const mockSecretKey = '5a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b';

  beforeEach(() => {
    anonymousService = new AnonymousFileAccessService('http://localhost:3000');
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  it('should complete the full anonymous flow: init identity → fetch list → access negotiation → integrity alert', async () => {
    // Step 1: Initialize identity (set public/secret keys in storage)
    (AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>)
      .mockImplementation((key: string) => {
        if (key === 'aot_public_key') return Promise.resolve(mockPublicKey);
        if (key === 'aot_secret_key') return Promise.resolve(mockSecretKey);
        return Promise.resolve(null);
      });

    // Mock the API responses
    const mockAccessibleFiles = [
      {
        fileId: 'file123',
        fileName: 'test-file.txt',
        fileSize: 1024,
        chunkCount: 1,
        mimeType: 'text/plain',
        ownerPublicKey: '02a34d7f1e8a1f2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c',
        ownershipStatus: 'active',
        grantedAt: '2023-01-01T00:00:00Z',
        expiresAt: null,
        accessCount: 1,
        uploadedAt: '2023-01-01T00:00:00Z',
      }
    ];

    const mockAccessManifest = {
      success: true,
      file: {
        id: 'file123',
        name: 'test-file.txt',
        size: 1024,
        chunkCount: 1,
        mimeType: 'text/plain',
      },
      chunkManifest: [
        {
          index: 0,
          cid: 'QmTestChunkCid',
          size: 1024,
          hash: 'mockHash123',
        }
      ],
      ownershipPolicy: {
        publicKey: '02a34d7f1e8a1f2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c',
        status: 'active',
        revoked: false,
      },
      grantContext: {
        grantedAt: '2023-01-01T00:00:00Z',
        expiresAt: null,
        accessCount: 1,
      }
    };

    // Mock the network requests
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: jest.fn(() => null) },
        text: () =>
          Promise.resolve(
            JSON.stringify({ files: mockAccessibleFiles, success: true, totalCount: 1 }),
          ),
      } as unknown as Response) // For listAccessibleFiles
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockAccessManifest),
      } as unknown as Response) // For negotiateAccess
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true, message: 'Integrity alert recorded' }),
      } as unknown as Response); // For reportIntegrityAlert

    // Step 2: Fetch anonymous list
    const accessibleFilesResult = await anonymousService.listAccessibleFiles();
    expect(accessibleFilesResult).toBeDefined();
    expect(accessibleFilesResult.files.length).toBe(1);
    expect(accessibleFilesResult.files[0].fileId).toBe('file123');

    // Step 3: Negotiate access to a file
    const accessManifest = await anonymousService.negotiateAccess('file123');
    expect(accessManifest).toBeDefined();
    expect(accessManifest.success).toBe(true);
    expect(accessManifest.file.id).toBe('file123');

    // Step 4: Send integrity alert (simulated)
    await anonymousService.reportIntegrityAlert({
      fileId: 'file123',
      chunkIndex: 0,
      expectedHash: 'expectedHash123',
      actualHash: 'actualHash456',
      retryCount: 0,
    });

    // Verify all API calls were made with proper parameters
    expect(fetchSpy).toHaveBeenCalledTimes(3);
    
    // Verify the calls were to the correct endpoints
    const calls = (global.fetch as jest.Mock).mock.calls;
    expect(calls[0][0]).toContain('/api/files/anonymous-list');
    expect(calls[1][0]).toContain('/api/files/file123/anonymous-access');
    expect(calls[2][0]).toContain('/api/files/file123/anonymous-integrity-alert');
  });

  it('should verify that identity exists before allowing anonymous operations', async () => {
    // Set up mock for identity check
    (AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>)
      .mockResolvedValueOnce(mockPublicKey)
      .mockResolvedValueOnce(mockSecretKey);

    const hasIdentity = await anonymousService.hasIdentity();
    expect(hasIdentity).toBe(true);
  });

  it('should fail gracefully when identity is not initialized', async () => {
    // Mock that no identity exists
    (AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>)
      .mockImplementation(() => Promise.resolve(null));

    const hasIdentity = await anonymousService.hasIdentity();
    expect(hasIdentity).toBe(false);
    
    // Attempt to call a method that requires identity
    await expect(anonymousService.listAccessibleFiles()).rejects.toThrow(
      'Public key not found. Please initialize your identity first.'
    );
  });
});
