import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://script.google.com/macros/s/AKfycbzfCB4CQ-vN2jITzDTse2OBNVproL_LSmX3UyIQ0OlW12QnHCu9zBbXUjkmN7gc-P3I/exec',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/attendance/, ''),
      }
    }
  }
})
