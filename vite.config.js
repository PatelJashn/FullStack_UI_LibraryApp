import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5002',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Vite automatically handles import.meta.env variables
  // No need for manual define configuration
})
