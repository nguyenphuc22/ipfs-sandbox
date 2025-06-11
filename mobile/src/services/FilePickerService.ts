import DocumentPicker, {
  DocumentPickerResponse,
  DirectoryPickerResponse,
  types,
} from '@react-native-documents/picker';
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

  private getDocumentPickerTypes(fileTypes?: FileType[]): any[] {
    if (!fileTypes || fileTypes.length === 0) {
      return [types.allFiles];
    }

    const typeMap: Record<FileType, any> = {
      allFiles: types.allFiles,
      images: types.images,
      plainText: types.plainText,
      audio: types.audio,
      video: types.video,
      pdf: types.pdf,
      zip: types.zip,
      csv: types.csv,
      doc: types.doc,
      docx: types.docx,
      ppt: types.ppt,
      pptx: types.pptx,
      xls: types.xls,
      xlsx: types.xlsx,
    };

    return fileTypes.map(type => typeMap[type]).filter(Boolean);
  }

  private createPickedFile(
    response: DocumentPickerResponse | DirectoryPickerResponse,
  ): PickedFile {
    const docResponse = response as DocumentPickerResponse;
    return {
      id: generateRandomId(),
      uri: response.uri,
      name: docResponse.name || null,
      error: null,
      type: docResponse.type || null,
      nativeType: (docResponse as any).nativeType || null,
      size: docResponse.size || null,
      isVirtual: (docResponse as any).isVirtual || null,
      convertibleToMimeTypes: (docResponse as any).convertibleToMimeTypes || null,
      hasRequestedType: (docResponse as any).hasRequestedType || false,
      uploadTime: new Date(),
      status: 'uploading',
      progress: 0,
    };
  }

  private handleDocumentPickerError(error: any): FilePickerError {
    // Check for user cancellation
    if (error?.code === 'DOCUMENT_PICKER_CANCELED' ||
        error?.message?.includes('canceled') ||
        error?.message?.includes('cancelled')) {
      return {
        code: 'DOCUMENT_PICKER_CANCELED',
        message: 'User canceled file selection',
      };
    }

    // Check for in progress error
    if (error?.code === 'DOCUMENT_PICKER_IN_PROGRESS' ||
        error?.message?.includes('in progress')) {
      return {
        code: 'DOCUMENT_PICKER_IN_PROGRESS',
        message: 'Document picker is already in progress',
      };
    }

    return {
      code: 'DOCUMENT_PICKER_ERROR',
      message: error?.message || 'Unknown error occurred while picking files',
      userInfo: error,
    };
  }

  async pickFiles(options: FilePickerOptions = {}): Promise<PickedFile[]> {
    try {
      // Check if DocumentPicker is available
      if (!DocumentPicker || typeof DocumentPicker.pick !== 'function') {
        throw new Error('DocumentPicker is not available or not properly installed');
      }

      const {
        allowMultiSelection = false,
        type = ['allFiles'],
        copyTo,
        presentationStyle = 'fullScreen',
        transitionStyle = 'coverVertical',
      } = options;

      console.log('Starting file picker with options:', options);
      console.log('Platform:', Platform.OS);
      console.log('DocumentPicker available:', !!DocumentPicker);

      let results;

      if (Platform.OS === 'android') {
        // Android-specific implementation with multiple fallbacks
        console.log('Android detected - using Android-specific approach');
        
        try {
          // First attempt: Most basic Android configuration
          console.log('Attempting basic Android DocumentPicker...');
          results = await DocumentPicker.pick({
            type: [types.allFiles],
            allowMultiSelection: false, // Start with single selection for compatibility
          });
          console.log('Basic Android picker succeeded');
        } catch (basicError) {
          console.log('Basic Android picker failed, trying with specified types...');
          console.error('Basic error:', basicError);
          
          try {
            // Second attempt: With specified file types
            results = await DocumentPicker.pick({
              type: this.getDocumentPickerTypes(type),
              allowMultiSelection,
            });
            console.log('Typed Android picker succeeded');
          } catch (typedError) {
            console.log('Typed Android picker failed, trying absolute minimal...');
            console.error('Typed error:', typedError);
            
            // Third attempt: Absolute minimal configuration
            results = await DocumentPicker.pick({});
            console.log('Minimal Android picker succeeded');
          }
        }
      } else {
        // iOS implementation
        console.log('iOS detected - using iOS configuration');
        const pickerOptions: any = {
          allowMultiSelection,
          type: this.getDocumentPickerTypes(type),
        };

        // Add optional parameters only if they exist
        if (copyTo) {
          pickerOptions.copyTo = copyTo;
        }
        if (presentationStyle) {
          pickerOptions.presentationStyle = presentationStyle;
        }
        if (transitionStyle) {
          pickerOptions.transitionStyle = transitionStyle;
        }

        console.log('iOS DocumentPicker options:', pickerOptions);
        results = await DocumentPicker.pick(pickerOptions);
      }

      console.log('DocumentPicker results:', results);

      // DocumentPicker.pick returns an array when allowMultiSelection is true
      // and a single object when false, but we always want an array
      const resultsArray = Array.isArray(results) ? results : [results];
      
      console.log('Processed results array:', resultsArray);

      return resultsArray.map(result => this.createPickedFile(result));
    } catch (error) {
      console.error('DocumentPicker error:', error);
      console.error('Error details:', {
        message: (error as any)?.message,
        code: (error as any)?.code,
        stack: (error as any)?.stack,
        name: (error as any)?.name,
        toString: (error as any)?.toString?.(),
      });
      throw this.handleDocumentPickerError(error);
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
