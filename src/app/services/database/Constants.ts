
export const zoomLevels = 'z0, z1, z2, z3, z4, z5, z6, z7, z8, z9, z10';
export const zoomLevelsExt = 'z0_, z1_, z2_, z3_, z4_, z5_, z6_, z7_, z8_, z9_, z10_';

export const SIMPLIFY_TOLERANCE = 0.05;
export const STORE_AS_GEO_REGIONS = true;
export const STORE_AS_GEO_JSONS = false;
export type Feature = {
  properties: {
    COUNTRY: string;
    NAME_1?: string;
    NAME_2?: string;
    GID_0: string;
    GID_1?: string;
    GID_2?: string;
  };
  geometry: {
    coordinates: number[][][][];
  };
};
