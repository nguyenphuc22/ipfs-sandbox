import {FileData, PickedFile} from '../types';
import {generateRandomId, generateMockIPFSHash, getFileIcon} from '../utils';
import {MOCK_FILE_NAMES, FILE_SIZE_LIMITS} from '../constants';

export class FileService {
  private static instance: FileService;
  private files: FileData[] = [];
  private listeners: Array<(files: FileData[]) => void> = [];

  static getInstance(): FileService {
    if (!FileService.instance) {
      FileService.instance = new FileService();
    }
    return FileService.instance;
  }

  subscribe(listener: (files: FileData[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.files]));
  }

  getAllFiles(): FileData[] {
    return [...this.files];
  }

  getFileById(id: string): FileData | undefined {
    return this.files.find(file => file.id === id);
  }

  getFilesByStatus(status: FileData['status']): FileData[] {
    return this.files.filter(file => file.status === status);
  }

  getTotalFileSize(): number {
    return this.files.reduce((total, file) => total + file.size, 0);
  }

  createMockFile(): FileData {
    const randomName =
      MOCK_FILE_NAMES[Math.floor(Math.random() * MOCK_FILE_NAMES.length)];
    const randomSize =
      Math.floor(Math.random() * (FILE_SIZE_LIMITS.MAX - FILE_SIZE_LIMITS.MIN)) +
      FILE_SIZE_LIMITS.MIN;

    return {
      id: generateRandomId(),
      name: randomName,
      size: randomSize,
      uploadTime: new Date(),
      status: 'uploading',
      ipfsHash: undefined,
    };
  }

  async uploadFile(): Promise<FileData> {
    const newFile = this.createMockFile();
    this.files = [newFile, ...this.files];
    this.notifyListeners();

    // Simulate upload process
    this.simulateUpload(newFile.id);

    return newFile;
  }

  private simulateUpload(fileId: string): void {
    const uploadDuration = 2000 + Math.random() * 3000; // 2-5 seconds

    setTimeout(() => {
      this.updateFileStatus(fileId, 'completed', generateMockIPFSHash());
    }, uploadDuration);
  }

  updateFileStatus(
    fileId: string,
    status: FileData['status'],
    ipfsHash?: string,
  ): void {
    this.files = this.files.map(file =>
      file.id === fileId
        ? {
            ...file,
            status,
            ...(ipfsHash && {ipfsHash}),
          }
        : file,
    );
    this.notifyListeners();
  }

  deleteFile(fileId: string): boolean {
    const initialLength = this.files.length;
    this.files = this.files.filter(file => file.id !== fileId);

    if (this.files.length !== initialLength) {
      this.notifyListeners();
      return true;
    }
    return false;
  }

  clearAllFiles(): void {
    this.files = [];
    this.notifyListeners();
  }

  createFileFromPickedFile(pickedFile: PickedFile): FileData {
    return {
      id: pickedFile.id,
      name: pickedFile.name || 'Unknown file',
      size: pickedFile.size || 0,
      uploadTime: pickedFile.uploadTime,
      status: pickedFile.status,
      ipfsHash: pickedFile.ipfsHash,
    };
  }

  async addPickedFile(pickedFile: PickedFile): Promise<FileData> {
    const fileData = this.createFileFromPickedFile(pickedFile);
    this.files = [fileData, ...this.files];
    this.notifyListeners();

    // Start upload simulation for real file
    if (pickedFile.status === 'uploading') {
      this.simulateUpload(fileData.id);
    }

    return fileData;
  }

  async addPickedFiles(pickedFiles: PickedFile[]): Promise<FileData[]> {
    const fileDataArray = pickedFiles.map(pf => this.createFileFromPickedFile(pf));
    this.files = [...fileDataArray, ...this.files];
    this.notifyListeners();

    // Start upload simulation for all files
    fileDataArray.forEach(file => {
      if (file.status === 'uploading') {
        this.simulateUpload(file.id);
      }
    });

    return fileDataArray;
  }

  getFileMetadata(file: FileData): {
    icon: string;
    type: string;
    isImage: boolean;
    isVideo: boolean;
    isAudio: boolean;
    isDocument: boolean;
  } {
    const icon = getFileIcon(file.name);
    const extension = file.name.split('.').pop()?.toLowerCase() || '';

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
    const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv'];
    const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'm4a'];
    const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'xls', 'xlsx', 'ppt', 'pptx'];

    return {
      icon,
      type: extension,
      isImage: imageExtensions.includes(extension),
      isVideo: videoExtensions.includes(extension),
      isAudio: audioExtensions.includes(extension),
      isDocument: documentExtensions.includes(extension),
    };
  }

  async readFileAsBase64(fileUri: string): Promise<string> {
    // TODO: Implement file reading using react-native-fs or similar
    // For now, return empty string as placeholder
    console.log('File URI to read:', fileUri);
    return '';
  }

  async getFileBlob(fileUri: string): Promise<Blob | null> {
    try {
      // TODO: Implement file blob creation for real IPFS upload
      // This would typically involve reading the file and creating a blob
      console.log('Creating blob for file:', fileUri);
      return null;
    } catch (error) {
      console.error('Error creating file blob:', error);
      return null;
    }
  }

  // Future methods for real IPFS integration
  async uploadToIPFS(fileUri: string): Promise<string> {
    try {
      // TODO: Implement real IPFS upload
      // 1. Read file from URI
      // 2. Upload to IPFS node
      // 3. Return IPFS hash
      console.log('Uploading file to IPFS:', fileUri);

      // For now, simulate upload and return mock hash
      await new Promise(resolve => setTimeout(resolve, 1000));
      return generateMockIPFSHash();
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  }

  async downloadFromIPFS(hash: string): Promise<string> {
    try {
      // TODO: Implement real IPFS download
      // 1. Fetch file from IPFS using hash
      // 2. Save to local storage
      // 3. Return local file URI
      console.log('Downloading file from IPFS:', hash);

      // For now, return empty string as placeholder
      return '';
    } catch (error) {
      console.error('IPFS download error:', error);
      throw new Error('Failed to download file from IPFS');
    }
  }

  async validateFileAccess(fileUri: string): Promise<boolean> {
    try {
      // TODO: Implement file access validation
      // Check if file still exists and is accessible
      console.log('Validating file access:', fileUri);
      return true;
    } catch (error) {
      console.error('File access validation error:', error);
      return false;
    }
  }
}
