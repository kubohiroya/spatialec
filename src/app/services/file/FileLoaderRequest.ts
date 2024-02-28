import { FileLoaderRequestType } from '/app/services/file/FileLoaderRequestType';

export type FileLoaderRequest =
  | {
      type: FileLoaderRequestType.start;
  value: {
    dbName: string;
    file: File;
  };
    }
  | {
      type: FileLoaderRequestType.cancel;
  value: {
    dbName: string;
  };
    };
