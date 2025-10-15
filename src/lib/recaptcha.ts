declare global {
  interface Grecaptcha {
    ready(cb: () => void): void
    execute(siteKey: string, options: { action: string }): Promise<string>
  }
  interface Window {
    grecaptcha?: Grecaptcha
  }
  interface ImportMetaEnv {
    VITE_RECAPTCHA_SITE_KEY?: string
    [key: string]: string | undefined
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

let scriptLoadedPromise: Promise<void> | null = null

function loadRecaptcha(siteKey: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (scriptLoadedPromise) return scriptLoadedPromise

  scriptLoadedPromise = new Promise<void>((resolve, reject) => {
    if (window.grecaptcha?.execute) {
      resolve()
      return
    }

    const existing = document.querySelector<HTMLScriptElement>('script[src^="https://www.google.com/recaptcha/api.js" ]')
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Failed to load reCAPTCHA')))
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA'))
    document.head.appendChild(script)
  })

  return scriptLoadedPromise
}

export async function executeRecaptcha(action: string): Promise<string> {
  // Skip reCAPTCHA in development mode
  if (import.meta.env.DEV) {
    console.log(`[DEV] Skipping reCAPTCHA for action: ${action}`)
    return 'dev-mode-token'
  }

  const siteKey = import.meta.env?.VITE_RECAPTCHA_SITE_KEY
  if (!siteKey) throw new Error('reCAPTCHA site key is not configured')

  await loadRecaptcha(siteKey)

  const grecaptcha = window.grecaptcha
  if (!grecaptcha || !grecaptcha.execute) throw new Error('reCAPTCHA not available')

  await new Promise<void>((res) => grecaptcha.ready(() => res()))
  const token: string = await grecaptcha.execute(siteKey, { action })
  return token
}

export function isRecaptchaConfigured(): boolean {
  if (import.meta.env.DEV) {
    return true
  }
  return Boolean(import.meta.env?.VITE_RECAPTCHA_SITE_KEY)
}
