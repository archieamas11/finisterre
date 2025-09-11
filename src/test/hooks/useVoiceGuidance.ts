import { useEffect, useRef, useState } from 'react'

type UseVoiceGuidanceParams = {
  isActive: boolean
  instructions: string[]
}

export function useVoiceGuidance({ isActive, instructions }: UseVoiceGuidanceParams) {
  const [enabled, setEnabled] = useState(true)
  const lastSpokenRef = useRef<string | null>(null)

  useEffect(() => {
    if (!enabled) return
    if (!isActive) {
      lastSpokenRef.current = null
      return
    }
    const first = instructions?.[0]
    if (first && first !== lastSpokenRef.current) {
      // Speak the first instruction when navigation starts/updates
      trySpeak(first)
      lastSpokenRef.current = first
    }
  }, [enabled, isActive, instructions])

  return { enabled, setEnabled }
}

function trySpeak(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 1
  utterance.pitch = 1
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}
