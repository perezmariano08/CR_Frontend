import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      // Redirige todas las solicitudes que comiencen con /api a tu backend
      '/api': {
        target: 'https://api-cr-zeta.vercel.app', // URL de tu backend
        changeOrigin: true, // Cambia el origen de la solicitud al del backend
        rewrite: (path) => path.replace(/^\/api/, ''), // Elimina el prefijo /api
        secure: false, // Si tu backend usa HTTPS con un certificado autofirmado
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
});