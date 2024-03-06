import Dexie, { DexieError, Table } from 'dexie';
import { GeoRegionEntity } from '../../../app/models/geo/GeoRegionEntity';
import { GeoPointEntity } from '../../../app/models/geo/GeoPointEntity';
import { GeoRouteSegmentEntity } from '../../../app/models/geo/GeoRouteSegmentEntity';
import { GeoJsonEntity } from '../../../app/services/database/GeoJsonEntity';
import {
  Feature,
  SIMPLIFY_TOLERANCE, STORE_AS_GEO_JSONS,
  STORE_AS_GEO_REGIONS,
  zoomLevels,
  zoomLevelsExt
} from '../../../app/services/database/Constants';
import {
  GeoDatabaseTableType,
  GeoDatabaseTableTypes
} from '../../../app/models/GeoDatabaseTableType';
import { PROJECT_TABLE_DB_NAME, RESOURCE_TABLE_DB_NAME } from '../../../app/Constants';
import { GeoRouteSegmentSource } from '../../../app/models/geo/GeoRouteSegmentSource';
import {
  getTileMortonNumbers,
  getTilesMortonNumbersForAllZoomsMap,
  MAX_ZOOM_LEVEL,
  SpecialMortonNumbers
} from '../../../app/utils/mortonNumberUtil';
import * as uuid from 'uuid';
import { LoaderProgressResponse } from '../../../app/services/file/FileLoaderResponse';
import { JSONParser } from '@streamparser/json-whatwg';
import {
  combinedValueMap,
  Coordinate,
  simplifyPolygons
} from '../../../app/utils/simplify';
import { getPolygonsBounds } from '../../../app/utils/mapUtil';
import { geojsonToBinary } from '@loaders.gl/gis';
import { FileLoaderResponseType } from '../../../app/services/file/FileLoaderResponseType';

export class Resources extends Dexie {
  public countries: Dexie.Table<GeoRegionEntity, number>;
  public regions1: Dexie.Table<GeoRegionEntity, number>;
  public regions2: Dexie.Table<GeoRegionEntity, number>;
  public points: Dexie.Table<GeoPointEntity, number>;
  public routeSegments: Dexie.Table<GeoRouteSegmentEntity, number>;
  public gadm0: Dexie.Table<GeoJsonEntity, number>;
  public gadm1: Dexie.Table<GeoJsonEntity, number>;
  public gadm2: Dexie.Table<GeoJsonEntity, number>;

  public constructor(name: string) {
    super(name);
    this.version(10).stores({
      countries: '++id, name, &gid_0, ' + zoomLevels + ',' + zoomLevelsExt,
      regions1:
        '++id, name, resourceIdRef, &[gid_0+gid_1], ' +
        zoomLevels +
        ',' +
        zoomLevelsExt,
      regions2:
        '++id, resourceIdRef, name, &[gid_0+gid_1+gid_2], ' +
        zoomLevels +
        ',' +
        zoomLevelsExt,
      points:
        '++id, resourceIdRef, type, country, name_1, name, &[country+name_1+name], ' +
        zoomLevels,
      routeSegments:
        '++id, resourceIdRef, mode, sourceCountry, sourceName1, sourceName2, sourceName, targetCountry, targetName1, targetName2, targetName, sourceIdRef, targetIdRef, &[sourceIdRef+targetIdRef], ' +
        zoomLevels +
        ',' +
        zoomLevelsExt,
      gadm0: '++id, name, &gid_0, ' + zoomLevels + ',' + zoomLevelsExt,
      gadm1:
        '++id, name, resourceIdRef, &[gid_0+gid_1], ' +
        zoomLevels +
        ',' +
        zoomLevelsExt,
      gadm2:
        '++id, resourceIdRef, name, &[gid_0+gid_1+gid_2], ' +
        zoomLevels +
        ',' +
        zoomLevelsExt
    });

    this.countries = this.table('countries');
    this.regions1 = this.table('regions1');
    this.regions2 = this.table('regions2');
    this.points = this.table('points');
    this.routeSegments = this.table('routeSegments');
    this.gadm0 = this.table('gadm0');
    this.gadm1 = this.table('gadm1');
    this.gadm2 = this.table('gadm2');
  }

