import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'SessionRecorder',
      fileName: (format) => `session-recorder.${format}.js`,
    },
    rollupOptions: {
      // By default Vite bundles everything. 
      // We want to bundle rrweb and fingerprintjs so users don't have to load them separately.
      external: [],
    },
  },
});
