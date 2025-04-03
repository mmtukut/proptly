import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: 'FastFind360',
        short_name: 'FastFind',
        theme_color: '#1c5bde',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          // ... your icons configuration
        ]
      }
    })
  ],
  define: {
    'process.env': process.env
  }
}); 