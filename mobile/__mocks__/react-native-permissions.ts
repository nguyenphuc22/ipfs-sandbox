export const PERMISSIONS = {
  IOS: {
    CAMERA: 'ios.permission.CAMERA',
    PHOTO_LIBRARY: 'ios.permission.PHOTO_LIBRARY',
  },
  ANDROID: {
    CAMERA: 'android.permission.CAMERA',
    READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE',
    WRITE_EXTERNAL_STORAGE: 'android.permission.WRITE_EXTERNAL_STORAGE',
  },
};

export const RESULTS = {
  UNAVAILABLE: 'unavailable',
  DENIED: 'denied',
  LIMITED: 'limited',
  GRANTED: 'granted',
  BLOCKED: 'blocked',
};

const createResolvedMock = (value: string) => jest.fn(async () => value);

export const check = createResolvedMock(RESULTS.GRANTED);
export const request = createResolvedMock(RESULTS.GRANTED);
export const openSettings = jest.fn(async () => undefined);
export const checkMultiple = jest.fn(async () => ({
  [PERMISSIONS.IOS.CAMERA]: RESULTS.GRANTED,
}));
export const requestMultiple = jest.fn(async () => ({
  [PERMISSIONS.IOS.CAMERA]: RESULTS.GRANTED,
}));

export default {
  PERMISSIONS,
  RESULTS,
  check,
  request,
  openSettings,
  checkMultiple,
  requestMultiple,
};
