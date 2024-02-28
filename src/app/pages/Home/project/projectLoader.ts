import { ProjectTable } from '/app/services/database/ProjectTable';
import { ProjectTypes } from '/app/models/ProjectType';
import { generateNewName } from '/app/utils/nameUtil';
import { ProjectType } from '@nx/workspace';

const convertTypeStringToType = (typeString: string): ProjectTypes|null => {
  return typeString === ProjectTypes.Racetrack ? ProjectTypes.Racetrack:typeString === ProjectTypes.Graph? ProjectTypes.Graph : typeString === ProjectTypes.RealWorld ? ProjectTypes.RealWorld: null ;
}

const getNewName = async (typeString: string) => {
  return new Promise((resolve, reject) => {
    const type = convertTypeStringToType(typeString);
    if (type === null) return reject('Invalid type');
    ProjectTable.getProjectsByType(type).then((projects) => {
      const delimiter = typeString+' #';
      const names = projects.map((project) => project.name);
      return resolve(generateNewName(
        names,
        delimiter
      ));
    });
  });
};

export const projectLoader = async ({ params }: any) => {
  if (params.uuid === undefined) {
    return {
      uuid: undefined,
      type: params.type,
      name: await getNewName(params.type),
    };
  }
  return ProjectTable.getProject(params.uuid);
};
