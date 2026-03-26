import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'react',
      'react-dom/client',
      'react/jsx-runtime',
      '@babylonjs/core',
      '@babylonjs/loaders',
    ],
  },
  server: {
    fs: {
      strict: false,
    },
  },
})
