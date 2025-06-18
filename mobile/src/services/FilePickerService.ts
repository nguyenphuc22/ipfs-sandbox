import {launchImageLibrary, ImagePickerResponse, MediaType} from 'react-native-image-picker';
import { pick, types, errorCodes, isErrorWithCode } from '@react-native-documents/picker';
import {
  FilePickerOptions,
  FileType,
  FilePickerError,
  PickedFile,
} from '../types/filePicker';
import {generateRandomId} from '../utils';

export class FilePickerService {
  private static instance: FilePickerService;

  constructor() {
    // Public constructor for direct instantiation
  }

  static getInstance(): FilePickerService {
    if (!FilePickerService.instance) {
      FilePickerService.instance = new FilePickerService();
    }
    return FilePickerService.instance;
  }

  private getMediaType(fileTypes?: FileType[]): MediaType {
    if (!fileTypes || fileTypes.length === 0) {
      return 'mixed';
    }

    const hasImages = fileTypes.includes('images');
    const hasVideo = fileTypes.includes('video');

    if (hasImages && hasVideo) {
      return 'mixed';
    } else if (hasImages) {
      return 'photo';
    } else if (hasVideo) {
      return 'video';
    }

    return 'mixed';
  }

  private getDocumentPickerTypes(fileTypes?: FileType[]): string[] {
    if (!fileTypes || fileTypes.length === 0) {
      return [types.allFiles];
    }

    const pickerTypes: string[] = [];
    
    fileTypes.forEach(type => {
      switch (type) {
        case 'pdf':
          pickerTypes.push(types.pdf);
          break;
        case 'doc':
        case 'docx':
          pickerTypes.push(types.doc);
          break;
        case 'xls':
        case 'xlsx':
          pickerTypes.push(types.xls);
          break;
        case 'ppt':
        case 'pptx':
          pickerTypes.push(types.ppt);
          break;
        case 'images':
          pickerTypes.push(types.images);
          break;
        case 'video':
          pickerTypes.push(types.video);
          break;
        case 'audio':
          pickerTypes.push(types.audio);
          break;
        case 'plainText':
        case 'txt':
          pickerTypes.push(types.plainText);
          break;
        case 'zip':
          pickerTypes.push(types.zip);
          break;
        case 'csv':
          pickerTypes.push(types.csv);
          break;
        case 'allFiles':
        default:
          pickerTypes.push(types.allFiles);
          break;
      }
    });

    return pickerTypes.length > 0 ? pickerTypes : [types.allFiles];
  }

  private shouldUseDocumentPicker(fileTypes?: FileType[]): boolean {
    // Always use document picker to avoid permission issues
    return true;
  }

  private createPickedFileFromImageAsset(asset: any): PickedFile {
    return {
      id: generateRandomId(),
      uri: asset.uri,
      name: asset.fileName || asset.originalFileName || 'image.jpg',
      error: null,
      type: asset.type || null,
      nativeType: null,
      size: asset.fileSize || null,
      isVirtual: null,
      convertibleToMimeTypes: null,
      hasRequestedType: false,
      uploadTime: new Date(),
      status: 'uploading',
      progress: 0,
    };
  }

  private createPickedFileFromDocumentAsset(asset: any): PickedFile {
    return {
      id: generateRandomId(),
      uri: asset.uri,
      name: asset.name || 'document',
      error: null,
      type: asset.type || null,
      nativeType: null,
      size: asset.size || null,
      isVirtual: null,
      convertibleToMimeTypes: null,
      hasRequestedType: false,
      uploadTime: new Date(),
      status: 'uploading',
      progress: 0,
    };
  }

  private handleImagePickerError(error: any): FilePickerError {
    // Check for user cancellation
    if (error?.code === 'camera_unavailable' || error?.code === 'permission') {
      return {
        code: 'PERMISSION_ERROR',
        message: 'Camera or photo library permission required',
        userInfo: error,
      };
    }

    if (error?.didCancel) {
      return {
        code: 'USER_CANCELED',
        message: 'User canceled file selection',
        userInfo: error,
      };
    }

    return {
      code: 'IMAGE_PICKER_ERROR',
      message: error?.errorMessage || error?.message || 'Unknown error occurred while picking files',
      userInfo: error,
    };
  }

  private handleDocumentPickerError(error: any): FilePickerError {
    // Check for user cancellation
    if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) {
      return {
        code: 'USER_CANCELED',
        message: 'User canceled file selection',
        userInfo: error,
      };
    }

    if (error?.code === 'PERMISSION_ERROR') {
      return {
        code: 'PERMISSION_ERROR',
        message: 'File access permission required',
        userInfo: error,
      };
    }

