import { useAtom } from 'jotai/index';
import {
  downloadStatusAtom,
  downloadSummaryStatusAtom,
} from './GADMGeoJsonDialogAtoms';
import { GADMGeoJsonCountryMetadata } from '/app/models/GADMGeoJsonCountryMetadata';
import { v4 as uuid_v4 } from 'uuid';
import { fetchFiles, FetchStatus } from '/app/services/file/FetchFiles';
import { LoaderProgressResponse } from '/app/services/file/FileLoaderResponse';
import { LoadingProgress } from '/app/services/file/LoadingProgress';
import { FileLoadingStatusTypes } from '/app/services/file/FileLoadingStatusType';
import { createGADM41JsonUrl } from './CreateGADM41JsonUrl';
import { GeoDatabaseTableTypes } from '/app/models/GeoDatabaseTableType';
import { Projects } from '/app/services/database/Projects';
import { ResourceItem } from '/app/models/ResourceItem';

import { ResourceTable } from '/app/services/database/ResourceTable';
import { Resources } from '/app/services/database/Resources';
import { ResourceTypes } from '/app/models/ResourceType';
import { generateNewName } from '/app/utils/nameUtil';

export function useDownloadGADMJsonFiles() {
  const [, setDownloadStatus] = useAtom(downloadStatusAtom);
  const [, setDownloadSummaryProgress] = useAtom(downloadSummaryStatusAtom);

  async function downloadGADMGeoJsonFiles(
    countryMetadataList: GADMGeoJsonCountryMetadata[],
    selectedCheckboxMatrix: boolean[][],
    urlList: string[],
    onFinish: () => void,
  ): Promise<string> {
    const downloadingItems = findDownloadingItems(
      countryMetadataList,
      selectedCheckboxMatrix,
    );

    const uuid = uuid_v4();

    const gadmGeoJsonResourceEntity = await ResourceTable.getResourcesByType(
      ResourceTypes.gadmGeoJSON,
    );

    const name = generateNewName(gadmGeoJsonResourceEntity.map(gadmGeoJsonResourceEntity => gadmGeoJsonResourceEntity.name), 'GADM GeoJSON #');

    await ResourceTable.createGADMGeoJsonResourceEntity({
      uuid,
      name,
      description: '',
      items: downloadingItems,
    });

    const db = await Resources.openResource(
      uuid,
    );

    requestIdleCallback(async () => {
      await fetchFiles({
        urlList,
        onStatusChange: (url: string, urlStatus: { status: FetchStatus }) => {
          setDownloadStatus(
            (draft: Record<string, { status: FetchStatus }>) => {
              return {
                ...draft,
                [url]: urlStatus,
              };
            },
          );
        },

        onSummaryChange: ({
          progress,
          loaded,
          total,
        }: {
          progress: number;
          loaded: number;
          total: number;
        }) => {
          setDownloadSummaryProgress((draft: LoadingProgress) => {
            draft.progress = progress;
            draft.loaded = loaded;
            draft.total = total;
            draft.type = FileLoadingStatusTypes.loading;
          });
        },

        onLoad: async ({ url, data }: { url: string; data: ArrayBuffer }) => {
          const uint8Array = new Uint8Array(data);
          const stream = new ReadableStream<Uint8Array>({
            start(controller) {
              controller.enqueue(uint8Array);
              controller.close();
            },
          });

          db.storeGadmGeoJson({
            stream,
            fileName: url,
            fileSize: undefined,
            cancelCallback(fileName: string): void {
              // TODO
            },
            errorCallback(fileName: string, errorMessage: string): void {
              // TODO
            },
            progressCallback(value: LoaderProgressResponse): void {
              // TODO
            },
            startedCallback(fileName: string): void {
              // TODO
            },
            finishedCallback(fileName: string): void {
              // TODO
            },
          });

          console.log('store: ' + uuid + ' ' + url);
        },
      });
      onFinish();
    });

    return uuid;
  }

  return { downloadGADMGeoJsonFiles };
}

export function findDownloadingItems(
  countryMetadataList: GADMGeoJsonCountryMetadata[],
  selectedCheckboxMatrix: boolean[][],
): ResourceItem[] {
  const downloadingItems: ResourceItem[] = [];

  for (
    let countryIndex = 0;
    countryIndex < countryMetadataList.length;
    countryIndex++
  ) {
    const countryMetadata = countryMetadataList[countryIndex];

    for (let level = 0; level <= countryMetadata.maxLevel; level++) {
      if (
        selectedCheckboxMatrix[countryIndex + 1] &&
        selectedCheckboxMatrix[countryIndex + 1][level + 1]
      ) {
        downloadingItems.push({
          countryName: countryMetadata.countryName,
          countryCode: countryMetadata.countryCode,
          level,
          url: createGADM41JsonUrl(countryMetadata.countryCode, level, false),
        });
      }
    }
  }
  return downloadingItems;
}
