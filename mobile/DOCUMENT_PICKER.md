# Enhanced Document Picker Implementation

This document describes the enhanced document picker functionality implemented in the IPFS Sandbox Mobile app.

## Overview

The FilePickerService has been enhanced to provide better integration between `react-native-document-picker` and `react-native-image-picker`, allowing for seamless file selection across different file types.

## Features

### 1. Intelligent Picker Selection
- Automatically chooses the best picker based on requested file types
- Uses image picker for media files (better UX)
- Uses document picker for documents and mixed file types

### 2. Enhanced File Type Support
- **Documents**: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, CSV, TXT, RTF
- **Media**: Images (JPG, PNG, GIF, etc.), Videos (MP4, MOV, etc.), Audio (MP3, WAV, etc.)
- **Archives**: ZIP, RAR, 7Z
- **All Files**: Generic file support

### 3. New Methods

#### FilePickerService Methods
```typescript
// Pick any type of files with intelligent picker selection
pickFiles(options?: FilePickerOptions): Promise<PickedFile[]>

// Force document picker for mixed file support
pickMixedFiles(options?: FilePickerOptions): Promise<PickedFile[]>

// Pick only document files
pickDocuments(options?: Omit<FilePickerOptions, 'type'>): Promise<PickedFile[]>

// Pick only media files with optimized UX
pickMedia(options?: Omit<FilePickerOptions, 'type'>): Promise<PickedFile[]>

// Single file selection
pickSingleFile(options?: Omit<FilePickerOptions, 'allowMultiSelection'>): Promise<PickedFile | null>
```

#### useFilePicker Hook Methods
The hook now includes all the above methods plus additional utilities:
```typescript
const {
  pickFiles,
  pickSingleFile,
  pickMixedFiles,     // New
  pickDocuments,      // New
  pickMedia,          // New
  clearFiles,
  removeFile,
  state,
} = useFilePicker(validationRules);
```

### 4. File Type Detection and Validation
```typescript
// Get file type from MIME type
getFileTypeFromMimeType(mimeType: string): FileType

// Get file extension
getFileExtension(fileName: string): string

// Check if file is a document
isDocumentFile(file: PickedFile): boolean

// Check if file is media
isMediaFile(file: PickedFile): boolean
```

## Usage Examples

### Basic Document Selection
```typescript
import { useFilePicker } from '../hooks/useFilePicker';

const MyComponent = () => {
  const { pickDocuments, state } = useFilePicker();

  const handlePickDocuments = async () => {
    const files = await pickDocuments({
      allowMultiSelection: true,
    });
    console.log('Selected documents:', files);
  };

  return (
    <TouchableOpacity onPress={handlePickDocuments}>
      <Text>Pick Documents</Text>
    </TouchableOpacity>
  );
};
```

### Mixed File Selection
```typescript
const handlePickMixedFiles = async () => {
  const files = await pickMixedFiles({
    allowMultiSelection: true,
  });
  // Will use document picker to handle both documents and media
};
```

### Specific File Types
```typescript
// Pick only PDFs
const handlePickPDFs = async () => {
  const files = await pickFiles({
    type: ['pdf'],
    allowMultiSelection: true,
  });
};

// Pick specific document types
const handlePickOfficeFiles = async () => {
  const files = await pickFiles({
    type: ['pdf', 'docx', 'xlsx', 'pptx'],
    allowMultiSelection: true,
  });
};

// Pick media files with optimized picker
const handlePickMedia = async () => {
  const files = await pickMedia({
    allowMultiSelection: true,
  });
};
```

### With Validation
```typescript
const { pickDocuments } = useFilePicker({
  maxSize: 50 * 1024 * 1024, // 50MB
  allowedExtensions: ['pdf', 'docx', 'xlsx'],
  allowedMimeTypes: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
});
```

## Demo Component

A comprehensive demo component is available at:
`src/components/file-manager/DocumentPickerDemo.tsx`

This component demonstrates:
- All picker methods
- File validation
- Error handling
- File display with icons
- File removal
- Loading states

## Configuration

### File Types
The following file types are supported:
```typescript
type FileType =
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
```

### Picker Selection Logic
1. **Document Picker**: Used when file types include documents or when mixed types are requested
2. **Image Picker**: Used only when file types are exclusively media (images, video, audio)
3. **Mixed Selection**: Always uses document picker for maximum compatibility

## Error Handling

The service provides comprehensive error handling:
- User cancellation (graceful handling)
- Permission errors
- File validation errors
- Network/system errors

## Platform Support

- **iOS**: Full support for all file types
- **Android**: Full support for all file types
- Automatic permission handling for photo library access

## Dependencies

- `react-native-document-picker`: ^9.3.1 (already installed)
- `react-native-image-picker`: ^8.2.1 (already installed)
- `react-native-permissions`: ^5.4.1 (already installed)

## Best Practices

1. **Use specific methods**: Use `pickDocuments()` or `pickMedia()` when you know the file type
2. **Validation**: Always implement file validation for production apps
3. **Error handling**: Handle user cancellation gracefully
4. **Permissions**: The hook automatically handles permissions for media files
5. **File size limits**: Set appropriate file size limits based on your use case

## Migration from Previous Version

If you were using the basic `pickFiles` method, your existing code will continue to work. The enhancements are additive and backward compatible.

New recommended patterns:
```typescript
// Old way (still works)
const files = await pickFiles({ type: ['pdf'] });

// New way (more explicit)
const files = await pickDocuments();

// For mixed files
const files = await pickMixedFiles();
```
