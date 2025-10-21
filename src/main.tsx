import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'

import './index.css'

import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'

import { ThemeProvider } from '@/components/provider/theme-provider.tsx'
import { Toaster } from '@/components/ui/sonner.tsx'
import App from './App.tsx'

if (import.meta.env.DEV) {
  import('react-scan')
    .then(({ scan }) => {
      scan({
        enabled: true,
        log: true,
      })
    })
    .catch(() => {})
}
const queryClient = new QueryClient()
const LazyReactQueryDevtools = React.lazy(() =>
  import('@tanstack/react-query-devtools').then((mod) => ({
    default: mod.ReactQueryDevtools,
  })),
)

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <App />
          <Suspense fallback={null}>
            <LazyReactQueryDevtools initialIsOpen={false} />
          </Suspense>
          <Toaster position="top-right" richColors />
        </NuqsAdapter>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
