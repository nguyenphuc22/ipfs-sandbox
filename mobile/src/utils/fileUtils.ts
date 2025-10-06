export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.');
  return lastDotIndex !== -1 ? fileName.slice(lastDotIndex + 1) : '';
};

export const getFileIcon = (fileName: string): string => {
  const extension = getFileExtension(fileName).toLowerCase();

  const iconMap: Record<string, string> = {
    pdf: '📄',
    doc: '📄',
    docx: '📄',
    txt: '📄',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    svg: '🖼️',
    mp4: '🎥',
    avi: '🎥',
    mov: '🎥',
    mkv: '🎥',
    mp3: '🎵',
    wav: '🎵',
    flac: '🎵',
    zip: '📦',
    rar: '📦',
    '7z': '📦',
    tar: '📦',
    xls: '📊',
    xlsx: '📊',
    csv: '📊',
    ppt: '📊',
    pptx: '📊',
  };

  return iconMap[extension] || '📄';
};

export const generateRandomId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 11);
};
