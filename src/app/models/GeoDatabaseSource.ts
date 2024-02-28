import { ResourceTypes } from './ResourceType';
import { ProjectTypes } from '/app/models/ProjectType';

export interface GeoDatabaseSource {
  type: ProjectTypes | ResourceTypes;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
}
