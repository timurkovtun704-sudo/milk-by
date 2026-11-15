import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host:true,
    port: 5173,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Замените 3000 на порт вашего backend-node, если он другой
        changeOrigin: true,
      },
    },
  },
})

