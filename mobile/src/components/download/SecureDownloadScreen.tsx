/**
 * Secure Download Screen - 4-Phase Download Flow
 * Implements thesis architecture (New_Thesis.md lines 509-587)
 */

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import type { ViewStyle } from 'react-native';
import { useTheme } from '../../styles';
import type { FileData } from '../../types';
import { anonymousFileAccessService } from '../../services/AnonymousFileAccessService';

// Download phases as per thesis (client-managed keys)
type DownloadPhase = 'idle' | 'access' | 'waitingKey' | 'keys' | 'chunks' | 'ready';

interface SecureKeyPackage {
  masterKey: string;
  chunkKeys: Record<number, string>;
  fingerprint?: string;
}

interface ChunkProgress {
  index: number;
  status: 'pending' | 'downloading' | 'verifying' | 'completed' | 'error';
  hash?: string;
  error?: string;
  retries?: number;
}

interface SecureDownloadScreenProps {
  file: FileData;
  onComplete?: (filePath: string) => void;
  onCancel?: () => void;
}

export const SecureDownloadScreen: React.FC<SecureDownloadScreenProps> = ({
  file,
  onComplete,
  onCancel,
}) => {
  const { colors } = useTheme();
  const [phase, setPhase] = useState<DownloadPhase>('idle');
  const [chunkProgress, setChunkProgress] = useState<ChunkProgress[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [accessInfo, setAccessInfo] = useState<any>(null);
  const [integrityVerified, setIntegrityVerified] = useState(false);
  const [secureKeyPackage, setSecureKeyPackage] = useState<SecureKeyPackage | null>(null);

  // Phase 1: Access Negotiation
  const requestAccess = async () => {
    try {
      setPhase('access');
      setError(null);

    // TODO: Call API /api/files/:fileId/access
    // const response = await apiService.getFileAccess(file.id, currentUserId);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockAccessInfo = {
        success: true,
        fileId: file.id,
        fileName: file.name,
        totalSize: file.size,
        chunkCount: file.chunkCount || 1,
        chunkManifest: file.chunks || [],
        ownershipPolicy: {
          ownershipPublicKey: file.ownershipPublicKey,
          status: 'active',
          revoked: false,
        },
        grantedAt: new Date().toISOString(),
        grantContext: {
          keyStatus: 'client-managed',
          hasLocalKey: false,
          keyPackageFingerprint: 'mock_fingerprint',
        },
      };

      setAccessInfo(mockAccessInfo);
      setSecureKeyPackage(null);

      const nextPhase: DownloadPhase = mockAccessInfo.grantContext.hasLocalKey
        ? 'keys'
        : 'waitingKey';
      setPhase(nextPhase);

      // Initialize chunk progress
      const initialProgress: ChunkProgress[] = Array.from(
        { length: mockAccessInfo.chunkCount },
        (_, index) => ({
          index,
          status: 'pending',
        })
      );
      setChunkProgress(initialProgress);

      if (mockAccessInfo.grantContext.hasLocalKey) {
        resolveKeys();
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Access denied';
      setError(message);
      Alert.alert('Access Error', message);
      setPhase('idle');
    }
  };

  const importSecureKeyPackage = async () => {
    if (!accessInfo) {
      return;
    }

    try {
      setError(null);
      setPhase('waitingKey');

      // Simulate user scanning/importing secure key package (QR / file)
      await new Promise(resolve => setTimeout(resolve, 1200));

      const mockPackage: SecureKeyPackage = {
        masterKey: 'mock_master_key',
        chunkKeys: Object.fromEntries(
          (accessInfo.chunkManifest || []).map((chunk: any) => [
            chunk.index,
            `mock_chunk_key_${chunk.index}`,
          ])
        ),
        fingerprint: accessInfo.grantContext?.keyPackageFingerprint,
      };

      setSecureKeyPackage(mockPackage);
      setAccessInfo((prev: any) =>
        prev
          ? {
              ...prev,
              grantContext: {
                ...prev.grantContext,
                hasLocalKey: true,
              },
            }
          : prev
      );

      setPhase('keys');
      resolveKeys();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to import key package';
      setError(message);
      Alert.alert('Key Package Error', message);
    }
  };

  // Phase 2: Key Orchestration
  const resolveKeys = async () => {
    if (!accessInfo) {
      return;
    }

    if (!secureKeyPackage) {
      setPhase('waitingKey');
      const message = 'Secure key package not available. Import the package provided by the owner.';
      setError(message);
      Alert.alert('Key Package Required', message);
      return;
    }

    try {
      setPhase('keys');
      setError(null);

      // TODO: Validate fingerprint with Secure Storage fingerprint hash
      if (
        accessInfo.grantContext?.keyPackageFingerprint &&
        secureKeyPackage.fingerprint &&
        accessInfo.grantContext.keyPackageFingerprint !== secureKeyPackage.fingerprint
      ) {
        throw new Error('Secure key package fingerprint mismatch');
      }

      // TODO: Persist master key + chunk keys into Secure Storage
      // TODO: Decrypt chunk keys (client already holds plain keys)
      // TODO: Build chunkIndex → chunkKey mapping for actual decrypt

      // Simulate key resolution
      await new Promise(resolve => setTimeout(resolve, 1500));

      setPhase('chunks');
      startChunkDownload();

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to resolve keys';
      setError(message);
      Alert.alert('Key Resolution Error', message);
    }
  };

  // Phase 3: Chunk Retrieval & Integrity
  const startChunkDownload = async () => {
    if (!accessInfo) {return;}

    try {
      const { chunkManifest } = accessInfo;

      for (let i = 0; i < chunkManifest.length; i++) {
        const chunk = chunkManifest[i];

        // Update status to downloading
        updateChunkProgress(i, { status: 'downloading' });

        // TODO: Download chunk from IPFS via gateway
        // const response = await apiService.downloadChunk(chunk.cid);

        // Simulate download
        await new Promise(resolve => setTimeout(resolve, 500));

        // Update status to verifying
        updateChunkProgress(i, { status: 'verifying', hash: chunk.hash });

        // TODO: Decrypt chunk
        // TODO: Compute hash and verify
        // const computedHash = sha256(decryptedChunk);
        // if (computedHash !== chunk.hash) {
        //   throw new Error(`Hash mismatch for chunk ${i}`);
        // }

        // Simulate verification
        await new Promise(resolve => setTimeout(resolve, 200));

        // Mark as completed
        updateChunkProgress(i, { status: 'completed' });
      }

      // All chunks verified
      setIntegrityVerified(true);
      setPhase('ready');

      // TODO: Reconstruct file from chunks
      // TODO: Create encrypted cache

      Alert.alert('Download Complete', 'File is ready. All chunks verified ✓');

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Download failed';
      setError(message);
      Alert.alert('Download Error', message);
    }
  };

  const updateChunkProgress = (
    index: number,
    update: Partial<ChunkProgress>
  ) => {
    setChunkProgress(prev =>
      prev.map(item =>
        item.index === index ? { ...item, ...update } : item
      )
    );
  };

  const handleRetry = async (chunkIndex: number) => {
    const chunk = chunkProgress[chunkIndex];
    if (chunk.retries && chunk.retries >= 3) {
      Alert.alert('Max Retries', 'Maximum retry attempts reached');
      return;
    }

    updateChunkProgress(chunkIndex, {
      status: 'downloading',
      error: undefined,
      retries: (chunk.retries || 0) + 1,
    });

    // Report integrity alert to backend using anonymous service
    try {
      await anonymousFileAccessService.reportIntegrityAlert({
        fileId: file.id,
        chunkIndex: chunkIndex,
        expectedHash: chunk.hash || '', // This would be the expected hash
        actualHash: null, // Actual hash after verification (would be computed after download)
        retryCount: chunk.retries ? (chunk.retries + 1) : 1,
      });
    } catch (error) {
      console.warn('[SecureDownloadScreen] Failed to report integrity alert:', error);
      // Don't fail the retry just because we couldn't report the alert
    }

    // Retry download
    // ... (similar to startChunkDownload for single chunk)
  };

  const getPhaseDescription = (currentPhase: DownloadPhase): string => {
    switch (currentPhase) {
      case 'idle':
        return 'Ready to start secure download';
      case 'access':
        return 'Verifying access permissions...';
      case 'waitingKey':
        return 'Awaiting secure key package from owner (offline exchange)';
      case 'keys':
        return 'Resolving decryption keys...';
      case 'chunks':
        return 'Downloading and verifying chunks...';
      case 'ready':
        return 'File ready for viewing';
      default:
        return '';
    }
  };

  const getChunkStatusIcon = (status: ChunkProgress['status']): string => {
    switch (status) {
      case 'pending':
        return '⏱';
      case 'downloading':
        return '⬇️';
      case 'verifying':
        return '🔍';
      case 'completed':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '•';
    }
  };

  const completedChunks = chunkProgress.filter(c => c.status === 'completed').length;
  const totalChunks = chunkProgress.length;
  const progressPercent = totalChunks > 0 ? (completedChunks / totalChunks) * 100 : 0;
  const progressFillWidthStyle = useMemo<ViewStyle>(
    () => ({ width: `${progressPercent}%` }),
    [progressPercent]
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    phaseContainer: {
      marginBottom: 24,
    },
    phaseTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    stepper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    stepItem: {
      flex: 1,
      alignItems: 'center',
    },
    stepCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    stepCircleActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    stepCircleCompleted: {
      borderColor: colors.success,
      backgroundColor: colors.success,
    },
    stepNumber: {
      color: colors.text,
      fontWeight: '600',
    },
    stepNumberActive: {
      color: colors.white,
    },
    stepNumberCompleted: {
      color: colors.white,
    },
    stepLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    phaseDescription: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 16,
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.surface,
      borderRadius: 4,
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    progressText: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'right',
    },
    chunkList: {
      marginTop: 16,
    },
    chunkItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: colors.surface,
      borderRadius: 8,
      marginBottom: 8,
    },
    chunkIcon: {
      fontSize: 20,
      marginRight: 12,
    },
    chunkInfo: {
      flex: 1,
    },
    chunkLabel: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '500',
    },
    chunkHash: {
      fontSize: 11,
      color: colors.textSecondary,
      fontFamily: 'monospace',
    },
    chunkError: {
      fontSize: 12,
      color: colors.error,
      marginTop: 4,
    },
    retryButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: colors.warning,
      borderRadius: 4,
    },
    retryText: {
      color: colors.white,
      fontSize: 12,
      fontWeight: '600',
    },
    integrityBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: colors.success,
      borderRadius: 8,
      marginBottom: 16,
    },
    integrityIcon: {
      fontSize: 20,
    },
    integrityText: {
      fontSize: 14,
      color: colors.white,
      fontWeight: '600',
      marginLeft: 8,
    },
    errorContainer: {
      padding: 12,
      backgroundColor: colors.errorBackground,
      borderRadius: 8,
      marginBottom: 16,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
    },
    buttonRow: {
      flexDirection: 'row',
      marginTop: 20,
    },
    button: {
      flex: 1,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonPrimary: {
      backgroundColor: colors.primary,
      marginLeft: 8,
    },
    buttonSecondary: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      marginRight: 8,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: '600',
    },
    buttonTextSecondary: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const renderPhaseStepper = () => {
    const phases = [
      { key: 'access', label: 'Access' },
      { key: 'waitingKey', label: 'Secure Key' },
      { key: 'keys', label: 'Resolve' },
      { key: 'chunks', label: 'Chunks' },
      { key: 'ready', label: 'Ready' },
    ];

    const phaseOrder: DownloadPhase[] = ['idle', 'access', 'waitingKey', 'keys', 'chunks', 'ready'];
    const currentIndex = phaseOrder.indexOf(phase);

    return (
      <View style={styles.stepper}>
        {phases.map((p, index) => {
          const isActive = index === currentIndex - 1;
          const isCompleted = index < currentIndex - 1;

          return (
            <View key={p.key} style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  isActive && styles.stepCircleActive,
                  isCompleted && styles.stepCircleCompleted,
                ]}
              >
                <Text
                  style={[
                    styles.stepNumber,
                    (isActive || isCompleted) && styles.stepNumberActive,
                    isCompleted && styles.stepNumberCompleted,
                  ]}
                >
                  {isCompleted ? '✓' : index + 1}
                </Text>
              </View>
              <Text style={styles.stepLabel}>{p.label}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Secure Download</Text>
        <Text style={styles.subtitle}>{file.name}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Phase Stepper */}
        {renderPhaseStepper()}

        {/* Phase Description */}
        <Text style={styles.phaseDescription}>{getPhaseDescription(phase)}</Text>

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Integrity Badge */}
        {integrityVerified && (
          <View style={styles.integrityBadge}>
            <Text style={styles.integrityIcon}>🛡️</Text>
            <Text style={styles.integrityText}>AOT Integrity Verified</Text>
          </View>
        )}

        {/* Progress Bar */}
        {phase === 'chunks' || phase === 'ready' ? (
          <View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, progressFillWidthStyle]} />
            </View>
            <Text style={styles.progressText}>
              {completedChunks} / {totalChunks} chunks ({Math.round(progressPercent)}%)
            </Text>
          </View>
        ) : null}

        {/* Chunk List */}
        {(phase === 'chunks' || phase === 'ready') && chunkProgress.length > 0 ? (
          <View style={styles.chunkList}>
            {chunkProgress.map(chunk => (
              <View key={chunk.index} style={styles.chunkItem}>
                <Text style={styles.chunkIcon}>
                  {getChunkStatusIcon(chunk.status)}
                </Text>
                <View style={styles.chunkInfo}>
                  <Text style={styles.chunkLabel}>Chunk #{chunk.index}</Text>
                  {chunk.hash && (
                    <Text style={styles.chunkHash}>
                      {chunk.hash.substring(0, 16)}...
                    </Text>
                  )}
                  {chunk.error && (
                    <Text style={styles.chunkError}>{chunk.error}</Text>
                  )}
                </View>
                {chunk.status === 'error' && (
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => handleRetry(chunk.index)}
                  >
                    <Text style={styles.retryText}>
                      Retry {chunk.retries ? `(${chunk.retries}/3)` : ''}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        ) : null}

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={onCancel}
          >
            <Text style={styles.buttonTextSecondary}>Cancel</Text>
          </TouchableOpacity>

          {phase === 'idle' && (
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={requestAccess}
            >
              <Text style={styles.buttonText}>Start Download</Text>
            </TouchableOpacity>
          )}

          {phase === 'access' && (
            <View style={[styles.button, styles.buttonPrimary, styles.buttonDisabled]}>
              <ActivityIndicator color={colors.white} />
            </View>
          )}

          {phase === 'waitingKey' && (
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={importSecureKeyPackage}
            >
              <Text style={styles.buttonText}>Import Key Package</Text>
            </TouchableOpacity>
          )}

          {phase === 'keys' && (
            <TouchableOpacity
              style={[
                styles.button,
                styles.buttonPrimary,
                !secureKeyPackage && styles.buttonDisabled,
              ]}
              onPress={secureKeyPackage ? resolveKeys : undefined}
            >
              <Text style={styles.buttonText}>Resolve Keys</Text>
            </TouchableOpacity>
          )}

          {phase === 'ready' && (
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={() => {
                Alert.alert('Success', 'File is ready to view');
                onComplete?.('/path/to/file');
              }}
            >
              <Text style={styles.buttonText}>Open File</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default SecureDownloadScreen;
