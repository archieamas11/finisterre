import { useCallback } from 'react'
import { Clipboard } from '@capacitor/clipboard'
import { Capacitor } from '@capacitor/core'
import { toast } from 'sonner'

export function useCopyToClipboard() {
  const copy = useCallback(async (text: string) => {
    try {
      if (Capacitor.isNativePlatform()) {
        await Clipboard.write({ string: text })
      } else {
        await navigator.clipboard.writeText(text)
      }
      toast.success('Copied!', {
        description: 'The link is copied to your clipboard.',
      })
    } catch (error) {
      console.error('Copy failed:', error)
      toast.error('Failed to copy', {
        description: 'Something went wrong.',
      })
    }
  }, [])

  return { copy }
}
