import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const isMock = mode === 'mock' || process.env.VITE_MOCK === '1';
  return {
    plugins: [react()],
    define: isMock
      ? {
          'import.meta.env.VITE_MOCK': JSON.stringify('1'),
        }
      : {},
    resolve: {
      alias: {
        '@content': path.resolve(__dirname, '../content'),
      },
    },
    server: {
      port: 5173,
      allowedHosts: true,
      fs: {
        allow: [path.resolve(__dirname, '..')],
      },
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: 'node',
      globals: true,
    },
  };
});
