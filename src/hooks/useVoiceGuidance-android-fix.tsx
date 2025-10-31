import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TextToSpeech } from '@capacitor-community/text-to-speech'
import { Capacitor } from '@capacitor/core'

type SpeakOptions = {
  voiceId?: string
  rate?: number
  pitch?: number
}

const STORAGE_KEY = 'ff_voice_guidance_enabled'

// Module-level state to persist across React.StrictMode development double mounts.
let globalLastSpoken: { text: string; ts: number } | null = null
let globalBusy = false
let globalQueued: string | null = null
let globalAudio: HTMLAudioElement | null = null

function hasWebSpeechSupport() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
}

async function elevenLabsSynthesize(apiKey: string, voiceId: string, text: string): Promise<Blob> {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`
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

/**
 * Uses Capacitor native TTS on mobile, falls back to ElevenLabs or Web Speech on web
 */
export default function useVoiceGuidance() {
  const apiKey = (import.meta.env.VITE_ELEVENLABS_API_KEY as string) || ''
  const defaultVoiceId = (import.meta.env.VITE_ELEVENLABS_VOICE_ID as string) || ''
  const isNative = Capacitor.isNativePlatform()

  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY)
      return v ? v === '1' : false
    } catch {
      return false
    }
  })

  const audioRef = useRef<HTMLAudioElement | null>(globalAudio)
  const queueRef = useRef<string | null>(globalQueued)
  const busyRef = useRef<boolean>(globalBusy)
  const lastSpokenRef = useRef<typeof globalLastSpoken>(globalLastSpoken)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, isEnabled ? '1' : '0')
    } catch {
      // ignore localStorage write errors
    }
  }, [isEnabled])

  const stop = useCallback(() => {
    // Stop ElevenLabs audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
      globalAudio = null
    }

    // Stop native TTS
    if (isNative) {
      TextToSpeech.stop().catch(() => {})
    }

    // Stop Web Speech (web only)
    if (!isNative && hasWebSpeechSupport()) {
      window.speechSynthesis.cancel()
    }

    queueRef.current = null
    busyRef.current = false
    globalQueued = null
    globalBusy = false
  }, [isNative])

  const speak = useCallback(
    async (text: string, options: SpeakOptions = {}) => {
      if (!isEnabled || !text) return

      // Prevent repeating same text within 2s
      const now = Date.now()
      if (lastSpokenRef.current && lastSpokenRef.current.text === text && now - lastSpokenRef.current.ts < 2000) {
        return
      }

      // Queue if busy
      if (busyRef.current) {
        queueRef.current = text
        globalQueued = text
        return
      }

      busyRef.current = true
      globalBusy = true

      // NATIVE PLATFORM: Use Capacitor Text-to-Speech plugin (reliable on Android/iOS)
      if (isNative) {
        try {
          await TextToSpeech.speak({
            text,
            lang: 'en-US',
            rate: options.rate ?? 1.0,
            pitch: options.pitch ?? 1.0,
            volume: 1.0,
            category: 'ambient', // iOS audio session category
          })

          const meta = { text, ts: Date.now() }
          lastSpokenRef.current = meta
          globalLastSpoken = meta
          busyRef.current = false
          globalBusy = false

          // Process queue
          const queued = queueRef.current
          queueRef.current = null
          globalQueued = null
          if (queued) void speak(queued, options)
          return
        } catch (err) {
          console.error('Native TTS failed:', err)
          busyRef.current = false
          globalBusy = false
          return
        }
      }

      // WEB PLATFORM: Try ElevenLabs first, then Web Speech API
      if (apiKey && defaultVoiceId) {
        try {
          stop()
          const blob = await elevenLabsSynthesize(apiKey, options.voiceId || defaultVoiceId, text)
          const url = URL.createObjectURL(blob)
          const audio = new Audio(url)
          audioRef.current = audio
          globalAudio = audio

          await audio.play().catch(() => {})

          audio.onended = () => {
            URL.revokeObjectURL(url)
            audioRef.current = null
            globalAudio = null
            const meta = { text, ts: Date.now() }
            lastSpokenRef.current = meta
            globalLastSpoken = meta
            busyRef.current = false
            globalBusy = false

            const queued = queueRef.current
            queueRef.current = null
            globalQueued = null
            if (queued) void speak(queued, options)
          }
          return
        } catch (err) {
          console.warn('ElevenLabs TTS failed, falling back to Web Speech:', err)
        }
      }

      // Fallback: Web Speech API (web only)
      if (hasWebSpeechSupport()) {
        stop()
        const utter = new SpeechSynthesisUtterance(text)
        utter.rate = options.rate ?? 1
        utter.pitch = options.pitch ?? 1
        utter.onend = () => {
          const meta = { text, ts: Date.now() }
          lastSpokenRef.current = meta
          globalLastSpoken = meta
          busyRef.current = false
          globalBusy = false

          const queued = queueRef.current
          queueRef.current = null
          globalQueued = null
          if (queued) void speak(queued, options)
        }
        window.speechSynthesis.speak(utter)
        return
      }

      // No TTS available
      console.warn('No TTS available in this environment')
      busyRef.current = false
      globalBusy = false
    },
    [apiKey, defaultVoiceId, isEnabled, isNative, stop],
  )

  const toggle = useCallback(() => setIsEnabled((v) => !v), [])

  const canUseTts = useMemo(() => {
    if (isNative) return true // Native TTS always available
    return !!(apiKey && defaultVoiceId) || hasWebSpeechSupport()
  }, [apiKey, defaultVoiceId, isNative])

  useEffect(() => {
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
