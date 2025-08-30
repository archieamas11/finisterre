import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { NuqsAdapter } from 'nuqs/adapters/react'
import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { toast } from 'sonner'
import { registerSW } from 'virtual:pwa-register'

import { ThemeProvider } from '@/components/provider/theme-provider.tsx'
import { Toaster } from '@/components/ui/sonner.tsx'

import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient()
const LazyReactQueryDevtools = React.lazy(() =>
  import('@tanstack/react-query-devtools').then((mod) => ({
    default: mod.ReactQueryDevtools,
  })),
)

// Register service worker with auto-update and toast warning
registerSW({
  immediate: true,
  onNeedRefresh() {
    toast.info('New version available! Reloading in 5 seconds...', {
      duration: 5000,
      onAutoClose: () => {
        window.location.reload() // Force reload after toast
      },
    })
  },
  onOfflineReady() {
    toast.success('App is ready for offline use!', { duration: 3000 })
  },
  onRegisterError(error: Error) {
    console.error('Service Worker registration error:', error)
  },
})

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <App />
          <SpeedInsights />
          <Analytics />
          <Suspense fallback={null}>
            <LazyReactQueryDevtools initialIsOpen={false} />
          </Suspense>
          <Toaster position="top-right" richColors />
        </NuqsAdapter>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
