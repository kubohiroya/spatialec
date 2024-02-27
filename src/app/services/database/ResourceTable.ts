import Dexie from 'dexie';
import { ResourceEntity } from '/app/models/ResourceEntity';
import { RESOURCE_TABLE_DB_NAME } from '/app/Constants';
import { ResourceTypes } from '/app/models/ResourceType';
import { ResourceItem } from '/app/models/ResourceItem';
import { v4 as uuid_v4 } from 'uuid';
import { GeoDatabaseTableTypes } from '/app/models/GeoDatabaseTableType';

export class ResourceTable extends Dexie {
  private static singleton: ResourceTable;
  public resources: Dexie.Table<ResourceEntity, number>;

  public constructor() {
    super(RESOURCE_TABLE_DB_NAME);
    this.version(3).stores({
      resources: '++id, &uuid, type, name'
    });
    this.resources = this.table(GeoDatabaseTableTypes.resources);
  }

  static getSingleton() {
    if (!ResourceTable.singleton) {
      ResourceTable.singleton = new ResourceTable();
    }
    return ResourceTable.singleton;
  }

  static async getResources() {
    return ResourceTable.getSingleton().resources.toArray();
  }

  static async getResourcesByType(type: ResourceTypes) {
    return ResourceTable.getSingleton()
      .resources.where('type')
      .equals(type)
      .toArray();
  }

  static async getResource(uuid: string) {
    return ResourceTable.getSingleton()
      .resources.where('uuid')
      .equals(uuid)
      .last();
  }

  static createGADMGeoJsonResourceEntity(source: {
    uuid: string;
    name: string;
    description: string;
    items: ResourceItem[];
  }) {
    return this.createResource(source.uuid,  ResourceTypes.gadmGeoJSON, source);
  }


  static async createResource(uuid: string|undefined,  type: ResourceTypes, source: {
    name: string;
    description: string;
    apikey?: string;
    mapName?: string;
    items?: ResourceItem[];
  }) {
    const resources = ResourceTable.getSingleton();
    const now = Date.now();
    resources.resources.add({
      uuid: uuid ?? uuid_v4(),
      type,
      ...source,
      createdAt: now,
      updatedAt: now
    });
  }

  static async updateResource(
    uuid: string,
    type: ResourceTypes,
    source: {
    name: string;
    description: string;
    apikey?: string;
    mapName?: string;
    items?: ResourceItem[];
  }) {
    const resources = ResourceTable.getSingleton();
    const draft = await resources.resources.where('uuid').equals(uuid).last();
    draft && resources.resources.update(draft,{
      ...source,
      type,
      updatedAt: Date.now()
    });
  }

  static async deleteResource(
    uuid: string,
  ) {
    const draft = await ResourceTable.getSingleton()
      .resources.where('uuid')
      .equals(uuid)
      .last();
    draft && ResourceTable.getSingleton().resources.delete(draft.id!);
  }
}