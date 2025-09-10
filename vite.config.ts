import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import Inspect from 'vite-plugin-inspect'
import removeConsole from 'vite-plugin-remove-console'

// https://vite.dev/config/
export default defineConfig(() => ({
  // Use absolute base on Vercel to avoid relative asset paths breaking on deep links.
  // Keep './' for local/Capacitor builds.
  base: process.env.VERCEL ? '/' : './',
  plugins: [
    react(),
    tailwindcss(),
    Inspect(),
    ViteImageOptimizer(),
    removeConsole(),
    checker({
      typescript: true,
    }),
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
    open: true,
  },
}))
