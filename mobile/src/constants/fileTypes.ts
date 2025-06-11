export const FILE_TYPES = {
  DOCUMENT: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'bmp', 'webp'],
  VIDEO: ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv'],
  AUDIO: ['mp3', 'wav', 'flac', 'aac', 'm4a'],
  ARCHIVE: ['zip', 'rar', '7z', 'tar', 'gz'],
  SPREADSHEET: ['xls', 'xlsx', 'csv'],
  PRESENTATION: ['ppt', 'pptx'],
  CODE: ['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'json', 'xml'],
} as const;

export const MOCK_FILE_NAMES = [
  'document.pdf',
  'image.jpg',
  'video.mp4',
  'presentation.pptx',
  'spreadsheet.xlsx',
  'archive.zip',
  'report.docx',
  'photo.png',
  'music.mp3',
  'data.csv',
  'notes.txt',
  'backup.tar.gz',
] as const;

export const FILE_SIZE_LIMITS = {
  MIN: 1000, // 1KB
  MAX: 10000000, // 10MB
} as const;
