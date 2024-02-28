import Dexie from 'dexie';
import { v4 as uuid_v4 } from 'uuid';
import { Projects } from './Projects';
import { ProjectEntity } from '/app/models/ProjectEntity';
import { PROJECT_TABLE_DB_NAME } from '/app/Constants';
import { GeoDatabaseTableTypes } from '/app/models/GeoDatabaseTableType';
import { ProjectTypes } from '/app/models/ProjectType';
import { ResourceTable } from '/app/services/database/ResourceTable';

export class ProjectTable extends Dexie {
  private static singleton: ProjectTable;
  public projects: Dexie.Table<ProjectEntity, number>;

  public constructor() {
    super(PROJECT_TABLE_DB_NAME);
    this.version(3).stores({
      projects: '++id, &uuid, type, name',
    });
    this.projects = this.table(GeoDatabaseTableTypes.projects);
  }

  static getSingleton() {
    if (!ProjectTable.singleton) {
      ProjectTable.singleton = new ProjectTable();
    }
    return ProjectTable.singleton;
  }

  static updateViewportCenter(
    uuid: string,
    viewportCenter: [number, number, number]
  ) {
    ProjectTable.getSingleton().projects.where('uuid').equals(uuid).modify({
      viewportCenter,
    });
  }

  static async getProjects() {
    //return ProjectTable.getSingleton().projects.toArray();
    return ProjectTable.getSingleton()
      .projects.where('type')
      .anyOf([
        ProjectTypes.Racetrack,
        ProjectTypes.Graph,
        ProjectTypes.RealWorld,
      ])
      .toArray();
  }

  static async getProjectsByType(type: ProjectTypes) {
    return ProjectTable.getSingleton()
      .projects.where('type')
      .equals(type)
      .toArray();
  }

  static async getProject(uuid: string) {
    return ProjectTable.getSingleton()
      .projects.where('uuid')
      .equals(uuid)
      .last();
  }

  /*
  static getTableByTableType(type: GeoDatabaseTableType) {
    switch (type) {
      case GeoDatabaseTableTypes.projects:
        return ProjectTable.getSingleton().projects;
      case GeoDatabaseTableTypes.resources:
        return ResourceTable.getSingleton().resources;
      default:
        throw new Error(`Unknown Type: ${type}`);
    }
  }
   */

  static async createProject(
    uuid: string | undefined,
    type: ProjectTypes,
    source: {
      name: string;
      description: string;
      viewportCenter: [number, number, number]; //[zoom, latitude, longitude]
    }
  ) {
    const now = Date.now();
    const _uuid = uuid ?? uuid_v4();
    ProjectTable.getSingleton().projects.add({
      uuid: _uuid,
      type,
      ...source,
      createdAt: now,
      updatedAt: now,
    });
    await Projects.openProject(_uuid);
  }

  static async updateProject(
    uuid: string,
    type: ProjectTypes,
    source: {
      name: string;
      description: string | undefined;
      coordinate?: [number, number];
      zoom?: number;
    }
  ) {
    const draft = await ProjectTable.getSingleton()
      .projects.where('uuid')
      .equals(uuid)
      .last();
    draft &&
    ProjectTable.getSingleton().projects.update(draft, {
      ...source,
      type,
      updatedAt: Date.now(),
    });
  }

  static async deleteProject(
    uuid: string,
  ) {
    const draft = await ProjectTable.getSingleton()
      .projects.where('uuid')
      .equals(uuid)
      .last();
    draft && ProjectTable.getSingleton().projects.delete(draft.id!);
  }
}

