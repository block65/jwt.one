import { createHash } from 'node:crypto';
import hash from '@emotion/hash';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

const buildId = crypto.randomUUID();

export default defineConfig((config) => ({
  plugins: [react(), vanillaExtractPlugin()],
  build: {
    outDir: 'build',
    target: 'es2022',

    rollupOptions: {
      output: {
        manualChunks(id) {
          // experimenting with manual chunks and hashing
          // keen to see the impact of this in the field
          return createHash('sha256').update(id).digest('base64url');
        },
      },
      plugins: [visualizer()],
    },
  },

  css: {
    modules: {
      entryFileNames: `assets/${buildId}/[hash:22].js`,
      chunkFileNames: `assets/${buildId}/[hash:22].js`,
      assetFileNames: `assets/${buildId}/[hash:22].[ext]`,
      generateScopedName(...args) {
        const [name, filename /* , css */] = args;
        const className = `_${hash(args.join('_'))}`;
        const [, file] = filename.match(/.*\/(.*?)\./) || ['unknown'];
        return config.mode === 'development'
          ? [file, name, className].join('_')
          : className;
      },
    },
  },
}));
