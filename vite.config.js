import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// In dev, requests to /api are forwarded to the Express server (npm run server). The port comes from .env (PORT, default 5000).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: { port: 5173, open: true, proxy: { '/api': { target: `http://localhost:${env.PORT || 5000}`, changeOrigin: true } } },
  };
});
