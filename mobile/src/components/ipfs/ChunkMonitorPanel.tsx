import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import clipboard from '../../utils/clipboard';
import { useTheme } from '../../styles';
import { FileAccessManifest } from '../../services/AnonymousFileAccessService';
import type { ChunkProgressState } from '../../types/download';
import type { LocalKeyPackage } from '../../types';
import type { DownloadPhase } from '../../types/download';

const STATUS_ICON: Record<string, string> = {
  pending: '⏱',
  downloading: '⬇️',
  verifying: '🔍',
  completed: '✅',
  error: '⚠️',
};

const abbreviate = (value?: string | null, length = 10) => {
  if (!value) {return '—';}
  if (value.length <= length) {return value;}
  const half = Math.floor((length - 2) / 2);
  return `${value.slice(0, half)}…${value.slice(-half)}`;
};

const maskKey = (value?: string | null, visible = 4) => {
  if (!value) {return '—';}
  if (value.length <= visible * 2) {return value;}
  return `${value.slice(0, visible)}…${value.slice(-visible)}`;
};

const PHASE_LABELS: Record<DownloadPhase, string> = {
  idle: 'chưa bắt đầu',
  access: 'đàm phán quyền truy cập',
  waitingKey: 'chờ khóa',
  keys: 'xử lý khóa',
  chunks: 'tải chunk',
  ready: 'hoàn tất',
};

type ChunkMonitorPanelProps = {
  manifest: FileAccessManifest | null;
  chunkState: ChunkProgressState;
  isLoading: boolean;
  error: string | null;
  localKeyPackage?: LocalKeyPackage | null;
  demoModeEnabled: boolean;
  fingerprint?: string | null;
  phase?: DownloadPhase;
};

