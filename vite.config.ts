import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import Inspect from 'vite-plugin-inspect'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    Inspect(),
    ViteImageOptimizer(),
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
  esbuild: {
    drop: ['console', 'debugger'],
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
})
