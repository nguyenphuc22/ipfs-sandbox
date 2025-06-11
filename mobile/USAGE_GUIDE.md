# How to Use the Enhanced Document Picker

## Quick Start Guide

### 1. Basic Usage in a Component

```tsx
import React from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { useFilePicker } from '../hooks/useFilePicker';

const MyFileUploader = () => {
  const { 
    pickDocuments, 
    pickMedia, 
    pickMixedFiles,
    state 
  } = useFilePicker({
    maxSize: 50 * 1024 * 1024, // 50MB limit
  });

  const handlePickDocuments = async () => {
    const files = await pickDocuments({
      allowMultiSelection: true,
    });
    
    if (files.length > 0) {
      Alert.alert('Success', `Selected ${files.length} document(s)`);
      // Process the files (upload to IPFS, etc.)
    }
  };

  const handlePickMedia = async () => {
    const files = await pickMedia({
      allowMultiSelection: true,
    });
    
    if (files.length > 0) {
      Alert.alert('Success', `Selected ${files.length} media file(s)`);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handlePickDocuments}>
        <Text>Pick Documents (PDF, DOC, etc.)</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handlePickMedia}>
        <Text>Pick Media (Images, Videos)</Text>
      </TouchableOpacity>
      
      {state.isLoading && <Text>Loading...</Text>}
      {state.error && <Text>Error: {state.error.message}</Text>}
    </View>
  );
};
```

### 2. Advanced Usage with Specific File Types

```tsx
import { useFilePicker } from '../hooks/useFilePicker';

const AdvancedPicker = () => {
  const { pickFiles } = useFilePicker();

  // Pick only PDFs
  const pickPDFs = async () => {
    const files = await pickFiles({
      type: ['pdf'],
      allowMultiSelection: true,
    });
  };

  // Pick specific document types
  const pickOfficeFiles = async () => {
    const files = await pickFiles({
      type: ['pdf', 'docx', 'xlsx', 'pptx'],
      allowMultiSelection: true,
    });
  };

  // Pick mixed files (documents + images)
  const pickMixed = async () => {
    const files = await pickFiles({
      type: ['pdf', 'docx', 'images'],
      allowMultiSelection: true,
    });
  };
};
```

### 3. File Validation and Processing

```tsx
import { useFilePicker } from '../hooks/useFilePicker';

const ValidatedPicker = () => {
  const { pickDocuments, state } = useFilePicker({
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedExtensions: ['pdf', 'docx', 'xlsx'],
    allowedMimeTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  });

  const processFiles = async () => {
    const files = await pickDocuments();
    
    // Files are automatically validated based on the rules above
    files.forEach(file => {
      console.log('Valid file:', file.name, file.size, file.type);
      // Upload to IPFS or process as needed
    });
  };
};
```

## Method Reference

### useFilePicker Hook Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| `pickFiles()` | Smart picker - chooses best picker for file types | `FilePickerOptions` |
| `pickDocuments()` | Pick only document files | `Omit<FilePickerOptions, 'type'>` |
| `pickMedia()` | Pick only media files (optimized UX) | `Omit<FilePickerOptions, 'type'>` |
| `pickMixedFiles()` | Force document picker for mixed files | `FilePickerOptions` |
| `pickSingleFile()` | Pick a single file | `Omit<FilePickerOptions, 'allowMultiSelection'>` |

### Supported File Types

| Category | Types | Extensions |
|----------|-------|------------|
| Documents | `pdf`, `doc`, `docx`, `xls`, `xlsx`, `ppt`, `pptx` | .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx |
| Text | `csv`, `txt`, `plainText` | .csv, .txt, .rtf |
| Media | `images`, `video`, `audio` | .jpg, .png, .mp4, .mp3, etc. |
| Archives | `zip` | .zip, .rar, .7z |
| All | `allFiles` | Any file type |

## Best Practices

1. **Use specific methods**: Use `pickDocuments()` or `pickMedia()` when you know the file type
2. **Set validation rules**: Always set file size limits and allowed types for production
3. **Handle errors gracefully**: Check for user cancellation vs. actual errors
4. **Show loading states**: Use `state.isLoading` to show progress indicators
5. **Provide feedback**: Show success/error messages to users

## Integration with Existing App

To integrate with your existing IPFS file manager:

```tsx
// In your existing component
import { useFilePicker } from '../hooks/useFilePicker';

const FileManager = () => {
  const { uploadFile } = useFiles(); // Your existing hook
  const { pickMixedFiles } = useFilePicker();

  const handleFileUpload = async () => {
    // Pick files with the enhanced picker
    const files = await pickMixedFiles({
      allowMultiSelection: true,
    });

    // Upload each file to IPFS using your existing logic
    for (const file of files) {
      await uploadFile(file);
    }
  };

  return (
    <TouchableOpacity onPress={handleFileUpload}>
      <Text>Upload Files to IPFS</Text>
    </TouchableOpacity>
  );
};
```

## Testing the Implementation

1. Use the `DocumentPickerDemo` component to test all functionality
2. Replace your main App.tsx with `AppWithDemo.tsx` temporarily for testing
3. Test on both iOS and Android devices
4. Test different file types and sizes
5. Test permission handling
