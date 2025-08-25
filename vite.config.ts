import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import viteCompression from 'vite-plugin-compression'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import Inspect from 'vite-plugin-inspect'
import { VitePWA } from 'vite-plugin-pwa'
import removeConsole from 'vite-plugin-remove-console'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    Inspect(),
    ViteImageOptimizer(),
    removeConsole(),
    VitePWA({
      manifest: {
        name: 'Finisterre Gardenz',
        short_name: 'Finisterre',
        icons: [
          { src: '/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
        start_url: '/',
        display: 'standalone',
        theme_color: '#ffffff',
        background_color: '#ffffff',
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
    }),
    checker({
      typescript: true,
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      threshold: 1024,
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
