import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import removeConsole from 'vite-plugin-remove-console'

// https://vite.dev/config/
export default defineConfig(() => ({
  base: process.env.VERCEL ? '/' : './',
  plugins: [
    react(),
    tailwindcss(),
    ViteImageOptimizer(),
    removeConsole(),
    AutoImport({
      imports: [
        'react',
        'react-router-dom',
        {
          'react-use': ['useLocalStorage', 'useMedia'],
        },
      ],
      dts: 'src/auto-imports.d.ts',
    }),
  ],
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
