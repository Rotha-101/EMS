
import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Essential for Electron local loading
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Clean production logs
        drop_debugger: true
      }
    }
  }
});
