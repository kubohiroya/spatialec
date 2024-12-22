import { PathLayer } from '@deck.gl/layers';

export function createPathLayer(
  linesBuffer: ArrayBuffer,
  startIndices: ArrayBuffer
): PathLayer {
  // const buffer = new Buffer(device, linesBuffer);
  // const positions = new Float64Array(linesBuffer.map((d) => d.path).flat(2));

  const getPath = {
    // buffer,
    // type: GL.FLOAT,
    value: new Float32Array(linesBuffer),
    size: 3,
    offset: 0,
    stride: 24,
  };

  const getWidth = {
    //buffer,
    //type: GL.FLOAT,
    value: new Float32Array(linesBuffer),
    size: 1,
    offset: 16,
    stride: 24,
  };

  const getColor = {
    //buffer,
    //type: GL.UNSIGNED_BYTE,
    value: new Uint8Array(linesBuffer),
    size: 4,
    offset: 20,
    stride: 24,
  };

  return new PathLayer({
    id: 'path-layer',
    positionFormat: `XY`,
    //getColor,
    //getWidth,
    data: {
      length: startIndices.byteLength / 4,
      startIndices: new Uint32Array(startIndices),
      attributes: {
        getPath,
        getWidth,
        getColor,
      },
    },
    pickable: true,
    autoHighlight: true,
    _pathType: 'open',
  });
}