  public static fileNameOf(type: GeoDatabaseTableType, uuid: string) {
    switch (type) {
      case GeoDatabaseTableTypes.resources:
        return `${RESOURCE_TABLE_DB_NAME}-${uuid}`;
      case GeoDatabaseTableTypes.projects:
        return `${PROJECT_TABLE_DB_NAME}-${uuid}`;
      default:
        throw new Error('invalid type:' + type);
    }
  }

  public static async openResource(uuid: string): Promise<Resources> {
    return new Resources(
      this.fileNameOf(GeoDatabaseTableTypes.resources, uuid)
    );
  }

  /*
  async storeGADMGeoJsonResourceEntity(){
    await storeGadmGeoJsons({
      db,
      stream,
      fileName: url,
      fileSize: undefined,
      cancelCallback(fileName: string): void {},
      errorCallback(fileName: string, errorMessage: string): void {},
      progressCallback(value: LoaderProgressResponse): void {},
      startedCallback(fileName: string): void {},
      finishedCallback(fileName: string): void {},
    });
  }
   */

  async findAllGeoRegions(mortonNumbers: number[][][], zoom: number) {
    const targetTables =
      0 <= zoom && zoom <= 2
        ? [this.countries]
        : zoom <= 4
          ? [this.countries, this.regions1]
          : [this.regions1, this.regions2];

    return (
      await Promise.all(
        targetTables.map(async (db) => {
          const promises: Promise<GeoRegionEntity[]>[] = [];
          for (let z = zoom; z >= 0; z--) {
            if (mortonNumbers[zoom].length === 1) {
              promises.push(
                db.where(`z${zoom}`).anyOf(mortonNumbers[zoom][0]).toArray()
              );
              if (mortonNumbers[zoom][0].length === 1) {
                break;
              }
            } else {
              promises.push(
                db
                  .where(`z${zoom}`)
                  .anyOf(
                    mortonNumbers[zoom].length === 2
                      ? mortonNumbers[zoom][0].concat(mortonNumbers[zoom][1])
                      : mortonNumbers[zoom][0]
                  )
                  .toArray()
              );
            }
          }
          return (await Promise.all(promises)).flat(1);
        })
      )
    ).flat(1);
  }

  async findAllGeoPoints(mortonNumbers: number[][][], zoom: number) {
    const table = this.points;
    const promises: Promise<GeoPointEntity[]>[] = [];
    for (let z = zoom; z >= 0; z--) {
      if (mortonNumbers[zoom].length === 1) {
        promises.push(
          table.where(`z${zoom}`).anyOf(mortonNumbers[zoom][0]).toArray()
        );
        if (mortonNumbers[zoom][0].length === 1) {
          break;
        }
      } else {
        promises.push(
          table
            .where(`z${zoom}`)
            .anyOf(
              mortonNumbers[zoom].length === 2
                ? mortonNumbers[zoom][0].concat(mortonNumbers[zoom][1])
                : mortonNumbers[zoom][0]
            )
            .toArray()
        );
      }
    }
    return (await Promise.all(promises)).flat(1);
  }

  async findAllGeoLineStrings(mortonNumbers: number[][][], zoom: number) {
    const table = this.routeSegments;
    const promises: Promise<GeoRouteSegmentEntity[]>[] = [];
    for (let z = zoom; z >= 0; z--) {
      if (mortonNumbers[zoom].length === 1) {
        promises.push(
          table.where(`z${zoom}`).anyOf(mortonNumbers[zoom][0]).toArray()
        );
        if (mortonNumbers[zoom][0].length === 1) {
          break;
        }
      } else {
        promises.push(
          table
            .where(`z${zoom}`)
            .anyOf(
              mortonNumbers[zoom].length === 2
                ? mortonNumbers[zoom][0].concat(mortonNumbers[zoom][1])
                : mortonNumbers[zoom][0]
            )
            .toArray()
        );
      }
    }
    return (await Promise.all(promises)).flat(1);
  }

