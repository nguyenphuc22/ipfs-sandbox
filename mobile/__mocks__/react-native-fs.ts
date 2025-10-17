const readFile = jest.fn();
const writeFile = jest.fn().mockResolvedValue(undefined);
const unlink = jest.fn().mockResolvedValue(undefined);

const TemporaryDirectoryPath = '/tmp/';
const CachesDirectoryPath = '/tmp';

const ReactNativeFS = {
  readFile,
  writeFile,
  unlink,
  TemporaryDirectoryPath,
  CachesDirectoryPath,
};

export default ReactNativeFS;
