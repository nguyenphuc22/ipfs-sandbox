import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator, Platform } from 'react-native';
import { IPFSService } from '../../services';
import { useFilePicker } from '../../hooks/useFilePicker';
import { PickedFile } from '../../types/filePicker';

interface AOTDemoCardProps {
  service?: IPFSService;
}

export const AOTDemoCard: React.FC<AOTDemoCardProps> = ({ service }) => {
  const ipfsService = useMemo(() => service ?? new IPFSService(), [service]);
  const filePicker = useFilePicker();

  const [selectedFile, setSelectedFile] = useState<PickedFile | null>(null);
  const [metadataHash, setMetadataHash] = useState('');
  const [ownershipPublicKey, setOwnershipPublicKey] = useState('');
  const [ringSignature, setRingSignature] = useState('');
  const [escrowedIdentity, setEscrowedIdentity] = useState('');
  const [schnorrR, setSchnorrR] = useState('');
  const [schnorrS, setSchnorrS] = useState('');
  const [schnorrMessage, setSchnorrMessage] = useState('');
  const [schnorrPublicKey, setSchnorrPublicKey] = useState('');

  const [uploadState, setUploadState] = useState<{ loading: boolean; result?: string; error?: string }>({
    loading: false,
  });

  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const [revocationMessage, setRevocationMessage] = useState('');
  const [revocationRingSignature, setRevocationRingSignature] = useState('');
  const [revocationR, setRevocationR] = useState('');
  const [revocationS, setRevocationS] = useState('');
  const [revocationProofMessage, setRevocationProofMessage] = useState('');
  const [revocationLoading, setRevocationLoading] = useState(false);
  const [revocationResult, setRevocationResult] = useState<string | null>(null);

  const handlePickFile = async () => {
    const result = await filePicker.pickFiles({ allowMultiSelection: false });
    if (result.success && result.files && result.files.length > 0) {
      setSelectedFile(result.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadState({ loading: false, error: 'Vui lòng chọn file trước.' });
      return;
    }

    if (!metadataHash || !ownershipPublicKey || !schnorrR || !schnorrS || !schnorrMessage) {
      setUploadState({ loading: false, error: 'metadataHash, ownershipPublicKey và Schnorr proof (R, s, message) là bắt buộc.' });
      return;
    }

    setUploadState({ loading: true });
    try {
      const { success, response, error } = await ipfsService.uploadFileWithAOT({
        file: selectedFile,
        metadataHash,
        ownershipPublicKey,
        ringSignature,
        escrowedIdentity,
        schnorr: {
          R: schnorrR,
          s: schnorrS,
          message: schnorrMessage,
          publicKey: schnorrPublicKey || ownershipPublicKey,
        },
      });

      if (!success || !response) {
        setUploadState({ loading: false, error: error || 'Không thể upload với AOT.' });
        return;
      }

      setUploadedFileId(response.fileId || null);
      setUploadState({
        loading: false,
        result: `Upload thành công • CID: ${response.cid} • File ID: ${response.fileId}`,
      });
    } catch (error: any) {
      setUploadState({
        loading: false,
        error: error?.message || 'Upload thất bại.',
      });
    }
  };

  const handleRevocation = async () => {
    if (!uploadedFileId) {
      setRevocationResult('Cần có fileId từ bước upload để tiến hành thu hồi.');
      return;
    }

    if (!revocationR || !revocationS || !revocationProofMessage) {
      setRevocationResult('Thông tin Schnorr proof cho bước thu hồi còn thiếu.');
      return;
    }

    setRevocationLoading(true);
    try {
      const { success, response, error } = await ipfsService.submitAnonymousRevocation({
        fileId: uploadedFileId,
        message: revocationMessage || `revoke:${uploadedFileId}`,
        ringSignature: revocationRingSignature,
        ownershipProof: {
          R: revocationR,
          s: revocationS,
          message: revocationProofMessage,
          publicKey: ownershipPublicKey,
        },
      });

      if (!success || !response) {
        setRevocationResult(error || 'Thu hồi thất bại.');
      } else {
        setRevocationResult(`Thu hồi thành công • ID: ${response.revocationId}`);
      }
    } catch (error: any) {
      setRevocationResult(error?.message || 'Thu hồi thất bại.');
    } finally {
      setRevocationLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>AOT Demo Flow</Text>
      <Text style={styles.subtitle}>Đăng ký & Upload với Anonymous Ownership Token (Schnorr)</Text>

      <Pressable style={styles.button} onPress={handlePickFile}>
        <Text style={styles.buttonText}>{selectedFile ? `Đã chọn: ${selectedFile.name}` : 'Chọn file để upload'}</Text>
      </Pressable>

      <TextInput
        style={[styles.input, styles.inputMono]}
        placeholder="metadataHash (SHA-256)"
        value={metadataHash}
        onChangeText={setMetadataHash}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, styles.inputMono]}
        placeholder="ownershipPublicKey (Schnorr Q)"
        value={ownershipPublicKey}
        onChangeText={setOwnershipPublicKey}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, styles.inputMono]}
        placeholder="ringSignature (tuỳ chọn)"
        value={ringSignature}
        onChangeText={setRingSignature}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, styles.inputMono]}
        placeholder="escrowedIdentity (tuỳ chọn)"
        value={escrowedIdentity}
        onChangeText={setEscrowedIdentity}
        autoCapitalize="none"
      />

      <Text style={styles.sectionLabel}>Schnorr Proof cho bước upload</Text>
      <TextInput
        style={[styles.input, styles.inputMono]}
        placeholder="R (32-byte hex)"
        value={schnorrR}
        onChangeText={setSchnorrR}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, styles.inputMono]}
        placeholder="s (32-byte hex)"
        value={schnorrS}
        onChangeText={setSchnorrS}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, styles.inputMono]}
        placeholder="message (metadata hash)"
        value={schnorrMessage}
        onChangeText={setSchnorrMessage}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, styles.inputMono]}
        placeholder="publicKey override (tuỳ chọn)"
        value={schnorrPublicKey}
        onChangeText={setSchnorrPublicKey}
        autoCapitalize="none"
      />

      <Pressable style={styles.primaryButton} onPress={handleUpload} disabled={uploadState.loading}>
        {uploadState.loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Upload với AOT</Text>}
      </Pressable>

      {uploadState.result ? <Text style={styles.successText}>{uploadState.result}</Text> : null}
      {uploadState.error ? <Text style={styles.errorText}>{uploadState.error}</Text> : null}

      <View style={styles.divider} />

      <Text style={styles.subtitle}>Anonymous Revocation với Schnorr Ownership Proof</Text>
      <TextInput
        style={[styles.input, styles.inputMono]}
        placeholder="Revocation message"
        value={revocationMessage}
        onChangeText={setRevocationMessage}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, styles.inputMono]}
        placeholder="ringSignature (tuỳ chọn)"
        value={revocationRingSignature}
        onChangeText={setRevocationRingSignature}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, styles.inputMono]}
        placeholder="R (revocation)"
        value={revocationR}
        onChangeText={setRevocationR}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, styles.inputMono]}
        placeholder="s (revocation)"
        value={revocationS}
        onChangeText={setRevocationS}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, styles.inputMono]}
        placeholder="message (revocation)"
        value={revocationProofMessage}
        onChangeText={setRevocationProofMessage}
        autoCapitalize="none"
      />

      <Pressable style={styles.secondaryButton} onPress={handleRevocation} disabled={revocationLoading}>
        {revocationLoading ? (
          <ActivityIndicator color="#1a1f36" />
        ) : (
          <Text style={styles.secondaryButtonText}>Gửi yêu cầu thu hồi ẩn danh</Text>
        )}
      </Pressable>

      {revocationResult ? <Text style={styles.infoText}>{revocationResult}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  title: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: '#cbd5f5',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionLabel: {
    color: '#f8fafc',
    marginTop: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#e2e8f0',
  },
  inputMono: {
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  },
  button: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#cbd5f5',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#38bdf8',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#1e293b',
    fontWeight: '700',
  },
  successText: {
    color: '#4ade80',
    fontSize: 13,
  },
  errorText: {
    color: '#f87171',
    fontSize: 13,
  },
  infoText: {
    color: '#cbd5f5',
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: '#1e293b',
    marginVertical: 8,
  },
});

export default AOTDemoCard;
