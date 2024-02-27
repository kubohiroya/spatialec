import { GeoDatabaseTableTypes } from '/app/models/GeoDatabaseTableType';

export function getCurrentEntityType() {
  if (document.location.hash.startsWith('#/projects')) {
    return GeoDatabaseTableTypes.projects;
  }
  if (document.location.hash.startsWith('#/resources')) {
    return GeoDatabaseTableTypes.resources;
  }
  throw new Error('Unrecognizable Type: ' + document.location.hash);
}