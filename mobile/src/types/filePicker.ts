// Using image picker types instead of document picker

export interface PickedFile {
  id: string;
  uri: string;
  name: string | null;
  error: string | null;
  type: string | null;
  nativeType: string | null;
  size: number | null;
  isVirtual: boolean | null;
  convertibleToMimeTypes: string[] | null;
  hasRequestedType: boolean;
  uploadTime: Date;
  status: 'uploading' | 'completed' | 'error';
  ipfsHash?: string;
  progress?: number;
}

export interface FilePickerOptions {
  allowMultiSelection?: boolean;
  multiple?: boolean;
  type?: FileType[];
  allowedTypes?: string[];
  copyTo?: 'cachesDirectory' | 'documentDirectory';
  presentationStyle?: 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen';
  transitionStyle?: 'coverVertical' | 'flipHorizontal' | 'crossDissolve' | 'partialCurl';
}

export type FileType =
  | 'allFiles'
  | 'images'
  | 'plainText'
  | 'audio'
  | 'video'
  | 'pdf'
  | 'zip'
  | 'csv'
  | 'doc'
  | 'docx'
  | 'ppt'
  | 'pptx'
  | 'xls'
  | 'xlsx'
  | 'rtf'
  | 'txt';

export interface FilePickerError {
  code: string;
  message: string;
  userInfo?: Record<string, any>;
}

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FileValidationRules {
  maxSize?: number; // in bytes
  minSize?: number; // in bytes
  allowedExtensions?: string[];
  blockedExtensions?: string[];
  allowedMimeTypes?: string[];
  blockedMimeTypes?: string[];
}

export interface FilePickerState {
  isLoading: boolean;
  error: FilePickerError | null;
  pickedFiles: PickedFile[];
}

export interface FilePickerResult {
  success: boolean;
  files?: PickedFile[];
  error?: string;
}

export interface UseFilePickerReturn {
  pickFiles: (options?: FilePickerOptions) => Promise<FilePickerResult>;
  pickSingleFile: (options?: Omit<FilePickerOptions, 'allowMultiSelection'>) => Promise<PickedFile | null>;
  pickMixedFiles: (options?: FilePickerOptions) => Promise<PickedFile[]>;
  pickDocuments: (options?: Omit<FilePickerOptions, 'type'>) => Promise<PickedFile[]>;
  pickMedia: (options?: Omit<FilePickerOptions, 'type'>) => Promise<PickedFile[]>;
  clearFiles: () => void;
  removeFile: (fileId: string) => void;
  state: FilePickerState;
}

export interface PermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  status: 'granted' | 'denied' | 'blocked' | 'unavailable' | 'limited';
}

export interface PermissionResult {
  camera: PermissionStatus;
  photoLibrary: PermissionStatus;
}
