import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3099,
    proxy: {
      '/api': {
        target: 'https://api.ecg-panel.demo.medcore.kz',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://api.ecg-panel.demo.medcore.kz',
        changeOrigin: true,
      },
    },
  },
})
