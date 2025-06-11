import {launchImageLibrary, ImagePickerResponse, MediaType} from 'react-native-image-picker';
import {Platform} from 'react-native';
import {
  FilePickerOptions,
  FileType,
  FilePickerError,
  PickedFile,
} from '../types/filePicker';
import {generateRandomId} from '../utils';

export class FilePickerService {
  private static instance: FilePickerService;

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

  private createPickedFile(asset: any): PickedFile {
    return {
      id: generateRandomId(),
      uri: asset.uri,
      name: asset.fileName || asset.originalFileName || 'file',
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
      };
    }

    if (error?.didCancel) {
      return {
        code: 'USER_CANCELED',
        message: 'User canceled file selection',
      };
    }

    return {
      code: 'IMAGE_PICKER_ERROR',
      message: error?.errorMessage || error?.message || 'Unknown error occurred while picking files',
      userInfo: error,
    };
  }

  async pickFiles(options: FilePickerOptions = {}): Promise<PickedFile[]> {
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
          quality: 0.8,
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
              errorMessage: response.errorMessage
            }));
            return;
          }

          if (response.assets && response.assets.length > 0) {
            const pickedFiles = response.assets.map(asset => this.createPickedFile(asset));
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

  async pickSingleFile(
    options: Omit<FilePickerOptions, 'allowMultiSelection'> = {},
  ): Promise<PickedFile | null> {
    try {
      const files = await this.pickFiles({
        ...options,
        allowMultiSelection: false,
      });
      return files.length > 0 ? files[0] : null;
    } catch (error) {
      if (this.handleDocumentPickerError(error).code === 'DOCUMENT_PICKER_CANCELED') {
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

  getFileTypeFromMimeType(mimeType: string): FileType {
    if (mimeType.startsWith('image/')) {return 'images';}
    if (mimeType.startsWith('video/')) {return 'video';}
    if (mimeType.startsWith('audio/')) {return 'audio';}
    if (mimeType === 'application/pdf') {return 'pdf';}
    if (mimeType === 'text/csv') {return 'csv';}
    if (mimeType === 'application/msword') {return 'doc';}
    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {return 'docx';}
    if (mimeType === 'application/vnd.ms-powerpoint') {return 'ppt';}
    if (mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {return 'pptx';}
    if (mimeType === 'application/vnd.ms-excel') {return 'xls';}
    if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {return 'xlsx';}
    if (mimeType.includes('zip') || mimeType.includes('compressed')) {return 'zip';}
    if (mimeType.startsWith('text/')) {return 'plainText';}

    return 'allFiles';
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