  async storeGISRouteSegment(
    segmentSources: GeoRouteSegmentSource[]
  ): Promise<void> {
    const records: GeoRouteSegmentEntity[] = await Promise.all(
      segmentSources.map(async (segmentSource: GeoRouteSegmentSource) => {
        const {
          sourceCountry,
          sourceName1,
          sourceName2,
          sourceName,
          targetCountry,
          targetName1,
          targetName2,
          targetName
        } = segmentSource;

        const source = await this.findGISPoint({
          country: sourceCountry,
          name_1: sourceName1,
          name_2: sourceName2,
          name: sourceName
        });
        const target = await this.findGISPoint({
          country: targetCountry,
          name_1: targetName1,
          name_2: targetName2,
          name: targetName
        });

        if (
          source === undefined ||
          target === undefined ||
          source.id === undefined ||
          target.id === undefined
        )
          throw new Error();

        const [north, south] =
          source.lat > target.lat
            ? [source.lat, target.lat]
            : [target.lat, source.lat];
        const [east, west] =
          source.lng > target.lng
            ? [source.lng, target.lng]
            : [target.lng, source.lng];

        const mortonNumbersByZoomLevels = getTilesMortonNumbersForAllZoomsMap(
          { lat: north, lng: east },
          { lat: south, lng: west },
          MAX_ZOOM_LEVEL
        );

        const ret = {
          ...segmentSource,
          uuid: uuid.v4(),
          sourceIdRef: source.uuid,
          targetIdRef: target.uuid,
          ...mortonNumbersByZoomLevels
        } as unknown as GeoRouteSegmentEntity;
        console.log(ret);
        return ret;
      })
    );

    await this.routeSegments.bulkAdd(records);
  }

  async findGISPoint({
                       country,
                       name_1,
                       name_2,
                       name
                     }: {
    country: string;
    name_1: string;
    name_2: string;
    name?: string;
  }): Promise<GeoPointEntity | undefined> {
    return this.points
      .where('[country+name_1+name_2+name]')
      .equals(country + name_1 + name_2 + name)
      .last();
  }

