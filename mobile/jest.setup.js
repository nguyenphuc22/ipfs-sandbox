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
