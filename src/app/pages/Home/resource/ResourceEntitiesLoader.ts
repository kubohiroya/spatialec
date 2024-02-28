import { ResourceTable } from '/app/services/database/ResourceTable';

export function ResourceEntitiesLoader() {
  return ResourceTable.getResources();
}
