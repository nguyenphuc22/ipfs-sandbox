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
  Platform,
} from 'react-native';
import type { ViewStyle } from 'react-native';
import { useTheme } from '../../styles';
import type { FileData } from '../../types';
import { anonymousFileAccessService } from '../../services/AnonymousFileAccessService';
import type { FileAccessManifest } from '../../services/AnonymousFileAccessService';
import { getKeyPackage, saveKeyPackage } from '../../services/KeyPackageStorage';
import { useChunkDownloader } from '../../hooks';
import type { ChunkStatus, DownloadPhase, SecureKeyPackage } from '../../types/download';
import { chunkDownloadManager } from '../../services/chunkDownloadManager';

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
  const { session, actions } = useChunkDownloader(file.id);
  const { phase, chunkProgress, integrityVerified, error: sessionError } = session;
  const [error, setError] = useState<string | null>(null);
  const [accessInfo, setAccessInfo] = useState<FileAccessManifest | null>(null);
  const [secureKeyPackage, setSecureKeyPackage] = useState<SecureKeyPackage | null>(null);
  const shouldPersistKeyPackage = useMemo(
    () => __DEV__ || (typeof process !== 'undefined' && process.env?.KEY_MONITOR_DEMO === 'true'),
    [],
  );
  const combinedError = error ?? sessionError;
  const sandboxPath = session.sandboxPath;
  const exportPath = session.exportPath;

  // Phase 1: Access Negotiation
  const requestAccess = async () => {
    try {
      actions.setPhase('access');
      actions.setError(null);
      setError(null);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const providedChunks = file.chunks && file.chunks.length > 0 ? file.chunks : undefined;
      const inferredChunkCount = providedChunks?.length ?? file.chunkCount ?? 1;
      const fallbackChunkSize = inferredChunkCount > 0
        ? Math.round((file.size ?? 0) / inferredChunkCount)
        : 0;

      const storedPackage = await getKeyPackage(file.id);
      const storedSecurePackage: SecureKeyPackage | null = storedPackage && Object.keys(storedPackage.chunkKeys).length > 0
        ? {
            masterKey: storedPackage.masterKey,
            chunkKeys: storedPackage.chunkKeys,
            fingerprint: storedPackage.fingerprint,
          }
        : null;
      const localPackage: SecureKeyPackage | null = file.localKeyPackage
        ? {
            masterKey: file.localKeyPackage.masterKey,
            chunkKeys: file.localKeyPackage.chunkKeys,
            fingerprint: file.localKeyPackage.fingerprint,
          }
        : null;
      const hydratedPackage: SecureKeyPackage | null = storedSecurePackage ?? localPackage;
      const chunkManifest = (providedChunks ?? Array.from({ length: inferredChunkCount }, (_, index) => ({
        index,
        cid: `demo_cid_${index}`,
        hash: `demo_hash_${index}`,
      }))).map(chunk => ({
        index: chunk.index,
        cid: chunk.cid,
        size: fallbackChunkSize,
        hash: chunk.hash,
      }));

  const hasLocalKeyMaterial = Boolean(hydratedPackage);
  const hasLocalKeyFlag = Boolean(file.hasLocalKey);
  const manifestHasLocalKey = hasLocalKeyMaterial || hasLocalKeyFlag;

      const mockManifest: FileAccessManifest = {
        success: true,
        file: {
          id: file.id,
          name: file.name,
          size: file.size,
          chunkCount: inferredChunkCount,
          mimeType: file.mimeType,
        },
        chunkManifest,
        ownershipPolicy: {
          publicKey: file.ownershipPublicKey ?? 'demo_owner_public_key',
          status: 'active',
          revoked: false,
        },
        grantContext: {
          grantedAt: new Date().toISOString(),
          expiresAt: null,
          accessCount: 1,
          hasLocalKey: manifestHasLocalKey,
          keyPackageFingerprint: file.keyPackageFingerprint ?? 'mock_fingerprint',
          keyStatus: 'client-managed',
        },
      };

      setAccessInfo(mockManifest);
      if (hydratedPackage) {
        setSecureKeyPackage(hydratedPackage);
        actions.setSecureKeyPackage(hydratedPackage);
      } else {
        setSecureKeyPackage(null);
        actions.setSecureKeyPackage(null);
      }
      actions.resetSession();
      actions.ensureSession(mockManifest);

      const nextPhase: DownloadPhase = hasLocalKeyMaterial ? 'keys' : 'waitingKey';
      actions.setPhase(nextPhase);

      if (hasLocalKeyMaterial && hydratedPackage) {
        resolveKeys(hydratedPackage);
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Access denied';
      setError(message);
      Alert.alert('Access Error', message);
      actions.setPhase('idle');
      actions.setError(message);
    }
  };

  const importSecureKeyPackage = async () => {
    if (!accessInfo) {
      return;
    }

    try {
      setError(null);
      actions.setPhase('waitingKey');

      // Simulate user scanning/importing secure key package (QR / file)
      await new Promise(resolve => setTimeout(resolve, 1200));

      const mockPackage: SecureKeyPackage = {
        masterKey: 'mock_master_key',
        chunkKeys: Object.fromEntries(
          (accessInfo.chunkManifest || []).map((chunk: FileAccessManifest['chunkManifest'][number]) => [
            chunk.index,
            `mock_chunk_key_${chunk.index}`,
          ])
        ),
        fingerprint: accessInfo.grantContext?.keyPackageFingerprint,
      };

      setSecureKeyPackage(mockPackage);
      actions.setSecureKeyPackage(mockPackage);
      if (shouldPersistKeyPackage) {
        try {
          await saveKeyPackage(file.id, {
            masterKey: mockPackage.masterKey,
            chunkKeys: mockPackage.chunkKeys,
            fingerprint: mockPackage.fingerprint,
          });
        } catch (storageError) {
          console.warn('[SecureDownloadScreen] Failed to persist imported key package', storageError);
        }
      }
      setAccessInfo((prev: FileAccessManifest | null) =>
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

      actions.setPhase('keys');
      resolveKeys();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to import key package';
      setError(message);
      Alert.alert('Key Package Error', message);
    }
  };

  // Phase 2: Key Orchestration
  const resolveKeys = async (packageOverride: SecureKeyPackage | null = null) => {
    if (!accessInfo) {
      return;
    }

    const activePackage = packageOverride ?? secureKeyPackage;

    if (!activePackage) {
      actions.setPhase('waitingKey');
      const message = 'Secure key package not available. Import the package provided by the owner.';
      setError(message);
      actions.setError(message);
      Alert.alert('Key Package Required', message);
      return;
    }

    try {
      actions.setPhase('keys');
      actions.setError(null);
      setError(null);

      // TODO: Validate fingerprint with Secure Storage fingerprint hash
      if (
        accessInfo.grantContext?.keyPackageFingerprint &&
        activePackage.fingerprint &&
        accessInfo.grantContext.keyPackageFingerprint !== activePackage.fingerprint
      ) {
        throw new Error('Secure key package fingerprint mismatch');
      }

      // TODO: Persist master key + chunk keys into Secure Storage
      // TODO: Decrypt chunk keys (client already holds plain keys)
      // TODO: Build chunkIndex → chunkKey mapping for actual decrypt

      // Simulate key resolution
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (!packageOverride && activePackage !== secureKeyPackage) {
        setSecureKeyPackage(activePackage);
        actions.setSecureKeyPackage(activePackage);
      }

      actions.setPhase('chunks');
      await actions.downloadFile();
      const latestSession = chunkDownloadManager.getState(file.id);
      const successParts = ['File is ready. All chunks verified ✓'];

      if (latestSession.sandboxPath) {
        successParts.push(`Sandbox: ${latestSession.sandboxPath}`);
      }

      if (latestSession.exportPath) {
        successParts.push(`Export: ${latestSession.exportPath}`);
      }

      Alert.alert('Download Complete', successParts.join('\n\n'));

    } catch (err) {
      const extracted = err instanceof Error
        ? err.message
        : typeof err === 'string'
          ? err
          : (err as Record<string, unknown>)?.error?.toString?.();
      const message = extracted && extracted.trim().length > 0
        ? extracted.includes("Property 'error' doesn't exist")
          ? 'Secure key package metadata is malformed. Please refresh access or re-import the package.'
          : extracted
        : 'Failed to resolve keys';
      setError(message);
      actions.setError(message);
      Alert.alert('Key Resolution Error', message);
      actions.setPhase('waitingKey');
    }
  };

  const handleRetry = async (chunkIndex: number) => {
    const chunk = chunkProgress.find(item => item.index === chunkIndex);
    if (!chunk) {
      return;
    }

    if (chunk.retries && chunk.retries >= 3) {
      Alert.alert('Max Retries', 'Maximum retry attempts reached');
      return;
    }

    // Report integrity alert to backend using anonymous service
    try {
      await anonymousFileAccessService.reportIntegrityAlert({
        fileId: file.id,
        chunkIndex: chunkIndex,
        expectedHash: chunk.hash || '', // This would be the expected hash
        actualHash: null, // Actual hash after verification (would be computed after download)
        retryCount: (chunk.retries ?? 0) + 1,
      });
    } catch (error) {
      console.warn('[SecureDownloadScreen] Failed to report integrity alert:', error);
      // Don't fail the retry just because we couldn't report the alert
    }

    try {
      await actions.retryChunk(chunkIndex);
    } catch (retryError) {
      const message = retryError instanceof Error ? retryError.message : 'Failed to retry chunk download';
      setError(message);
      actions.setError(message);
      Alert.alert('Retry Error', message);
    }
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

  const getChunkStatusIcon = (status: ChunkStatus): string => {
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

  const renderPersistenceSummary = () => {
    if (!sandboxPath && !exportPath) {
      return null;
    }

    return (
      <View style={styles.persistenceContainer}>
        <Text style={styles.persistenceTitle}>Saved Paths</Text>
        {sandboxPath ? (
          <View style={styles.persistenceRow}>
            <Text style={styles.persistenceLabel}>Sandbox</Text>
            <Text style={styles.persistenceValue}>{sandboxPath}</Text>
          </View>
        ) : null}
        {exportPath ? (
          <View style={styles.persistenceRow}>
            <Text style={styles.persistenceLabel}>
              {Platform.OS === 'android' ? 'Downloads' : 'Shared Copy'}
            </Text>
            <Text style={styles.persistenceValue}>{exportPath}</Text>
          </View>
        ) : null}
        <Text style={styles.persistenceHint}>
          Use the paths above with adb run-as / adb pull or simctl get_app_container to retrieve the decrypted file for QA.
        </Text>
      </View>
    );
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
    persistenceContainer: {
      marginTop: 24,
      padding: 16,
      borderRadius: 8,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    persistenceTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 10,
    },
    persistenceRow: {
      marginBottom: 8,
    },
    persistenceLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    persistenceValue: {
      fontSize: 12,
      color: colors.text,
      fontFamily: 'monospace',
    },
    persistenceHint: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 12,
      lineHeight: 16,
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

    const phaseOrder: DownloadPhase[] = ['idle', 'access', 'waitingKey', 'keys', 'chunks', 'assembling', 'ready'];
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
        {combinedError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{combinedError}</Text>
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

  {renderPersistenceSummary()}

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
              onPress={secureKeyPackage ? () => resolveKeys(secureKeyPackage) : undefined}
            >
              <Text style={styles.buttonText}>Resolve Keys</Text>
            </TouchableOpacity>
          )}

          {phase === 'ready' && (
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={() => {
                const latestSession = chunkDownloadManager.getState(file.id);
                const callbackPath = latestSession.exportPath ?? latestSession.sandboxPath ?? exportPath ?? sandboxPath;
                const message = callbackPath
                  ? `File is ready to view from:\n${callbackPath}`
                  : 'File is ready to view';
                Alert.alert('Success', message);
                if (callbackPath) {
                  onComplete?.(callbackPath);
                }
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
