/// <reference lib="webworker" />

import { LoaderProgressResponse } from '../services/file/FileLoaderResponse';
import { FileLoaderRequest } from '../services/file/FileLoaderRequest';
import { FileLoaderRequestType } from '../services/file/FileLoaderRequestType';
import { FileLoaderResponseType } from '../services/file/FileLoaderResponseType';
import {
  CsvLoaders,
  IdeGsmCsvLoaders,
  loadCsvFile,
} from '../services/idegsm/IdeGsmCsvLoaders';
import { GeoPointEntity } from '../models/geo/GeoPointEntity';
import { unzipFileToStream } from '../services/file/UnzipFileToStream';
import { convertFileListToFileArray } from '../utils/fileListUtil';
import { Resources } from '../../app/services/database/Resources';

let workerBusy = false;

const startedCallback = (fileName: string, dbName: string) => {
  // eslint-disable-next-line no-restricted-globals
  self.postMessage({
    value: {
      type: FileLoaderResponseType.started,
      value: {
        dbName,
        fileName,
      },
    },
  });
};

const progressCallback = (value: LoaderProgressResponse) => {
  // eslint-disable-next-line no-restricted-globals
  self.postMessage({
    value,
  });
};

const errorCallback = (fileName: string, errorMessage: string) => {
  // eslint-disable-next-line no-restricted-globals
  self.postMessage({
    value: {
      type: FileLoaderResponseType.error,
      fileName,
      errorMessage,
    },
  });
};

const cancelCallback = (fileName: string) => {
  // eslint-disable-next-line no-restricted-globals
  self.postMessage({
    value: {
      type: FileLoaderResponseType.cancel,
      fileName,
    },
  });
};

const finishedCallback = (fileName: string) => {
  // eslint-disable-next-line no-restricted-globals
  self.postMessage({
    value: {
      type: FileLoaderResponseType.finished,
      fileName,
    },
  });
};

export const loadFileList = async (
  db: Resources,
  fileList: FileList,
  csvLoaders: CsvLoaders
) => {
  // loadWorkerStatus = FileLoadingStatus.loading;

  const files = convertFileListToFileArray(fileList);

  for (const prefix of ['cities', 'routes']) {
    await Promise.all(
      files
        .filter((file) => {
          const filename = file.name.toLowerCase();
          return filename.startsWith(prefix) && filename.endsWith('.csv');
        })
        .map(async (file) =>
          loadCsvFile<GeoPointEntity>({
            resource: db,
            stream: (await unzipFileToStream(file)).stream,
            fileName: file.name,
            fileSize: file.size,
            csvLoaders,
            startedCallback,
            progressCallback,
            errorCallback,
            cancelCallback,
            finishedCallback,
          })
        )
    );
  }

  await Promise.all(
    files
      .filter((file) => {
        const filename = file.name.toLowerCase();
        return (
          filename.startsWith('gadm') &&
          (filename.endsWith('.json') || filename.endsWith('.json.zip'))
        );
      })
      .map(async (file) => {
        return db.storeAsGeoRegion({
          stream: (await unzipFileToStream(file)).stream,
          fileName: file.name,
          fileSize: file.size,
          startedCallback,
          progressCallback,
          errorCallback,
          cancelCallback,
          finishedCallback,
        });
      })
  )
    .catch((error) => {
      console.error(error);
    })
    .then(() => {
      // allDoneCallback();
    });

  await Promise.all(
    files
      .filter((file) => {
        const filename = file.name.toLowerCase();
        return (
          !filename.startsWith('gadm') &&
          (filename.endsWith('.json') || filename.endsWith('.json.zip'))
        );
      })
      .map(async (file) => {
        return db.storeAsGeoJson({
          stream: (await unzipFileToStream(file)).stream,
          fileName: file.name,
          fileSize: file.size,
          startedCallback,
          progressCallback,
          errorCallback,
          cancelCallback,
          finishedCallback,
        });
      })
  )
    .catch((error) => {
      console.error(error);
    })
    .then(() => {
      // allDoneCallback();
    });
};

// eslint-disable-next-line no-restricted-globals
self.onmessage = async function fileLoaderWorker(
  event: MessageEvent<FileLoaderRequest>
) {
  const payload = event.data;
  switch (payload.type) {
    case FileLoaderRequestType.start:
      if (!workerBusy) {
        workerBusy = true;
        const dbName = payload.value.dbName;
        const resource = new Resources(dbName);
        await loadFileList(
          resource,
          (event.data as any).data as FileList,
          IdeGsmCsvLoaders
        );
        workerBusy = false;
      }
      break;
  }
};
