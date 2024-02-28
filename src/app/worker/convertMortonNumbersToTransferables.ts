import { GeoPointEntity } from '../models/geo/GeoPointEntity';
import { GeoRouteSegmentEntity } from '../models/geo/GeoRouteSegmentEntity';
import { GeoRegionEntity } from '../models/geo/GeoRegionEntity';
import { Projects } from '../services/database/Projects';
import { GeoDatabaseTableTypes } from '../models/GeoDatabaseTableType';
import {
  CircleSource,
  convertCirclesToBuffer,
} from './convertCirclesToBuffer';
import {
  convertLinesToBuffer,
  LineSource,
} from './convertLinesToBuffer';
import { Color } from '@deck.gl/core/typed';
import {
  convertPolygonsToBuffer,
  PolygonSource,
} from './convertPolygonsToBuffer';
import { createIDtoPoint2DMap } from './createIDtoPoint2DMap';
import { GeoResponseTransferable } from './GeoResponseTransferable';
import { Resources } from '/app/services/database/Resources';

export async function convertMortonNumbersToTransferables(
  uuid: string,
  mortonNumbers: number[][][],
  zoom: number,
): Promise<GeoResponseTransferable> {
  const points: GeoPointEntity[][] = [];
  const routeSegments: GeoRouteSegmentEntity[][] = [];
  const regions: GeoRegionEntity[][] = [];

  const selectedResourceUUIDs = await (await Projects.openProject(uuid)).getLayerPanelState();
  if (! selectedResourceUUIDs){
    throw new Error("NoGadmGeoJsonResourceEntity");
  }

  await Promise.all(selectedResourceUUIDs.gadmGeoJsonUuid.map(async (uuid) => {
    const db = await Resources.openResource(uuid);
    points.push(await db.findAllGeoPoints(mortonNumbers, zoom));
    routeSegments.push(await db.findAllGeoLineStrings(mortonNumbers, zoom));
    regions.push(await db.findAllGeoRegions(mortonNumbers, zoom));
  }));

  const circlesData = points.flat(1).map(
    (p) =>
      ({
        id: p.name,
        centerPosition: [p.lng, p.lat],
        radius: 10,
        strokeWidth: 1,
        strokeColor: [255, 0, 0, 255] as Color,
        fillColor: [255, 0, 0, 15] as Color,
      }) as CircleSource,
  );

  const idToPoint2DMap = createIDtoPoint2DMap(circlesData);

  const flattedLines = routeSegments.flat(1);
  const linesData = flattedLines.map(
    (l) =>
      ({
        sourcePositionIDRef: l.sourceIdRef!,
        targetPositionIDRef: l.targetIdRef!,
        strokeWidth: 1,
        strokeColor: [0, 0, 255, 255] as Color,
      }) as LineSource,
  );

  const circlesBuffer = convertCirclesToBuffer(circlesData);
  const { buffer: linesBuffer, indices: lineIndices } = convertLinesToBuffer(
    linesData,
    idToPoint2DMap,
  );

  const a0 = [20, 40, 60, 20];
  const a1 = [20, 60, 40, 20];
  const a2 = [60, 20, 40, 20];
  const a3 = [60, 40, 20, 20];

  const regionsData: PolygonSource[] = regions.flat(1).map((region) => ({
    strokeWidth: 1,
    strokeColor: [30, 40, 50, 60] as Color,
    fillColor: (region.gid_2
      ? a0
      : region.gid_1
        ? a1
        : region.gid_0
          ? a2
          : a3) as Color,
    coordinates: region.coordinates,
  }));

  const {
    positions,
    polygonIndices,
    pathIndices,
    lineWidths,
    lineColors,
    fillColors,
  } = convertPolygonsToBuffer(regionsData);

  return [
    circlesBuffer,
    linesBuffer,
    lineIndices,
    positions,
    polygonIndices,
    pathIndices,
    lineWidths,
    lineColors,
    fillColors,
  ];
}
