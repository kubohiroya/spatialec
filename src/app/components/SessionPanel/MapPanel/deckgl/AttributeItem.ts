export type AttributeItem = {
  buffer: Buffer;
  type: number;
  size: number;
  offset: number;
  startIndices?: Uint32Array;
  stride?: number;
};
