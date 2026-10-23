import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // API PHP locale (npm run dev:api) pour le dashboard admin
    proxy: {
      '/api': 'http://127.0.0.1:8000',
      '/uploads': 'http://127.0.0.1:8000',
    },
  },
})
