import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Relative base so the built app works when served from any subpath,
  // e.g. https://<user>.github.io/<repo-name>/ on GitHub Pages, without
  // needing to hardcode the repo name here.
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
