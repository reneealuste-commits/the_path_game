import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import restart from 'vite-plugin-restart'

export default defineConfig({
  root: './',
  publicDir: './public/',
  base: './',
  server: {
    host: true,
    open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env),
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  },
  plugins: [
    vue(),
    restart({ restart: ['public/**'] })
  ]
})
