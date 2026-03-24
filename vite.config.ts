import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  // Alias para imports limpios (escalabilidad futura)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Optimizaciones de build para produccion
  build: {
    // Umbral para inline de assets: archivos menores a 4kb se convierten en base64
    // Evita requests HTTP extra para iconos y assets pequenos
    assetsInlineLimit: 4096,

    // Separacion de chunks para mejor cache del browser
    // React y Framer Motion cambian poco — el usuario los cachea entre visitas
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
          if (id.includes('framer-motion')) return 'vendor-motion';
          if (id.includes('lucide-react') || id.includes('lenis')) return 'vendor-ui';
        },
      },
    },

    // Reportar cuando un chunk supera 500kb (alerta temprana de bundle bloat)
    chunkSizeWarningLimit: 500,
  },

  // Servidor de desarrollo
  server: {
    port: 5173,
    open: false,
  },
});