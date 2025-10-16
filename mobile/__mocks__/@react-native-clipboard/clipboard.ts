const Clipboard = {
  getString: jest.fn(async () => ''),
  setString: jest.fn((value: string) => value),
  hasString: jest.fn(async () => true),
  addListener: jest.fn(() => ({ remove: jest.fn() })),
  removeAllListeners: jest.fn(),
};

export default Clipboard;
export const getString = Clipboard.getString;
export const setString = Clipboard.setString;
export const hasString = Clipboard.hasString;
export const addListener = Clipboard.addListener;
export const removeAllListeners = Clipboard.removeAllListeners;
