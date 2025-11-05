import type { URLOpenListenerEvent } from '@capacitor/app'
import { useEffect } from 'react'
import { App } from '@capacitor/app'
import { useNavigate } from 'react-router-dom'

/**
 * Hook to handle incoming Android App Links and deep links
 * Listens for app URL open events and navigates to the appropriate route
 */
export function useAppLinks() {
  const navigate = useNavigate()

  useEffect(() => {
    let listenerHandle: { remove: () => void } | null = null

    // Add listener for app URL open events
    const setupListener = async () => {
      listenerHandle = await App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        const url = event.url
        console.log('App opened with URL:', url)

        try {
          // Parse the incoming URL (e.g., https://www.finisterre.site/map/?from=...&to=...)
          const urlObj = new URL(url)
          const pathname = urlObj.pathname
          const search = urlObj.search

          if (pathname) {
            const fullPath = search ? `${pathname}${search}` : pathname
            console.log('Navigating to:', fullPath)
            // Navigate to the path with query params (e.g., /map/?from=...&to=...)
            navigate(fullPath, { replace: true })
          }
        } catch (error) {
          console.error('Failed to parse app URL:', error)
        }
      })
    }

    setupListener()

    // Cleanup: only remove this specific listener
    return () => {
      if (listenerHandle) {
        listenerHandle.remove()
      }
    }
  }, [navigate])
}
