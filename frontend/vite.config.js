import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Ensure deep-link refresh works with BrowserRouter (history API).
  // Without SPA fallback, refreshing routes like /user can return 404.
  appType: 'spa',
  plugins: [react()],
  server: {
    host: true,   // 👈 allows access from other devices
    port: 5173    // optional
  }
})
