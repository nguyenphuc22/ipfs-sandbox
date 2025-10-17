jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}), {
  virtual: true,
});

jest.mock(
  'expo-modules-core',
  () => ({
    NativeModulesProxy: {},
    EventEmitter: class {
      // eslint-disable-next-line class-methods-use-this
      addListener() {}
      // eslint-disable-next-line class-methods-use-this
      removeAllListeners() {}
      // eslint-disable-next-line class-methods-use-this
      removeSubscription() {}
    },
    Platform: { OS: 'ios' },
  }),
  { virtual: true },
);

jest.mock('@noble/hashes/sha2');

jest.mock('react-native-fs');

jest.mock('react-native-quick-crypto', () => {
  const mockSubtle = {
    encrypt: jest.fn(),
    decrypt: jest.fn(),
    importKey: jest.fn(),
  };

  const getRandomValues = jest.fn(array => {
    for (let i = 0; i < array.length; i += 1) {
      array[i] = i % 256;
    }
    return array;
  });

  const createHash = jest.fn(() => {
    const data = [];
    return {
      update: jest.fn(chunk => data.push(chunk)),
      digest: jest.fn(() => new Uint8Array(32).fill(1)),
    };
  });

  const mockQuickCrypto = {
    createHash,
    getRandomValues,
    randomUUID: jest.fn(() => '00000000-0000-4000-8000-000000000000'),
    subtle: mockSubtle,
    webcrypto: { subtle: mockSubtle },
  };

  return {
    __esModule: true,
    default: mockQuickCrypto,
    install: jest.fn(),
  };
});
