import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type SpeakOptions = {
  voiceId?: string
  rate?: number
  pitch?: number
}

const STORAGE_KEY = 'ff_voice_guidance_enabled'

function hasWebSpeechSupport() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
}

async function elevenLabsSynthesize(apiKey: string, voiceId: string, text: string): Promise<Blob> {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`
  // ElevenLabs (as of context) expects xi-api-key and returns audio in the requested Accept type.
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({ text }),
  })

  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`ElevenLabs TTS failed: ${res.status} ${txt}`)
  }
  const arrayBuffer = await res.arrayBuffer()
  return new Blob([arrayBuffer], { type: 'audio/mpeg' })
}

export default function useVoiceGuidance() {
  const apiKey = (import.meta.env.VITE_ELEVENLABS_API_KEY as string) || ''
  const defaultVoiceId = (import.meta.env.VITE_ELEVENLABS_VOICE_ID as string) || ''

  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY)
      return v ? v === '1' : false
    } catch {
      return false
    }
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null)
  const queueRef = useRef<string | null>(null)
  const busyRef = useRef(false)
  const lastSpokenRef = useRef<{ text: string; ts: number } | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, isEnabled ? '1' : '0')
    } catch {
      // ignore localStorage write errors (private mode, quota, etc.)
    }
  }, [isEnabled])

  const stop = useCallback(() => {
    // stop elevenlabs audio element
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }

    // stop speechSynthesis
    if (hasWebSpeechSupport()) {
      window.speechSynthesis.cancel()
      utterRef.current = null
    }
    queueRef.current = null
    busyRef.current = false
  }, [])

  const speak = useCallback(
    async (text: string, options: SpeakOptions = {}) => {
      if (!isEnabled || !text) return
      // Prevent repeating the same text within a short window (2s)
      const now = Date.now()
      if (lastSpokenRef.current && lastSpokenRef.current.text === text && now - lastSpokenRef.current.ts < 2000) {
        return
      }

      // If already speaking/playing - queue latest text (replace previous queued) and return
      if (busyRef.current) {
        queueRef.current = text
        return
      }

      // Mark busy
      busyRef.current = true

      // If ElevenLabs configured, try it first
      if (apiKey && defaultVoiceId) {
        try {
          stop()
          const blob = await elevenLabsSynthesize(apiKey, options.voiceId || defaultVoiceId, text)
          const url = URL.createObjectURL(blob)
          const audio = new Audio(url)
          audioRef.current = audio
          // ensure autoplay is attempted
          await audio.play().catch(() => {})
          audio.onended = () => {
            URL.revokeObjectURL(url)
            audioRef.current = null
            lastSpokenRef.current = { text, ts: Date.now() }
            busyRef.current = false
            // flush queue if any
            const queued = queueRef.current
            queueRef.current = null
            if (queued) void speak(queued, options)
          }
          return
        } catch (err) {
          // fall through to Web Speech fallback
          console.warn('ElevenLabs TTS failed, falling back to Web Speech:', err)
        }
      }

      if (hasWebSpeechSupport()) {
        stop()
        const utter = new SpeechSynthesisUtterance(text)
        utter.rate = options.rate ?? 1
        utter.pitch = options.pitch ?? 1
        utterRef.current = utter
        utter.onend = () => {
          lastSpokenRef.current = { text, ts: Date.now() }
          busyRef.current = false
          const queued = queueRef.current
          queueRef.current = null
          if (queued) void speak(queued, options)
        }
        window.speechSynthesis.speak(utter)
        return
      }

      // last resort: no TTS available
      console.warn('No TTS available in this environment')
    },
    [apiKey, defaultVoiceId, isEnabled, stop],
  )

  const toggle = useCallback(() => setIsEnabled((v) => !v), [])

  const canUseTts = useMemo(() => !!(apiKey && defaultVoiceId) || hasWebSpeechSupport(), [apiKey, defaultVoiceId])

  useEffect(() => {
    // cleanup on unmount
    return () => stop()
  }, [stop])

  return {
    isEnabled,
    toggle,
    speak,
    stop,
    canUseTts,
  }
}
