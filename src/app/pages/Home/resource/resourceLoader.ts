import { ResourceTable } from '/app/services/database/ResourceTable';
import { ResourceTypes } from '/app/models/ResourceType';
import { generateNewName } from '/app/utils/nameUtil';
import { ProjectTable } from '/app/services/database/ProjectTable';

const convertTypeStringToType = (typeString: string): ResourceTypes | null => {
  return typeString === ResourceTypes.mapTiles
    ? ResourceTypes.mapTiles
    : typeString === ResourceTypes.gadmGeoJSON
    ? ResourceTypes.gadmGeoJSON
      : typeString === ResourceTypes.idegsmCities
        ? ResourceTypes.idegsmCities
        : typeString === ResourceTypes.idegsmRoutes
          ? ResourceTypes.idegsmRoutes
    : null;
};

const getNewName = async (typeString: string) => {
  return new Promise((resolve, reject) => {
    const type = convertTypeStringToType(typeString);
    if (type === null) return reject('Invalid type');
    ResourceTable.getResourcesByType(type).then((resources) => {
      const delimiter = typeString+' #';
      const names = resources.map((resource) => resource.name);
      return resolve(generateNewName(
        names,
        delimiter
      ));
    });
  });
};

export const resourceLoader = async ({ params }: any) => {
  if (params.uuid === undefined) {
    return {
      uuid: undefined,
      type: params.type,
      name: await getNewName(params.type),
    };
  }

  return ResourceTable.getResource(params.uuid);
};
