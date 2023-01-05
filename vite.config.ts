import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // @ts-expect-error - guessing vite react plugin doesnt like node16 mode reso
  plugins: [react()],
  build: {
    outDir: 'build',
    target: 'es2022',
  },
});
