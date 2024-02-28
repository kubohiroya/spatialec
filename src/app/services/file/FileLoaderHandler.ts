import { Resources } from '/app/services/database/Resources';

export type FileLoaderHandler<T> = {
  check: (headerLine: string) => boolean;
  createEntity: (resource: Resources, line: string) => Promise<T | null>;
  bulkAddEntity: (resource: Resources, entityItemBuffer: T[]) => Promise<void>;
};
