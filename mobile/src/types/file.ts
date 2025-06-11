export interface FileData {
  id: string;
  name: string;
  size: number;
  uploadTime: Date;
  status: FileStatus;
  ipfsHash?: string;
}

export type FileStatus = 'uploading' | 'completed' | 'error';

export interface FileUploadButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export interface FileItemProps {
  file: FileData;
  onDelete: (id: string) => void;
}

export interface FileListProps {
  files: FileData[];
  onDeleteFile: (id: string) => void;
}
