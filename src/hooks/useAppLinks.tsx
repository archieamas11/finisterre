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
    let mounted = true

    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      if (!mounted) return

      const url = event.url
      console.log('App opened with URL:', url)

      try {
        // Parse the incoming URL
        const urlObj = new URL(url)
        const pathname = urlObj.pathname
        const search = urlObj.search

        if (pathname) {
          const fullPath = search ? `${pathname}${search}` : pathname
          console.log('Navigating to:', fullPath)
          navigate(fullPath)
        }
      } catch (error) {
        console.error('Failed to parse app URL:', error)
      }
    }).then((listener) => {
      if (!mounted) {
        listener.remove()
      }
    })

    return () => {
      mounted = false
      App.removeAllListeners()
    }
  }, [navigate])
}
