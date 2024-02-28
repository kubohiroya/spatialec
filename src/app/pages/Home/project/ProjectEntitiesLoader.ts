import { ProjectTable } from '/app/services/database/ProjectTable';

export function ProjectEntitiesLoader(request: any) {
  return ProjectTable.getProjects()
}
