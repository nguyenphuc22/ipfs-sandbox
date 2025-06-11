import { FilePickerService } from '../src/services/FilePickerService';

// Mock React Native modules for testing
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
}));

jest.mock('react-native-document-picker', () => ({
  pick: jest.fn(),
  isCancel: jest.fn(),
  types: {
    allFiles: 'allFiles',
    images: 'images',
    video: 'video',
    audio: 'audio',
    pdf: 'pdf',
    doc: 'doc',
    docx: 'docx',
    xls: 'xls',
    xlsx: 'xlsx',
    ppt: 'ppt',
    pptx: 'pptx',
    csv: 'csv',
    zip: 'zip',
    plainText: 'plainText',
  },
}));

jest.mock('../src/utils', () => ({
  generateRandomId: () => 'test-id-123',
}));

describe('FilePickerService', () => {
  let filePickerService: FilePickerService;

  beforeEach(() => {
    filePickerService = FilePickerService.getInstance();
  });

  describe('File Type Detection', () => {
    test('should detect PDF files correctly', () => {
      const fileType = filePickerService.getFileTypeFromMimeType('application/pdf');
      expect(fileType).toBe('pdf');
    });

    test('should detect image files correctly', () => {
      const fileType = filePickerService.getFileTypeFromMimeType('image/jpeg');
      expect(fileType).toBe('images');
    });

    test('should detect document files correctly', () => {
      const fileType = filePickerService.getFileTypeFromMimeType(
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
      expect(fileType).toBe('docx');
    });
  });

  describe('File Extension Detection', () => {
    test('should extract file extension correctly', () => {
      const extension = filePickerService.getFileExtension('document.pdf');
      expect(extension).toBe('pdf');
    });

    test('should handle files without extension', () => {
      const extension = filePickerService.getFileExtension('document');
      expect(extension).toBe('');
    });

    test('should handle multiple dots in filename', () => {
      const extension = filePickerService.getFileExtension('my.document.v1.pdf');
      expect(extension).toBe('pdf');
    });
  });

  describe('File Type Validation', () => {
    const mockPDFFile = {
      id: 'test-id',
      uri: 'file://test.pdf',
      name: 'test.pdf',
      type: 'application/pdf',
      size: 1024,
      error: null,
      nativeType: null,
      isVirtual: null,
      convertibleToMimeTypes: null,
      hasRequestedType: false,
      uploadTime: new Date(),
      status: 'uploading' as const,
      progress: 0,
    };

    const mockImageFile = {
      ...mockPDFFile,
      name: 'test.jpg',
      type: 'image/jpeg',
    };

    test('should identify document files correctly', () => {
      const isDocument = filePickerService.isDocumentFile(mockPDFFile);
      expect(isDocument).toBe(true);
    });

    test('should identify media files correctly', () => {
      const isMedia = filePickerService.isMediaFile(mockImageFile);
      expect(isMedia).toBe(true);
    });

    test('should distinguish between document and media files', () => {
      const pdfIsDocument = filePickerService.isDocumentFile(mockPDFFile);
      const pdfIsMedia = filePickerService.isMediaFile(mockPDFFile);
      
      expect(pdfIsDocument).toBe(true);
      expect(pdfIsMedia).toBe(false);
    });
  });

  describe('Service Singleton', () => {
    test('should return the same instance', () => {
      const instance1 = FilePickerService.getInstance();
      const instance2 = FilePickerService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });
});
