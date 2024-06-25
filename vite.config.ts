import hash from '@emotion/hash';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

export default defineConfig((config) => ({
  plugins: [react(), vanillaExtractPlugin()],
  build: {
    outDir: 'build',
    target: 'es2022',

    rollupOptions: {
      plugins: [visualizer()],
    },
  },

  css: {
    modules: {
      entryFileNames: `assets/[hash:22].js`,
      chunkFileNames: `assets/[hash:22].js`,
      assetFileNames: `assets/[hash:22].[ext]`,
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
