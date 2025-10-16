export const types = {
  allFiles: 'allFiles',
  images: 'images',
  pdf: 'pdf',
};

export const pick = jest.fn(async () => []);
export const isCancel = jest.fn(() => false);
export const releaseSecureAccess = jest.fn();

export default {
  types,
  pick,
  isCancel,
  releaseSecureAccess,
};
