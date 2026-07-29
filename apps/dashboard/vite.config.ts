import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // the backend (apps/backend) doesn't set CORS headers - proxy same-origin
    // in dev instead of adding a wildcard header to a server that shouldn't
    // need to know about the dashboard's origin.
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
