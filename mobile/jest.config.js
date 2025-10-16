module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^react-native-document-picker$': '<rootDir>/__mocks__/react-native-document-picker.ts',
    '^react-native-image-picker$': '<rootDir>/__mocks__/react-native-image-picker.ts',
    '^@react-native-documents/picker$': '<rootDir>/__mocks__/@react-native-documents/picker.ts',
    '^@fintoda/react-native-crypto-lib$': '<rootDir>/__mocks__/@fintoda/react-native-crypto-lib.ts',
    '^react-native-permissions$': '<rootDir>/__mocks__/react-native-permissions.ts',
    '^@react-native-async-storage/async-storage$': '@react-native-async-storage/async-storage/jest/async-storage-mock',
    '^@react-native-clipboard/clipboard$': '<rootDir>/__mocks__/@react-native-clipboard/clipboard.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-native-community|@react-navigation|@expo|expo|@unimodules|@noble/secp256k1|@noble/hashes|@react-native-async-storage|react-native-image-picker|react-native-permissions)/)',
  ],
};