    return {
      code: 'DOCUMENT_PICKER_ERROR',
      message: error?.message || 'Unknown error occurred while picking documents',
      userInfo: error,
    };
  }

  private async pickWithImagePicker(options: FilePickerOptions): Promise<PickedFile[]> {
    return new Promise((resolve, reject) => {
      try {
        console.log('Starting image picker with options:', options);

        const {
          allowMultiSelection = false,
          type = ['images'],
        } = options;

        const pickerOptions = {
          mediaType: this.getMediaType(type),
          includeBase64: false,
          maxHeight: 2000,
          maxWidth: 2000,
          quality: 0.8 as const,
          selectionLimit: allowMultiSelection ? 10 : 1,
        };

        console.log('Image picker options:', pickerOptions);

        launchImageLibrary(pickerOptions, (response: ImagePickerResponse) => {
          console.log('Image picker response:', response);

          if (response.didCancel) {
            resolve([]);
            return;
          }

          if (response.errorMessage) {
            reject(this.handleImagePickerError({
              errorMessage: response.errorMessage,
            }));
            return;
          }

          if (response.assets && response.assets.length > 0) {
            const pickedFiles = response.assets.map(asset => this.createPickedFileFromImageAsset(asset));
            console.log('Picked files:', pickedFiles);
            resolve(pickedFiles);
          } else {
            resolve([]);
          }
        });
      } catch (error) {
        console.error('Image picker error:', error);
        reject(this.handleImagePickerError(error));
      }
    });
  }

  private async pickWithDocumentPicker(options: FilePickerOptions): Promise<PickedFile[]> {
    try {
      console.log('Starting document picker with options:', options);

      const {
        allowMultiSelection = false,
        type = ['allFiles'],
      } = options;

      const documentTypes = this.getDocumentPickerTypes(type);
      console.log('Document picker types:', documentTypes);

      const pickerOptions = {
        mode: 'import' as const,
        type: documentTypes,
        allowMultiSelection,
      };

      console.log('Document picker options:', pickerOptions);

      const results = await pick(pickerOptions);
      console.log('Document picker results:', results);

      if (!results || results.length === 0) {
        return [];
      }

      const pickedFiles = results.map(result => this.createPickedFileFromDocumentAsset(result));
      console.log('Picked files:', pickedFiles);
      return pickedFiles;
    } catch (error) {
      console.error('Document picker error:', error);
      if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) {
        return [];
      }
      throw this.handleDocumentPickerError(error);
    }
  }

  async pickFiles(options: FilePickerOptions = {}): Promise<PickedFile[]> {
    console.log('pickFiles called with options:', options);
    
    // Determine which picker to use based on file types
    if (this.shouldUseDocumentPicker(options.type)) {
      console.log('Using document picker');
      return this.pickWithDocumentPicker(options);
    } else {
      console.log('Using image picker');
      return this.pickWithImagePicker(options);
    }
  }

  async pickSingleFile(
    options: Omit<FilePickerOptions, 'allowMultiSelection'> = {},
  ): Promise<PickedFile | null> {
    try {
      const files = await this.pickFiles({
        ...options,
        allowMultiSelection: false,
      });
      return files.length > 0 ? files[0] : null;
    } catch (error: any) {
      // Handle cancellation gracefully
      if (error?.code === 'USER_CANCELED') {
        return null;
      }
      throw error;
    }
  }

  async pickMultipleFiles(
    options: Omit<FilePickerOptions, 'allowMultiSelection'> = {},
  ): Promise<PickedFile[]> {
    return this.pickFiles({
      ...options,
      allowMultiSelection: true,
    });
  }

  // Specialized methods
  async pickMixedFiles(options: FilePickerOptions = {}): Promise<PickedFile[]> {
    console.log('pickMixedFiles called - using document picker for maximum compatibility');
    return this.pickWithDocumentPicker({ ...options, type: ['allFiles'] });
  }

  async pickDocuments(options: Omit<FilePickerOptions, 'type'> = {}): Promise<PickedFile[]> {
    console.log('pickDocuments called');
    return this.pickWithDocumentPicker({ ...options, type: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'] });
  }

  async pickMedia(options: Omit<FilePickerOptions, 'type'> = {}): Promise<PickedFile[]> {
    return this.pickFiles({ ...options, type: ['images', 'video'] });
  }

  getFileTypeFromMimeType(mimeType: string): FileType {
    // Image types
    if (mimeType.startsWith('image/')) return 'images';

    // Video types
    if (mimeType.startsWith('video/')) return 'video';

    // Audio types
    if (mimeType.startsWith('audio/')) return 'audio';

    // Document types
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType === 'application/msword' || 
        mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return 'docx';
    }
    if (mimeType === 'application/vnd.ms-excel' ||
        mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return 'xlsx';
    }
    if (mimeType === 'application/vnd.ms-powerpoint' ||
        mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
      return 'pptx';
    }
    if (mimeType === 'text/plain') return 'txt';
    if (mimeType === 'text/csv') return 'csv';
    if (mimeType === 'application/zip') return 'zip';

    return 'allFiles';
  }

  /**
   * Get file extension from filename
   */
  getFileExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf('.');
    return lastDot !== -1 ? fileName.substring(lastDot + 1).toLowerCase() : '';
  }

  /**
   * Check if file is a document type
   */
  isDocumentFile(file: PickedFile): boolean {
    if (file.type) {
      const fileType = this.getFileTypeFromMimeType(file.type);
      return ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'zip'].includes(fileType);
    }

    if (file.name) {
      const extension = this.getFileExtension(file.name);
      const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'zip', 'rtf'];
      return documentExtensions.includes(extension);
    }

    return false;
  }

  /**
   * Check if file is a media type (image/video/audio)
   */
  isMediaFile(file: PickedFile): boolean {
    if (file.type) {
      const fileType = this.getFileTypeFromMimeType(file.type);
      return ['images', 'video', 'audio'].includes(fileType);
    }

    if (file.name) {
      const extension = this.getFileExtension(file.name);
      const mediaExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'bmp', 'webp', 'mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'mp3', 'wav', 'flac', 'aac', 'm4a'];
      return mediaExtensions.includes(extension);
    }

    return false;
  }

  getDisplayName(file: PickedFile): string {
    return file.name || 'Unknown file';
  }

  getFileSize(file: PickedFile): number {
    return file.size || 0;
  }

  isValidFile(file: PickedFile): boolean {
    return !!(file.uri && file.name);
  }
}