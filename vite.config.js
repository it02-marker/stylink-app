import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// For GitHub Pages on a project repository (username.github.io/stylink-app/)
// or custom domain / Vercel:
// Base path is set to the repo name for GitHub Pages.
export default defineConfig({
  base: '/stylink-app/',
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
});
