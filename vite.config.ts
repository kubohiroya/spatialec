/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
  root: __dirname,
  cacheDir: './node_modules/.vite/.',
  base: '/spatialec/',

  server: {
    port: 4200,
    host: 'localhost',
    proxy: {
      // ターゲットとなる外部のURL
      '/gadm.org': {
        target: 'https://gadm.org',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/gadm.org/, ''),
      },
      '/geodata.ucdavis.edu': {
        target: 'https://geodata.ucdavis.edu',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/geodata.ucdavis.edu/, ''),
      },
    },
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    react(),
    nxViteTsPaths(),
    AutoImport({
      resolvers: [
        IconsResolver({
          enabledCollections: ['mdi'],
          extension: 'jsx',
        }),
      ],
    }),
    Icons({
      compiler: 'jsx',
      jsx: 'react',
    }),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    outDir: './dist/spatialec',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: [],
    },
  },

  test: {
    globals: true,
    cache: {
      dir: './node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    reporters: ['default'],
    coverage: {
      reportsDirectory: './coverage/spatialec',
      provider: 'v8',
    },
  },
});
