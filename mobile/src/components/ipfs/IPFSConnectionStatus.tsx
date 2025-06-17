import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useIPFS } from '../../hooks';
import { useTheme } from '../../styles';

export const IPFSConnectionStatus: React.FC = () => {
  const { connectionState, checkConnection, switchToMockMode, switchToOnlineMode } = useIPFS();
  const { colors } = useTheme();

  const getStatusColor = () => {
    if (connectionState.isConnecting) return colors.warning;
    if (connectionState.isMockMode) return colors.info;
    if (connectionState.isHealthy && connectionState.isConnected) return colors.success;
    return colors.error;
  };

  const getStatusText = () => {
    if (connectionState.isConnecting) return 'Connecting...';
    if (connectionState.isMockMode) return 'Mock Mode';
    if (connectionState.isHealthy && connectionState.isConnected) return 'Connected';
    return 'Disconnected';
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
      elevation: 2,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    statusIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 8,
      backgroundColor: getStatusColor(),
    },
    statusText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
    },
    refreshButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    refreshButtonText: {
      color: colors.onPrimary,
      fontSize: 12,
      fontWeight: '500',
    },
    detailsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    modeButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: connectionState.isMockMode ? colors.secondary : colors.info,
      borderRadius: 4,
      marginRight: 8,
    },
    modeButtonText: {
      color: colors.onPrimary,
      fontSize: 12,
      fontWeight: '500',
    },
    lastChecked: {
      fontSize: 12,
      color: colors.textSecondary,
      flex: 1,
      textAlign: 'right',
    },
    errorText: {
      fontSize: 12,
      color: colors.error,
      marginTop: 4,
      fontStyle: 'italic',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View style={styles.statusIndicator} />
          <Text style={styles.statusText}>
            IPFS Gateway: {getStatusText()}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.refreshButton, connectionState.isConnecting && { opacity: 0.5 }]}
          onPress={checkConnection}
          disabled={connectionState.isConnecting}
        >
          <Text style={styles.refreshButtonText}>
            {connectionState.isConnecting ? 'Checking...' : 'Refresh'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.detailsRow}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => connectionState.isMockMode ? switchToOnlineMode() : switchToMockMode()}
          >
            <Text style={styles.modeButtonText}>
              {connectionState.isMockMode ? 'Switch to Online' : 'Switch to Mock'}
            </Text>
          </TouchableOpacity>
        </View>

        {connectionState.lastChecked && (
          <Text style={styles.lastChecked}>
            Last checked: {connectionState.lastChecked.toLocaleTimeString()}
          </Text>
        )}
      </View>

      {connectionState.error && (
        <Text style={styles.errorText}>
          Error: {connectionState.error}
        </Text>
      )}
    </View>
  );
};