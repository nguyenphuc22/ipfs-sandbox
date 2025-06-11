import {launchImageLibrary, ImagePickerResponse, MediaType} from 'react-native-image-picker';
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

  async pickFiles(options: FilePickerOptions = {}): Promise<PickedFile[]> {
    // For now, only support image/video picking until document picker is fixed
    return this.pickWithImagePicker(options);
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

  // Simplified methods for testing
  async pickMixedFiles(options: FilePickerOptions = {}): Promise<PickedFile[]> {
    return this.pickFiles(options);
  }

  async pickDocuments(options: Omit<FilePickerOptions, 'type'> = {}): Promise<PickedFile[]> {
    console.warn('Document picker not available - falling back to image picker');
    return this.pickFiles({ ...options, type: ['images'] });
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
    return false; // For now, no document support
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