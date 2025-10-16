type ClipboardLike = {
  setString: (value: string) => void | Promise<void>;
  getString: () => Promise<string>;
  hasString?: () => Promise<boolean>;
};

const createStubClipboard = (): ClipboardLike => {
  let storedValue = '';
  return {
    async setString(value: string) {
      storedValue = value ?? '';
    },
    async getString() {
      return storedValue;
    },
    async hasString() {
      return storedValue.length > 0;
    },
  };
};

const loadClipboardModule = (): ClipboardLike => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const required = require('@react-native-clipboard/clipboard');
    const clipboard = (required as any)?.default ?? required;

    if (clipboard && typeof clipboard.setString === 'function' && typeof clipboard.getString === 'function') {
      return clipboard as ClipboardLike;
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('[Clipboard] Native module unavailable, falling back to in-memory stub.', error);
    }
  }

  return createStubClipboard();
};

const clipboardModule = loadClipboardModule();

export const setClipboardString = async (value: string) => {
  await clipboardModule.setString(value);
};

export const getClipboardString = () => clipboardModule.getString();

export const hasClipboardString = () => clipboardModule.hasString?.() ?? Promise.resolve(false);

export default clipboardModule;
