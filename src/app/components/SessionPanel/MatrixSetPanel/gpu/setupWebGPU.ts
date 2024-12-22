export async function setupWebGPU() {
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter?.requestDevice();
  return { device };
}
