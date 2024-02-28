import { createScatterplotLayer } from '/app/components/SessionPanel/MapPanel/deckgl/createScatterplotLayer';
import { createPathLayer } from '/app/components/SessionPanel/MapPanel/deckgl/createPathLayer';
import { createPolygonsLayer } from '/app/components/SessionPanel/MapPanel/deckgl/createPolygonsLayer';
import { circleBufferElementSize } from '/app/worker/convertCirclesToBuffer';
import { lineBufferDatumElementSize } from '/app/worker/convertLinesToBuffer';

export function createLayers(
  gl: WebGLRenderingContext,
  circlesBuffer: ArrayBuffer,
  linesBuffer: ArrayBuffer,
  lineIndices: ArrayBuffer,
  positions: ArrayBuffer,
  polygonIndices: ArrayBuffer,
  pathIndices: ArrayBuffer,
  lineWidths: ArrayBuffer,
  lineColors: ArrayBuffer,
  fillColors: ArrayBuffer,
) {
  const layers = [];

  const circleLength = circlesBuffer.byteLength / circleBufferElementSize;
  if (circleLength > 0) {
    layers.push(createScatterplotLayer(gl, circlesBuffer, circleLength));
  }

  const lineLength = linesBuffer.byteLength / lineBufferDatumElementSize;
  if (lineLength > 0) {
    layers.push(createPathLayer(gl, linesBuffer, lineIndices));
  }

  const polygonLength = polygonIndices.byteLength / 4;
  if (polygonLength > 0) {
    const polygonLayer = createPolygonsLayer(
      gl,
      positions,
      polygonIndices,
      pathIndices,
      lineWidths,
      lineColors,
      fillColors,
    );
    layers.push(polygonLayer);
  }
  return layers;
}
