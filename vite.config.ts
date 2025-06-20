import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import FullReload from 'vite-plugin-full-reload';

export default defineConfig({
  plugins: [
    react(),
    FullReload(['../templates/contact.html']), // adjust path based on your folder structure
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});


