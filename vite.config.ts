import { defineConfig } from 'vite'
import { cloudflare } from "@cloudflare/vite-plugin"
import path from 'path'

export default defineConfig({
  plugins: [cloudflare()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
})