import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { reactGrab } from 'react-grab/plugins/vite'
import { defineConfig } from 'vite'
// import removeConsole from 'vite-plugin-remove-console'
import preloadPlugin from 'vite-preload/plugin'

// https://vite.dev/config/
export default defineConfig(() => ({
  base: process.env.VERCEL ? '/' : './',
  plugins: [react(), reactGrab(), preloadPlugin(), tailwindcss()],
  build: {
    target: 'esnext',
    assetsDir: 'assets',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
}))
