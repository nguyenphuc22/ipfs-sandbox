export const types = {
  allFiles: 'public.item',
  pdf: 'com.adobe.pdf',
  doc: 'com.microsoft.word.doc',
  xls: 'com.microsoft.excel.xls',
  ppt: 'com.microsoft.powerpoint.ppt',
  images: 'public.image',
  video: 'public.movie',
  audio: 'public.audio',
  plainText: 'public.plain-text',
  zip: 'com.pkware.zip-archive',
  csv: 'public.comma-separated-values-text',
};

export const errorCodes = {
  OPERATION_CANCELED: 'OPERATION_CANCELED',
};

export const pick = jest.fn(async () => []);

export const releaseSecureAccess = jest.fn();

export const isErrorWithCode = (error: unknown): error is { code: string } => {
  return Boolean(error && typeof (error as { code?: unknown }).code === 'string');
};

export default {
  types,
  errorCodes,
  pick,
  releaseSecureAccess,
  isErrorWithCode,
};
