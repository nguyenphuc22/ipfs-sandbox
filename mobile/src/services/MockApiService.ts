import { FileData, PickedFile } from '../types';
import { generateMockIPFSHash, generateRandomId } from '../utils';
import { 
  GatewayApiService, 
  UploadResponse, 
  HealthResponse, 
  IPFSTestResponse 
} from './GatewayApiService';

export class MockApiService extends GatewayApiService {
  private mockFiles: FileData[] = [];
  private mockDelay: number;

  constructor(delay: number = 1000) {
    // Call parent constructor with dummy config
    super({ baseUrl: 'http://mock-api' });
    this.mockDelay = delay;
  }

  private async simulateDelay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, this.mockDelay));
  }

  private generateMockFileData(pickedFile: PickedFile): FileData {
    return {
      id: pickedFile.id,
      name: pickedFile.name || 'Mock File',
      size: pickedFile.size || Math.floor(Math.random() * 1000000),
      uploadTime: new Date(),
      status: 'completed',
      ipfsHash: generateMockIPFSHash(),
    };
  }

  async checkHealth(): Promise<HealthResponse> {
    await this.simulateDelay();
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Mock IPFS Gateway with ID-RS',
    };
  }

  async testIPFSConnection(): Promise<IPFSTestResponse> {
    await this.simulateDelay();
    return {
      success: true,
      ipfsApiUrl: 'http://mock-api:5001',
      ipfsVersion: {
        Version: '0.24.0-mock',
        Commit: 'mock-commit',
        Repo: '15',
        System: 'mock/system',
        Golang: 'go1.21.3',
      },
    };
  }

  async uploadFile(file: PickedFile): Promise<UploadResponse> {
    await this.simulateDelay();
    
    // Simulate upload process
    const mockHash = generateMockIPFSHash();
    const mockFile = this.generateMockFileData(file);
    
    // Add to mock storage
    this.mockFiles.push(mockFile);
    
    return {
      success: true,
      hash: mockHash,
      name: file.name || 'Unknown File',
      size: file.size || 0,
      ipfsUrl: `http://mock-api:8080/ipfs/${mockHash}`,
      apiUrl: `http://mock-api:5001/api/v0/cat?arg=${mockHash}`,
    };
  }

  async downloadFile(hash: string): Promise<Blob> {
    await this.simulateDelay();
    
    // Create mock blob with sample text
    const mockContent = `Mock file content for hash: ${hash}\nGenerated at: ${new Date().toISOString()}`;
    return new Blob([mockContent]);
  }

  async getFileMetadata(hash: string): Promise<any> {
    await this.simulateDelay();
    
    const mockFile = this.mockFiles.find(f => f.ipfsHash === hash);
    
    return {
      hash,
      name: mockFile?.name || 'Mock File',
      size: mockFile?.size || Math.floor(Math.random() * 1000000),
      type: 'application/octet-stream',
      uploadTime: mockFile?.uploadTime || new Date(),
      status: 'completed',
    };
  }

  async listFiles(): Promise<FileData[]> {
    await this.simulateDelay();
    return [...this.mockFiles];
  }

  async deleteFile(hash: string): Promise<{ success: boolean }> {
    await this.simulateDelay();
    
    const initialLength = this.mockFiles.length;
    this.mockFiles = this.mockFiles.filter(f => f.ipfsHash !== hash);
    
    return {
      success: this.mockFiles.length !== initialLength,
    };
  }

  async getUserFiles(): Promise<FileData[]> {
    await this.simulateDelay();
    return [...this.mockFiles];
  }

  async getSignatures(): Promise<any[]> {
    await this.simulateDelay();
    
    return [
      {
        id: generateRandomId(),
        message: 'Mock signature 1',
        signature: 'mock_signature_1',
        publicKey: 'mock_public_key_1',
        timestamp: new Date().toISOString(),
        verified: true,
      },
      {
        id: generateRandomId(),
        message: 'Mock signature 2',
        signature: 'mock_signature_2',
        publicKey: 'mock_public_key_2',
        timestamp: new Date().toISOString(),
        verified: false,
      },
    ];
  }

  async createSignature(data: any): Promise<any> {
    await this.simulateDelay();
    
    return {
      id: generateRandomId(),
      message: data.message || 'Mock message',
      signature: `mock_signature_${Date.now()}`,
      publicKey: 'mock_public_key',
      timestamp: new Date().toISOString(),
      verified: true,
    };
  }

  async verifySignature(signatureId: string): Promise<any> {
    await this.simulateDelay();
    
    return {
      id: signatureId,
      verified: Math.random() > 0.3, // 70% chance of verification success
      timestamp: new Date().toISOString(),
      message: 'Mock verification result',
    };
  }

  // Additional mock methods
  clearMockFiles(): void {
    this.mockFiles = [];
  }

  addMockFile(file: FileData): void {
    this.mockFiles.push(file);
  }

  getMockFiles(): FileData[] {
    return [...this.mockFiles];
  }

  setMockDelay(delay: number): void {
    this.mockDelay = delay;
  }

  // Simulate network errors for testing
  async simulateNetworkError(): Promise<never> {
    await this.simulateDelay();
    throw new Error('Mock network error - simulated connection failure');
  }

  async simulateTimeout(): Promise<never> {
    await new Promise(resolve => setTimeout(resolve, 35000)); // Longer than typical timeout
    throw new Error('Mock timeout error');
  }

  // Simulate server errors
  async simulateServerError(): Promise<never> {
    await this.simulateDelay();
    throw new Error('Mock server error - simulated 500 internal server error');
  }

  async simulateUnauthorized(): Promise<never> {
    await this.simulateDelay();
    throw new Error('Mock unauthorized error - simulated 401 unauthorized');
  }
}

export const createMockGatewayService = (delay: number = 1000) => {
  return new MockApiService(delay);
};