  async storeAsGeoJson({
                         stream,
                         fileName,
                         fileSize,
                         startedCallback,
                         progressCallback,
                         errorCallback,
                         finishedCallback,
                         cancelCallback
                       }: {
    stream: ReadableStream;
    fileName: string;
    fileSize?: number;
    startedCallback?: (fileName: string, dbName: string) => void;
    progressCallback?: (value: LoaderProgressResponse) => void;
    errorCallback?: (fileName: string, errorMessage: string) => void;
    cancelCallback?: (fileName: string) => void;
    finishedCallback?: (fileName: string) => void;
  }) {
    const bufferSize = 64;

    let countries: GeoJsonEntity[] = [];
    let regions1: GeoJsonEntity[] = [];
    let regions2: GeoJsonEntity[] = [];

    const parser = new JSONParser({
      stringBufferSize: undefined,
      paths: ['$.features'],
      keepStack: false
    });

    const bulkAdd = async <T>(
      table: Table<T>,
      entities: T[],
      fileName: string
    ) => {
      table.bulkAdd(entities).catch((error) => {
        errorCallback && errorCallback(fileName, error.message);
      });
    };

    let total = 0;
    const processJSONReader = async (reader: ReadableStream<Uint8Array>) => {
      startedCallback && startedCallback(fileName, this.name);

      reader
        .getReader()
        .read()
        .then((result) => {
          const { done, value } = result;
          if (done) {
            return;
          }

          const features = (value as any).value;
          total += features.length;

          features.forEach((feature: Feature, featureIndex: number) => {
            const { COUNTRY, NAME_1, NAME_2, GID_0, GID_1, GID_2 } =
              feature.properties;
            const coordinates = feature.geometry
              .coordinates as unknown as Coordinate[][][];

            const simplifiedCoordinates = simplifyPolygons(
              `${COUNTRY}\t${NAME_1}\t${NAME_2}`,
              coordinates,
              SIMPLIFY_TOLERANCE,
              true,
              combinedValueMap
            );

            //NAME_1 === 'Kagawa' && console.log({ NAME_1, coordinates });
            //NAME_1 === 'Tokushima' && console.log({ NAME_1, coordinates });

            const mortonNumbersByZoomLevels: Record<string, number> = {};

            const boundingBox = getPolygonsBounds(simplifiedCoordinates);

            // console.log(coordinates, simplifiedCoordinates, boundingBox);

            for (let zoom = 0; zoom <= MAX_ZOOM_LEVEL; zoom++) {
              const mortonNumbers = getTileMortonNumbers(
                boundingBox.topLeft,
                boundingBox.bottomRight,
                zoom
              );
              if (mortonNumbers.length === 0) {
                mortonNumbersByZoomLevels[`z${zoom}`] =
                  SpecialMortonNumbers.NOT_CONTAINED;
              } else if (mortonNumbers.length === 1) {
                if (mortonNumbers[0].length === 1) {
                  mortonNumbersByZoomLevels[`z${zoom}`] = mortonNumbers[0][0];
                } else if (mortonNumbers[0].length >= 2) {
                  mortonNumbersByZoomLevels[`z${zoom}`] =
                    mortonNumbersByZoomLevels[`z${zoom - 1}`];
                } else {
                  throw new Error();
                }
              } else if (mortonNumbers.length === 2) {
                if (mortonNumbers[1].length === 1) {
                  mortonNumbersByZoomLevels[`z${zoom}_`] = mortonNumbers[1][0];
                } else if (mortonNumbers[1].length >= 2) {
                  mortonNumbersByZoomLevels[`z${zoom}_`] =
                    mortonNumbersByZoomLevels[`z${zoom - 1}_`];
                }
              } else {
                throw new Error(
                  'mortonNumber.length > 2 :' + mortonNumbers.join(' ,')
                );
              }
            }

            const binaryFeatures = geojsonToBinary(features, {
              PositionDataType: Float32Array,
              fixRingWinding: true
            });

            const region: GeoJsonEntity = {
              country: COUNTRY,
              gid_0: GID_0,
              binaryFeatures,
              ...mortonNumbersByZoomLevels
            } as unknown as GeoJsonEntity;

            if (
              features.some(
                (feature: { coordinates: number[] }) =>
                  feature.coordinates?.length > 0
              ) &&
              region.country
            ) {
              if (NAME_1) {
                if (NAME_2) {
                  regions2.push({
                    ...region,
                    name_1: NAME_1,
                    gid_1: GID_1,
                    name_2: NAME_2,
                    gid_2: GID_2,
                    name: region.name_2
                  });
                } else {
                  regions1.push({
                    ...region,
                    name_1: NAME_1,
                    gid_1: GID_1,
                    name: region.name_1
                  });
                }
              } else {
                countries.push({ ...region, name: region.country });
              }

              progressCallback &&
              progressCallback({
                type: FileLoaderResponseType.progress,
                progress: (featureIndex / features.length) * 100,
                index: featureIndex,
                total,
                unit: 'items',
                fileName,
                fileSize: fileSize || -1
              });

              /*
              console.log(
                'loading:',
                countries.length,
                regions1.length,
                regions2.length,
              );
               */

              if (countries.length === bufferSize) {
                bulkAdd<GeoJsonEntity>(this.gadm0, countries, fileName);
                countries = [];
              }
              if (regions1.length === bufferSize) {
                bulkAdd<GeoJsonEntity>(this.gadm1, regions1, fileName);
                regions1 = [];
              }
              if (regions2.length === bufferSize) {
                bulkAdd<GeoJsonEntity>(this.gadm2, regions2, fileName);
                regions2 = [];
              }
            }
          });

          if (countries.length > 0) {
            bulkAdd<GeoJsonEntity>(this.gadm0, countries, fileName);
          }
          if (regions1.length > 0) {
            bulkAdd<GeoJsonEntity>(this.gadm1, regions1, fileName);
          }
          if (regions2.length > 0) {
            bulkAdd<GeoJsonEntity>(this.gadm2, regions2, fileName);
          }

          progressCallback &&
          progressCallback({
            type: FileLoaderResponseType.progress,
            fileName,
            fileSize,
            progress: 100,
            total,
            index: total,
            unit: 'items_end'
          });

          finishedCallback && finishedCallback(fileName);
        });
    };

    try {
      await processJSONReader(stream.pipeThrough(parser));
    } catch (error) {
      console.error(error);
      errorCallback && errorCallback(fileName, (error as DexieError).message);
      return;
    }
  }

