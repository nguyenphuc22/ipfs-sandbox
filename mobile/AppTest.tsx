/**
 * IPFS Sandbox Mobile App - Simple Image Picker Test
 * Clean Architecture Implementation
 *
 * @format
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {ThemeProvider, useTheme} from './src/styles';
import {FileUploadButton, FileList, SimpleFilePickerDemo} from './src/components';
import {useFiles} from './src/hooks';

type ViewMode = 'main' | 'test';

const AppContent: React.FC = () => {
  const {theme, isDarkMode} = useTheme();
  const {files, uploadFile, deleteFile, isLoading} = useFiles();
  const [viewMode, setViewMode] = useState<ViewMode>('test'); // Start with test mode

  const backgroundStyle = {
    backgroundColor: theme.colors.background,
  };

  const renderMainView = () => (
    <>
      <View
        style={[
          styles.header,
          {borderBottomColor: theme.colors.border},
        ]}>
        <Text style={[styles.title, {color: theme.colors.text}]}>
          IPFS File Manager
        </Text>
        <Text style={[styles.subtitle, {color: theme.colors.textSecondary}]}>
          Upload and manage your files on IPFS
        </Text>
        
        <TouchableOpacity
          style={[styles.testButton, {backgroundColor: theme.colors.primary}]}
          onPress={() => setViewMode('test')}>
          <Text style={[styles.testButtonText, {color: theme.colors.background}]}>
            Test Image Picker
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <FileUploadButton onPress={uploadFile} loading={isLoading} />
        <View style={styles.fileSection}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            My Files ({files.length})
          </Text>
          <FileList files={files} onDeleteFile={deleteFile} />
        </View>
      </View>
    </>
  );

  const renderTestView = () => (
    <>
      <View
        style={[
          styles.header,
          {borderBottomColor: theme.colors.border},
        ]}>
        <TouchableOpacity
          style={[styles.backButton, {backgroundColor: theme.colors.primary}]}
          onPress={() => setViewMode('main')}>
          <Text style={[styles.backButtonText, {color: theme.colors.background}]}>
            ← Back to Main
          </Text>
        </TouchableOpacity>
      </View>
      <SimpleFilePickerDemo />
    </>
  );

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {viewMode === 'main' ? renderMainView() : renderTestView()}
    </SafeAreaView>
  );
};

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 15,
  },
  testButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  fileSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
});

export default App;
