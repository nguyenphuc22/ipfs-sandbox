export const launchImageLibrary = jest.fn(async () => ({
  assets: [],
}));

export const launchCamera = jest.fn(async () => ({
  assets: [],
}));

export const MediaType = {
  photo: 'photo',
  video: 'video',
  mixed: 'mixed',
};

export const ImagePickerResponse = {};

export default {
  launchImageLibrary,
  launchCamera,
  MediaType,
};
