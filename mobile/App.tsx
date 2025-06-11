/**
 * IPFS Sandbox Mobile App
 * Clean Architecture Implementation
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {ThemeProvider, useTheme} from './src/styles';
import {FileUploadButton, FileList} from './src/components';
import {useFiles} from './src/hooks';

const AppContent: React.FC = () => {
  const {theme, isDarkMode} = useTheme();
  const {files, uploadFile, deleteFile, isLoading} = useFiles();

  const backgroundStyle = {
    backgroundColor: theme.colors.background,
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
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
