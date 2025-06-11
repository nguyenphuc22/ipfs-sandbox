/**
 * IPFS Sandbox Mobile App - Enhanced with Document Picker Demo
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
  ScrollView,
} from 'react-native';
import {ThemeProvider, useTheme} from './src/styles';
import {FileUploadButton, FileList, DocumentPickerDemo} from './src/components';
import {useFiles} from './src/hooks';

type ViewMode = 'main' | 'demo';

const AppContent: React.FC = () => {
  const {theme, isDarkMode} = useTheme();
  const {files, uploadFile, deleteFile, isLoading} = useFiles();
  const [viewMode, setViewMode] = useState<ViewMode>('main');

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
          style={[styles.demoButton, {backgroundColor: theme.colors.primary}]}
          onPress={() => setViewMode('demo')}>
          <Text style={[styles.demoButtonText, {color: theme.colors.background}]}>
            View Document Picker Demo
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

  const renderDemoView = () => (
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
      <DocumentPickerDemo />
    </>
  );

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {viewMode === 'main' ? renderMainView() : renderDemoView()}
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
  demoButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  demoButtonText: {
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
