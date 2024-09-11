import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://103.119.54.76:8989', // URL server pihak ketiga
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, 'JPxDataClass'), // Menghapus '/api' dari URL
      },
    },
  },
});
