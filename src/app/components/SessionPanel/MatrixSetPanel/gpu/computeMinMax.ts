interface VisualizationProps {
  data: Float32Array;
  dataSize: {
    width: number;
    height: number;
  };
  displayRegion: {
    rowStart: number;
    rowEnd: number;
    columnStart: number;
    columnEnd: number;
  };
  displaySize: {
    width: number;
    height: number;
  };
  hsvMin: [number, number, number];
  hsvMax: [number, number, number];
}

async function visualizeData({
  device,
  data,
  dataSize,
  displayRegion,
  displaySize,
  hsvMin,
  hsvMax,
}: VisualizationProps & { device: GPUDevice }) {
  const buffer = device.createBuffer({
    size: data.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(buffer, 0, data);

  const minMaxResultBuffer = device.createBuffer({
    size: 2 * Float32Array.BYTES_PER_ELEMENT, // Store min and max
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  const computeShaderCode = `
    @group(0) @binding(0) var<storage, read_write> data : array<f32>;
    @group(0) @binding(1) var<storage, read_write> result : array<f32>;

    @compute @workgroup_size(64)
    fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
      let index = global_id.x;
      if (index >= arrayLength(&data)) {
        return;
      }
      let value = data[index];
      if (value == f32(Infinity)) {  // Ignore positive infinity
        return;
      }
      atomicMin(&result[0], value);
      atomicMax(&result[1], value);
    }
  `;

  const module = device.createShaderModule({ code: computeShaderCode });

  const bindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: 'storage' },
      },
    ],
  });

  const pipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    }),
    compute: {
      module: module,
      entryPoint: 'main',
    },
  });

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: buffer,
        },
      },
      {
        binding: 1,
        resource: {
          buffer: minMaxResultBuffer,
        },
      },
    ],
  });

  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginComputePass();
  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, bindGroup);

  passEncoder.dispatchWorkgroups(
    Math.ceil(dataSize.width / 16),
    Math.ceil(dataSize.height / 16)
  );
  passEncoder.end();

  const commands = commandEncoder.finish();
  device.queue.submit([commands]);

  // バッファーのマッピングを待機
  await minMaxResultBuffer.mapAsync(GPUMapMode.READ);
  // マップされた範囲からデータを読み出す
  const copyArray = new Float32Array(
    minMaxResultBuffer
      .getMappedRange()
      .slice(0, dataSize.width * dataSize.height)
  );
  // マッピングを解除
  minMaxResultBuffer.unmap();

  return copyArray;

  // Read back the results
}
