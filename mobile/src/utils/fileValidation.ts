import {PickedFile, FileValidationResult, FileValidationRules} from '../types/filePicker';
import {getFileExtension} from './fileUtils';

export class FileValidationService {
  private static readonly DEFAULT_MAX_SIZE = 50 * 1024 * 1024; // 50MB
  private static readonly DEFAULT_MIN_SIZE = 1; // 1 byte

  static validateFile(
    file: PickedFile,
    rules: FileValidationRules = {},
  ): FileValidationResult {
    const errors: string[] = [];

    // Size validation
    const maxSize = rules.maxSize ?? this.DEFAULT_MAX_SIZE;
    const minSize = rules.minSize ?? this.DEFAULT_MIN_SIZE;
    const fileSize = file.size || 0;

    if (fileSize > maxSize) {
      errors.push(`File size (${this.formatFileSize(fileSize)}) exceeds maximum allowed size (${this.formatFileSize(maxSize)})`);
    }

    if (fileSize < minSize) {
      errors.push(`File size (${this.formatFileSize(fileSize)}) is below minimum required size (${this.formatFileSize(minSize)})`);
    }

    // Extension validation
    const fileExtension = getFileExtension(file.name || '').toLowerCase();

    if (rules.allowedExtensions && rules.allowedExtensions.length > 0) {
      const allowedExtensions = rules.allowedExtensions.map(ext => ext.toLowerCase());
      if (!allowedExtensions.includes(fileExtension)) {
        errors.push(`File extension "${fileExtension}" is not allowed. Allowed extensions: ${rules.allowedExtensions.join(', ')}`);
      }
    }

    if (rules.blockedExtensions && rules.blockedExtensions.length > 0) {
      const blockedExtensions = rules.blockedExtensions.map(ext => ext.toLowerCase());
      if (blockedExtensions.includes(fileExtension)) {
        errors.push(`File extension "${fileExtension}" is not allowed`);
      }
    }

    // MIME type validation
    const fileMimeType = file.type || '';

    if (rules.allowedMimeTypes && rules.allowedMimeTypes.length > 0) {
      if (!rules.allowedMimeTypes.includes(fileMimeType)) {
        errors.push(`File type "${fileMimeType}" is not allowed. Allowed types: ${rules.allowedMimeTypes.join(', ')}`);
      }
    }

    if (rules.blockedMimeTypes && rules.blockedMimeTypes.length > 0) {
      if (rules.blockedMimeTypes.includes(fileMimeType)) {
        errors.push(`File type "${fileMimeType}" is not allowed`);
      }
    }

    // Basic file integrity validation
    if (!file.uri) {
      errors.push('File URI is missing');
    }

    if (!file.name) {
      errors.push('File name is missing');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateFiles(
    files: PickedFile[],
    rules: FileValidationRules = {},
  ): FileValidationResult {
    const allErrors: string[] = [];

    files.forEach((file, index) => {
      const validation = this.validateFile(file, rules);
      if (!validation.isValid) {
        validation.errors.forEach(error => {
          allErrors.push(`File ${index + 1} (${file.name}): ${error}`);
        });
      }
    });

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
    };
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) {return '0 Bytes';}
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static createValidationRules(options: {
    maxSizeMB?: number;
    minSizeMB?: number;
    allowedExtensions?: string[];
    blockedExtensions?: string[];
    allowedMimeTypes?: string[];
    blockedMimeTypes?: string[];
  }): FileValidationRules {
    return {
      maxSize: options.maxSizeMB ? options.maxSizeMB * 1024 * 1024 : undefined,
      minSize: options.minSizeMB ? options.minSizeMB * 1024 * 1024 : undefined,
      allowedExtensions: options.allowedExtensions,
      blockedExtensions: options.blockedExtensions,
      allowedMimeTypes: options.allowedMimeTypes,
      blockedMimeTypes: options.blockedMimeTypes,
    };
  }

  // Predefined validation rules for common use cases
  static readonly VALIDATION_PRESETS = {
    IMAGES: this.createValidationRules({
      maxSizeMB: 10,
      allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    }),

    DOCUMENTS: this.createValidationRules({
      maxSizeMB: 25,
      allowedExtensions: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
      allowedMimeTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/rtf',
      ],
    }),

    SPREADSHEETS: this.createValidationRules({
      maxSizeMB: 15,
      allowedExtensions: ['xls', 'xlsx', 'csv'],
      allowedMimeTypes: [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
      ],
    }),

    PRESENTATIONS: this.createValidationRules({
      maxSizeMB: 20,
      allowedExtensions: ['ppt', 'pptx'],
      allowedMimeTypes: [
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ],
    }),

    VIDEOS: this.createValidationRules({
      maxSizeMB: 100,
      allowedExtensions: ['mp4', 'avi', 'mov', 'mkv', 'wmv'],
      allowedMimeTypes: ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo'],
    }),

    AUDIO: this.createValidationRules({
      maxSizeMB: 50,
      allowedExtensions: ['mp3', 'wav', 'flac', 'aac', 'm4a'],
      allowedMimeTypes: ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/mp4'],
    }),

    ARCHIVES: this.createValidationRules({
      maxSizeMB: 100,
      allowedExtensions: ['zip', 'rar', '7z', 'tar', 'gz'],
      allowedMimeTypes: [
        'application/zip',
        'application/x-rar-compressed',
        'application/x-7z-compressed',
        'application/x-tar',
        'application/gzip',
      ],
    }),

    GENERAL: this.createValidationRules({
      maxSizeMB: 50,
      blockedExtensions: ['exe', 'bat', 'sh', 'com', 'cmd', 'scr'],
    }),
  };

  static isImageFile(file: PickedFile): boolean {
    const extension = getFileExtension(file.name || '').toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
    return imageExtensions.includes(extension) || (file.type || '').startsWith('image/');
  }

  static isVideoFile(file: PickedFile): boolean {
    const extension = getFileExtension(file.name || '').toLowerCase();
    const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv'];
    return videoExtensions.includes(extension) || (file.type || '').startsWith('video/');
  }

  static isAudioFile(file: PickedFile): boolean {
    const extension = getFileExtension(file.name || '').toLowerCase();
    const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'm4a'];
    return audioExtensions.includes(extension) || (file.type || '').startsWith('audio/');
  }

  static isDocumentFile(file: PickedFile): boolean {
    const extension = getFileExtension(file.name || '').toLowerCase();
    const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'xls', 'xlsx', 'ppt', 'pptx'];
    return documentExtensions.includes(extension);
  }

  static getExtensionsForFileTypes(fileTypes: string[]): string[] {
    const extensionMap: Record<string, string[]> = {
      images: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'],
      video: ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv'],
      audio: ['mp3', 'wav', 'flac', 'aac', 'm4a'],
      pdf: ['pdf'],
      csv: ['csv'],
      doc: ['doc'],
      docx: ['docx'],
      ppt: ['ppt'],
      pptx: ['pptx'],
      xls: ['xls'],
      xlsx: ['xlsx'],
      zip: ['zip', 'rar', '7z', 'tar', 'gz'],
      plainText: ['txt', 'rtf'],
    };

    const extensions: string[] = [];
    fileTypes.forEach(type => {
      const typeExtensions = extensionMap[type];
      if (typeExtensions) {
        extensions.push(...typeExtensions);
      }
    });

    return [...new Set(extensions)]; // Remove duplicates
  }
}