  async storeGadmGeoJson({
                           stream,
                           fileName,
                           fileSize,
                           startedCallback,
                           progressCallback,
                           errorCallback,
                           finishedCallback,
                           cancelCallback
                         }: {
    stream: ReadableStream;
    fileName: string;
    fileSize?: number;
    startedCallback?: (fileName: string, dbName: string) => void;
    progressCallback?: (value: LoaderProgressResponse) => void;
    errorCallback?: (fileName: string, errorMessage: string) => void;
    cancelCallback?: (fileName: string) => void;
    finishedCallback?: (fileName: string) => void;
  }) {
    if (STORE_AS_GEO_REGIONS) {
      await this.storeAsGeoRegion({
        stream,
        fileName,
        fileSize,
        startedCallback,
        progressCallback,
        errorCallback,
        finishedCallback,
        cancelCallback
      });
    }
    if (STORE_AS_GEO_JSONS) {
      await this.storeAsGeoJson({
        stream,
        fileName,
        fileSize,
        startedCallback,
        progressCallback,
        errorCallback,
        finishedCallback,
        cancelCallback
      });
    }
  }

  async storeAsGeoRegion({
                           stream,
                           fileName,
                           fileSize,
                           startedCallback,
                           progressCallback,
                           errorCallback,
                           finishedCallback,
                           cancelCallback
                         }: {
    stream: ReadableStream;
    fileName: string;
    fileSize?: number;
    startedCallback?: (fileName: string, dbName: string) => void;
    progressCallback?: (value: LoaderProgressResponse) => void;
    errorCallback?: (fileName: string, errorMessage: string) => void;
    cancelCallback?: (fileName: string) => void;
    finishedCallback?: (fileName: string) => void;
  }) {
    const bufferSize = 64;

    let countries: GeoRegionEntity[] = [];
    let regions1: GeoRegionEntity[] = [];
    let regions2: GeoRegionEntity[] = [];

    const parser = new JSONParser({
      stringBufferSize: undefined,
      paths: ['$.features'],
      keepStack: false
    });

    const bulkAdd = async <T>(
      table: Table<T>,
      entities: T[],
      fileName: string
    ) => {
      table.bulkAdd(entities).catch((error) => {
        errorCallback && errorCallback(fileName, error.message);
      });
    };

    let total = 0;
    const processJSONReader = async (reader: ReadableStream<Uint8Array>) => {
      startedCallback && startedCallback(fileName, this.name);

      reader
        .getReader()
        .read()
        .then((result) => {
          const { done, value } = result;
          if (done) {
            return;
          }

          const features = (value as any).value;
          total += features.length;

          features.forEach((feature: Feature, featureIndex: number) => {
            const { COUNTRY, NAME_1, NAME_2, GID_0, GID_1, GID_2 } =
              feature.properties;
            const coordinates = feature.geometry
              .coordinates as unknown as Coordinate[][][];

            const simplifiedCoordinates = simplifyPolygons(
              `${COUNTRY}\t${NAME_1}\t${NAME_2}`,
              coordinates,
              SIMPLIFY_TOLERANCE,
              true,
              combinedValueMap
            );

            //NAME_1 === 'Kagawa' && console.log({ NAME_1, coordinates });
            //NAME_1 === 'Tokushima' && console.log({ NAME_1, coordinates });

            const mortonNumbersByZoomLevels: Record<string, number> = {};

            const boundingBox = getPolygonsBounds(simplifiedCoordinates);

            // console.log(coordinates, simplifiedCoordinates, boundingBox);

            for (let zoom = 0; zoom <= MAX_ZOOM_LEVEL; zoom++) {
              const mortonNumbers = getTileMortonNumbers(
                boundingBox.topLeft,
                boundingBox.bottomRight,
                zoom
              );
              if (mortonNumbers.length === 0) {
                mortonNumbersByZoomLevels[`z${zoom}`] =
                  SpecialMortonNumbers.NOT_CONTAINED;
              } else if (mortonNumbers.length === 1) {
                if (mortonNumbers[0].length === 1) {
                  mortonNumbersByZoomLevels[`z${zoom}`] = mortonNumbers[0][0];
                } else if (mortonNumbers[0].length >= 2) {
                  mortonNumbersByZoomLevels[`z${zoom}`] =
                    mortonNumbersByZoomLevels[`z${zoom - 1}`];
                } else {
                  throw new Error();
                }
              } else if (mortonNumbers.length === 2) {
                if (mortonNumbers[1].length === 1) {
                  mortonNumbersByZoomLevels[`z${zoom}_`] = mortonNumbers[1][0];
                } else if (mortonNumbers[1].length >= 2) {
                  mortonNumbersByZoomLevels[`z${zoom}_`] =
                    mortonNumbersByZoomLevels[`z${zoom - 1}_`];
                }
              } else {
                throw new Error(
                  'mortonNumber.length > 2 :' + mortonNumbers.join(' ,')
                );
              }
            }

            const region: GeoRegionEntity = {
              country: COUNTRY,
              gid_0: GID_0,
              coordinates: simplifiedCoordinates,
              ...mortonNumbersByZoomLevels
            } as unknown as GeoRegionEntity;

            if (region.coordinates.length > 0 && region.country) {
              if (NAME_1) {
                if (NAME_2) {
                  regions2.push({
                    ...region,
                    name_1: NAME_1,
                    gid_1: GID_1,
                    name_2: NAME_2,
                    gid_2: GID_2,
                    name: region.name_2
                  });
                } else {
                  regions1.push({
                    ...region,
                    name_1: NAME_1,
                    gid_1: GID_1,
                    name: region.name_1
                  });
                }
              } else {
                countries.push({ ...region, name: region.country });
              }

              progressCallback &&
              progressCallback({
                type: FileLoaderResponseType.progress,
                progress: (featureIndex / features.length) * 100,
                index: featureIndex,
                total,
                unit: 'items',
                fileName,
                fileSize: fileSize || -1
              });

              /*
              console.log(
                'loading:',
                countries.length,
                regions1.length,
                regions2.length,
              );
               */

              if (countries.length === bufferSize) {
                bulkAdd<GeoRegionEntity>(this.countries, countries, fileName);
                countries = [];
              }
              if (regions1.length === bufferSize) {
                bulkAdd<GeoRegionEntity>(this.regions1, regions1, fileName);
                regions1 = [];
              }
              if (regions2.length === bufferSize) {
                bulkAdd<GeoRegionEntity>(this.regions2, regions2, fileName);
                regions2 = [];
              }
            }
          });

          if (countries.length > 0) {
            bulkAdd<GeoRegionEntity>(this.countries, countries, fileName);
          }
          if (regions1.length > 0) {
            bulkAdd<GeoRegionEntity>(this.regions1, regions1, fileName);
          }
          if (regions2.length > 0) {
            bulkAdd<GeoRegionEntity>(this.regions2, regions2, fileName);
          }

          progressCallback &&
          progressCallback({
            type: FileLoaderResponseType.progress,
            fileName,
            fileSize,
            progress: 100,
            total,
            index: total,
            unit: 'items_end'
          });

          finishedCallback && finishedCallback(fileName);
        });
    };

    try {
      await processJSONReader(stream.pipeThrough(parser));
    } catch (error) {
      console.error(error);
      errorCallback && errorCallback(fileName, (error as DexieError).message);
      return;
    }
  }
}