import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: '/banner-creator-pro/',
    plugins: [react()],
    define: {
      'process.env': {
        API_KEY: JSON.stringify(env.GEMINI_API_KEY),
        GEMINI_API_KEY: JSON.stringify(env.GEMINI_API_KEY)
      }
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src')
        }
      ]
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      emptyOutDir: true,
      chunkSizeWarningLimit: 1600,
    },
    server: {
      port: 5173,
      strictPort: true,
      open: true
    },
    preview: {
      port: 4173,
      strictPort: true
    }
  };
});