export const ChunkMonitorPanel: React.FC<ChunkMonitorPanelProps> = ({
  manifest,
  chunkState,
  isLoading,
  error,
  localKeyPackage,
  demoModeEnabled,
  fingerprint: fingerprintProp,
  phase,
}) => {
  const { colors } = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      marginBottom: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    subtitle: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    banner: {
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
    },
    bannerText: {
      fontSize: 12,
      color: colors.onPrimary,
    },
    infoCard: {
      backgroundColor: colors.surface,
      borderRadius: 10,
      padding: 12,
      marginBottom: 12,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    infoTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    infoText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 6,
    },
    noticeCard: {
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      backgroundColor: colors.error + '10',
    },
    noticeText: {
      fontSize: 12,
      color: colors.error,
    },
    keyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
      gap: 12,
    },
    keyLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    keyValue: {
      fontFamily: 'monospace',
      fontSize: 12,
      color: colors.info,
      flex: 1,
    },
    chunkKeyList: {
      marginTop: 8,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      paddingTop: 8,
      gap: 6,
    },
    chunkKeyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    tableHeader: {
      flexDirection: 'row',
      paddingVertical: 8,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
    tableHeaderCell: {
      flex: 1,
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    tableRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    tableCell: {
      flex: 1,
      fontSize: 12,
      color: colors.text,
      flexWrap: 'wrap',
    },
    statusCell: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    copyButton: {
      backgroundColor: colors.primary + '15',
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginLeft: 8,
    },
    copyText: {
      color: colors.primary,
      fontSize: 10,
      fontWeight: '600',
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 32,
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: 14,
      textAlign: 'center',
    },
  }), [colors]);

  const ownershipStatus = manifest?.ownershipPolicy.status ?? 'unknown';
  const ownershipBadge = `Policy: ${ownershipStatus.toUpperCase()}`;
  const fingerprint = fingerprintProp ?? manifest?.grantContext?.keyPackageFingerprint ?? localKeyPackage?.fingerprint ?? null;
  const chunkKeyEntries = useMemo(
    () =>
      localKeyPackage
        ? Object.entries(localKeyPackage.chunkKeys).sort(
            ([aIndex], [bIndex]) => Number(aIndex) - Number(bIndex),
          )
        : [],
    [localKeyPackage],
  );

  const copyToClipboard = (value?: string) => {
    if (!value) {return;}
    try {
      const result = clipboard.setString(value);
      if (result instanceof Promise) {
        result.catch((error) => {
          if (__DEV__) {
            console.warn('[ChunkMonitor] Failed to set clipboard content', error);
          }
        });
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('[ChunkMonitor] Clipboard unavailable', error);
      }
    }
  };

  const renderBanner = () => {
    if (isLoading) {
      return (
        <View style={[styles.banner, { backgroundColor: colors.primary + '40' }]}>
          <Text style={styles.bannerText}>Đang tải manifest chunk…</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={[styles.banner, { backgroundColor: colors.error + '40' }]}>
          <Text style={styles.bannerText}>{error}</Text>
        </View>
      );
    }

    return null;
  };

  const renderKeySection = () => {
    if (!demoModeEnabled) {
      return (
        <View style={styles.noticeCard}>
          <Text style={styles.noticeText}>
            Chế độ demo bị tắt. Khóa mã hoá sẽ không hiển thị để tránh lộ thông tin nhạy cảm.
          </Text>
        </View>
      );
    }

    if (!localKeyPackage) {
      return (
        <View style={styles.noticeCard}>
          <Text style={styles.noticeText}>
            Yêu cầu key package từ chủ sở hữu để hiển thị khóa và tiếp tục quá trình giải mã.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Khóa mã hoá (Demo)</Text>
        <View style={styles.keyRow}>
          <Text style={styles.keyLabel}>Master Key</Text>
          <Text style={styles.keyValue}>{maskKey(localKeyPackage.masterKey)}</Text>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={() => copyToClipboard(localKeyPackage.masterKey)}
          >
            <Text style={styles.copyText}>Copy</Text>
          </TouchableOpacity>
        </View>

        {fingerprint ? (
          <Text style={styles.infoText}>Fingerprint: {maskKey(fingerprint, 6)}</Text>
        ) : null}

        <View style={styles.chunkKeyList}>
          {chunkKeyEntries.length === 0 ? (
            <Text style={styles.infoText}>Không có chunk key nào được lưu.</Text>
          ) : (
            chunkKeyEntries.map(([index, key]) => (
              <View key={index} style={styles.chunkKeyRow}>
                <Text style={styles.keyLabel}>Chunk #{index}</Text>
                <Text style={[styles.keyValue, { flex: 1 }]}>{maskKey(key)}</Text>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={() => copyToClipboard(key)}
                >
                  <Text style={styles.copyText}>Copy</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </View>
    );
  };

  const subtitleText = useMemo(() => {
    if (!manifest) {
      return 'Không có dữ liệu manifest';
    }

    const parts = [
      `${manifest.chunkManifest.length} chunks`,
      ownershipBadge,
      `Tiến độ ${(chunkState.progressPercent).toFixed(0)}%`,
    ];

    if (phase) {
      const phaseLabel = PHASE_LABELS[phase] ?? phase;
      parts.push(`Pha ${phaseLabel}`);
    }

    return parts.join(' • ');
  }, [manifest, ownershipBadge, chunkState.progressPercent, phase]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Storage Monitor</Text>
        <Text style={styles.subtitle}>{subtitleText}</Text>
      </View>

      {renderBanner()}
      {renderKeySection()}

      {!manifest && !isLoading && !error ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Không thể hiển thị monitor vì manifest chưa được tải. Hãy thử tải lại hoặc kiểm tra quyền truy cập.
          </Text>
        </View>
      ) : (
        <ScrollView>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>#</Text>
            <Text style={styles.tableHeaderCell}>CID</Text>
            <Text style={styles.tableHeaderCell}>Hash</Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Kích thước</Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Trạng thái</Text>
          </View>

          {chunkState.chunkProgress.map((chunk) => (
            <View key={chunk.index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 0.5 }]}>{chunk.index}</Text>

              <View style={[styles.tableCell, { flexDirection: 'row', alignItems: 'center' }]}>
                <Text>{abbreviate(manifest?.chunkManifest.find((c) => c.index === chunk.index)?.cid)}</Text>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={() =>
                    copyToClipboard(
                      manifest?.chunkManifest.find((c) => c.index === chunk.index)?.cid,
                    )
                  }
                >
                  <Text style={styles.copyText}>Copy</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.tableCell, { flexDirection: 'row', alignItems: 'center' }]}>
                <Text>{abbreviate(chunk.hash)}</Text>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={() => copyToClipboard(chunk.hash)}
                >
                  <Text style={styles.copyText}>Copy</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.tableCell, { flex: 0.8 }]}>
                {chunk.size ? `${(chunk.size / (1024 * 1024)).toFixed(2)} MB` : '—'}
              </Text>

              <View style={[styles.tableCell, styles.statusCell, { flex: 0.8 }]}>
                <Text>{STATUS_ICON[chunk.status] ?? '•'}</Text>
                <Text>{chunk.status}</Text>
                {chunk.error ? <Text style={{ color: colors.error }}>({chunk.error})</Text> : null}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};
