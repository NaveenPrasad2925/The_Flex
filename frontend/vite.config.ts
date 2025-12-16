import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: 'localhost', // Run on localhost
    strictPort: true, // Exit if port 3000 is already in use
    proxy: {
      // Proxy Hostaway API requests to avoid CORS issues
      '/api/hostaway': {
        target: 'https://api.hostaway.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/hostaway/, '/v1'),
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error:', err)
          })
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxying request:', req.method, req.url)
          })
        },
      },
    },
  },
})


