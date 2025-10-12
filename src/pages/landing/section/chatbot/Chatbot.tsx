import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { SheetClose } from '@/components/ui/sheet'
import ReactMarkdown from 'react-markdown'
import { toast } from 'sonner'
import { GlobeIcon, MessageCirclePlusIcon, TrashIcon, XIcon, ArrowRightIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import Spinner from '@/components/ui/spinner'
import remarkGfm from 'remark-gfm'

const STORAGE_KEY = 'chatbot:messages'
const LAST_ACTIVE_KEY = 'chatbot:lastActive'
const EXPIRY_MS = 60 * 60 * 1000
const INDEX_BUILT_KEY = 'chatbot:indexBuilt'

type Source = { question: string; score: number }

type Message = {
  sender: string
  text: string
  sources?: Source[]
  isTyping?: boolean
}

type Suggestion = { question: string; subtitle?: string }

type HasQuestion = { question?: string }

const normalizeQuestion = (value?: string) => {
  if (!value) return ''
  return value.replace(/\s+/g, ' ').trim().toLowerCase()
}

const dedupeQuestions = <T extends HasQuestion>(items: T[], asked: Set<string>) => {
  const seen = new Set<string>()
  return items.filter((item) => {
    const normalized = normalizeQuestion(item.question)
    if (!normalized) return false
    if (asked.has(normalized)) return false
    if (seen.has(normalized)) return false
    seen.add(normalized)
    return true
  })
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  try {
    // some fetch errors may be plain strings
    return String(err)
  } catch {
    return 'Unknown error'
  }
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  // const API = import.meta.env.VITE_CHATBOT_API_URL as string
  const API = 'https://api.finisterre.site/chatbot.php'
  // const API = 'http://localhost/finisterre_backend/chatbot.php'

  type IndexStatus = 'idle' | 'building' | 'built'
  const [indexStatus, setIndexStatus] = useState<IndexStatus>('idle')

  const updateLastActive = () => {
    try {
      sessionStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()))
    } catch {
      // ignore
    }
  }

  // Hydrate from storage then load initial suggestions
  useEffect(() => {
    // hydrate previous messages from sessionStorage with expiry check
    try {
      const tsRaw = sessionStorage.getItem(LAST_ACTIVE_KEY)
      const ts = tsRaw ? parseInt(tsRaw, 10) : 0
      const expired = ts > 0 && Date.now() - ts > EXPIRY_MS

      if (expired) {
        sessionStorage.removeItem(STORAGE_KEY)
        sessionStorage.removeItem(LAST_ACTIVE_KEY)
        sessionStorage.removeItem(INDEX_BUILT_KEY)
        setMessages([])
      } else {
        const raw = sessionStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw) as Message[]
          if (Array.isArray(parsed)) {
            setMessages(parsed)
            // refresh lastActive on hydrate
            updateLastActive()
          }
        }
      }
    } catch {
      // ignore parse errors
    }

    const load = async () => {
      try {
        const res = await fetch(`${API}?action=suggestions`)
        if (!res.ok) return
        const data = (await res.json()) as { ok: boolean; items: Suggestion[] }
        if (data?.items) setSuggestions(data.items.slice(0, 3))
      } catch {
        // ignore silently; UI will still work
      }
    }
    load()

    // initialize index status from session and trigger auto-build if needed
    try {
      const built = sessionStorage.getItem(INDEX_BUILT_KEY)
      if (built) {
        setIndexStatus('built')
      } else {
        // fire-and-forget build without blocking other interactions
        void buildIndex()
      }
    } catch {
      // ignore storage access errors
    }
  }, [])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages])

  // Persist messages to sessionStorage and refresh lastActive when chat has content
  useEffect(() => {
    try {
      if (messages.length > 0) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
        updateLastActive()
      } else {
        sessionStorage.removeItem(STORAGE_KEY)
        sessionStorage.removeItem(LAST_ACTIVE_KEY)
      }
    } catch {
      // quota or serialization error — ignore
    }
  }, [messages])

  // Background expiry check (every minute)
  useEffect(() => {
    const id = window.setInterval(() => {
      try {
        const tsRaw = sessionStorage.getItem(LAST_ACTIVE_KEY)
        const ts = tsRaw ? parseInt(tsRaw, 10) : 0
        const expired = ts > 0 && Date.now() - ts > EXPIRY_MS
        if (expired) {
          sessionStorage.removeItem(STORAGE_KEY)
          sessionStorage.removeItem(LAST_ACTIVE_KEY)
          setMessages([])
        }
      } catch {
        // ignore
      }
    }, 60000)
    return () => window.clearInterval(id)
  }, [])

  const askedQuestions = useMemo(() => {
    const set = new Set<string>()
    messages.forEach((message) => {
      if (message.sender === 'user') {
        const normalized = normalizeQuestion(message.text)
        if (normalized) set.add(normalized)
      }
    })
    return set
  }, [messages])

  const filteredIntroSuggestions = useMemo(() => dedupeQuestions(suggestions, askedQuestions), [suggestions, askedQuestions])

  const testConnection = async () => {
    try {
      setBusy(true)
      const res = await fetch(`${API}?action=test`)
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`HTTP ${res.status}: ${text}`)
      }
      const data = (await res.json()) as {
        ok: boolean
        ollama_host: string
        gen_model: string
        embed_model: string
      }
      toast.success(`Successfully connected to chatbot API. Models: ${data.gen_model}, ${data.embed_model}`, { duration: 1000 })
    } catch (e) {
      toast.error(`Connection test failed: ${getErrorMessage(e)}`, { duration: 1000 })
    } finally {
      setBusy(false)
    }
  }

  const buildIndex = async () => {
    try {
      setIndexStatus('building')
      const res = await fetch(`${API}?action=index`)
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(`HTTP ${res.status}: ${errData.error || 'Unknown error'}`)
      }
      const data = (await res.json()) as { count: number; embed_model: string }
      toast.success(`Index built: ${data.count} items (model: ${data.embed_model})`, { duration: 1000 })
      try {
        sessionStorage.setItem(INDEX_BUILT_KEY, String(Date.now()))
      } catch {
        // ignore storage errors
      }
      setIndexStatus('built')
    } catch (e) {
      setIndexStatus('idle')
      toast.error(`Index build failed: ${getErrorMessage(e)}`, { duration: 1000 })
    }
  }

  // Accept an optional custom prompt (used by clicking suggested questions)
  const sendMsg = async (customPrompt?: string) => {
    const finalPrompt = (customPrompt ?? input).trim()
    if (!finalPrompt || busy) return

    const userMsg: Message = { sender: 'user', text: finalPrompt }
    setMessages((prev) => [...prev, userMsg])

    // clear input only if user typed it
    if (!customPrompt) setInput('')

    setBusy(true)
    // Add thinking indicator
    setMessages((prev) => [...prev, { sender: 'bot', text: 'Thinking...', isTyping: true }])
    try {
      const res = await fetch(`${API}?action=chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as {
        response?: string
        sources?: Source[]
      }
      const botReply = data.response ?? JSON.stringify(data)
      const botMsg: Message = {
        sender: 'bot',
        text: botReply,
        sources: data.sources,
      }
      // Replace typing message with actual response
      setMessages((prev) => {
        const newMsgs = [...prev]
        const last = newMsgs[newMsgs.length - 1]
        if (last?.isTyping) {
          newMsgs[newMsgs.length - 1] = botMsg
        } else {
          newMsgs.push(botMsg)
        }
        return newMsgs
      })
    } catch (e) {
      const errorMsg: Message = {
        sender: 'system',
        text: `Error: ${getErrorMessage(e)}`,
      }
      // Replace typing message with error
      setMessages((prev) => {
        const newMsgs = [...prev]
        const last = newMsgs[newMsgs.length - 1]
        if (last?.isTyping) {
          newMsgs[newMsgs.length - 1] = errorMsg
        } else {
          newMsgs.push(errorMsg)
        }
        return newMsgs
      })
    } finally {
      setBusy(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    try {
      sessionStorage.removeItem(STORAGE_KEY)
      sessionStorage.removeItem(LAST_ACTIVE_KEY)
    } catch {
      // ignore
    }
    setInput('')
  }

  const clearSessionStorage = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY)
      sessionStorage.removeItem(LAST_ACTIVE_KEY)
      sessionStorage.removeItem(INDEX_BUILT_KEY)
      setMessages([])
    } catch {
      // ignore
    }
  }

  // Intro hero-like content when no messages yet
  const showIntro = messages.length === 0

  return (
    <Card className="h-full overflow-hidden rounded-none border-0">
      {/* Inline styles for typing animation to keep change local */}
      <style>{`
        .typing-dots{display:inline-flex;gap:4px;align-items:center}
        .typing-dots span{width:8px;height:8px;border-radius:50%;background:rgba(0,0,0,0.45);opacity:0.4;display:inline-block}
        .typing-dots span:nth-child(1){animation:dot 1s infinite 0s}
        .typing-dots span:nth-child(2){animation:dot 1s infinite 0.15s}
        .typing-dots span:nth-child(3){animation:dot 1s infinite 0.3s}
        @keyframes dot{0%{transform:translateY(0);opacity:0.4}50%{transform:translateY(-6px);opacity:1}100%{transform:translateY(0);opacity:0.4}}
        /* light/dark neutral color handling */
        .theme-dark .typing-dots span{background:rgba(255,255,255,0.7)}
        /* Hide scrollbar */
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <CardHeader className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <CardTitle className="text-lg">Finisbot</CardTitle>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
          {/* Index status indicator */}
          <div
            className="text-muted-foreground bg-secondary flex items-center gap-2 rounded-md border px-2 py-1 text-xs"
            title={indexStatus === 'building' ? 'Building index' : indexStatus === 'built' ? 'Index ready' : 'Index not built'}
          >
            <span>Index</span>
            {indexStatus === 'building' ? (
              <Spinner className="h-2 w-2" />
            ) : indexStatus === 'built' ? (
              <span className="h-2 w-2 rounded-full bg-green-500" aria-label="Index ready" />
            ) : (
              <span className="h-2 w-2 rounded-full bg-red-600" aria-label="Index not built" />
            )}
          </div>
          <Button onClick={testConnection} disabled={busy} variant="ghost" size="icon">
            <GlobeIcon />
          </Button>
          <Button onClick={clearSessionStorage} disabled={busy} variant="ghost" size="icon">
            <TrashIcon />
          </Button>
          <Button onClick={clearChat} variant="ghost" size="icon" disabled={busy}>
            <MessageCirclePlusIcon />
          </Button>
          <SheetClose asChild>
            <Button variant="ghost" size="icon">
              <XIcon className="size-4" />
            </Button>
          </SheetClose>
        </div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col p-0">
        <div ref={scrollerRef} className="scrollbar-hide flex-1 space-y-3 overflow-y-auto px-3 py-2 sm:px-4 sm:py-3">
          {showIntro && (
            <div className="mx-auto flex max-w-md flex-col items-center py-4 text-center sm:py-8">
              {/* Logo/Avatar placeholder */}
              <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-[var(--brand-primary)]/50 p-3 text-2xl">
                <img src="/favicon-96x96.png" alt="" />
              </div>
              <h2 className="text-xl font-semibold">
                Hello there <span className="inline-block">👋</span>
              </h2>
              <p className="mt-2 text-xl font-bold sm:text-2xl">How can I help you today?</p>
              <div className="mt-6 w-full space-y-3">
                {filteredIntroSuggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMsg(s.question)}
                    disabled={busy}
                    className="flex w-full cursor-pointer items-start gap-3 rounded-xl border p-3 text-left transition-colors sm:p-4"
                  >
                    <div className="bg-muted grid h-10 w-10 place-items-center rounded-lg text-gray-600">💬</div>
                    <div className="flex-1">
                      <div className="font-medium">{s.question}</div>
                      {s.subtitle && <div className="text-muted-foreground mt-1 text-sm">{s.subtitle}</div>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conversation */}
          {messages.map((m, i) => {
            const filteredSources = dedupeQuestions(m.sources ?? [], askedQuestions)
            return (
              <div key={i} className={m.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={
                    m.sender === 'user'
                      ? 'max-w-[85%] rounded-lg bg-[var(--brand-primary)] px-3 py-2 text-white shadow sm:max-w-[80%]'
                      : m.sender === 'bot'
                        ? 'bg-muted max-w-[85%] rounded-lg px-3 py-2 shadow sm:max-w-[80%]'
                        : 'text-muted-foreground max-w-[90%] text-xs'
                  }
                >
                  {m.sender !== 'system' && <div className="mb-1 text-[10px] opacity-70">{m.sender === 'user' ? 'You' : 'Finisbot'}</div>}
                  <div className="leading-relaxed whitespace-pre-wrap">
                    {m.isTyping ? (
                      <div className="typing-dots" aria-live="polite" aria-label="Assistant is typing">
                        <span />
                        <span />
                        <span />
                      </div>
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ ...props }) => (
                            <a {...props} href={props.href} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline" />
                          ),
                        }}
                      >
                        {m.text}
                      </ReactMarkdown>
                    )}
                  </div>
                  {filteredSources.length > 0 && (
                    <div className="mt-5">
                      <div className="text-muted-foreground mb-1 text-[10px] tracking-wide uppercase">Suggested replies</div>
                      <ul className="relative flex w-full flex-wrap gap-2">
                        {filteredSources.map((s, j) => (
                          <li key={j} className="w-full">
                            <button
                              type="button"
                              onClick={() => sendMsg(s.question)}
                              className="bg-secondary min-h-[40px] w-full cursor-pointer rounded-md border px-3 py-2 text-left text-xs break-words whitespace-normal shadow-sm"
                              title={`Relevance score: ${s.score}`}
                              disabled={busy}
                            >
                              {s.question}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
      <CardFooter className="">
        <div className="relative flex w-full flex-col">
          <div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-secondary min-h-15 w-full resize-none rounded-xl border-2 border-[var(--brand-primary)] p-4 pr-16 sm:min-h-30"
              placeholder={busy ? 'Working...' : 'Write your question'}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMsg()
              }}
              disabled={busy}
            />

            <Button
              onClick={() => sendMsg()}
              disabled={busy}
              aria-label="Send"
              className="absolute right-3 bottom-1/7 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-gray-100 p-0 text-gray-700 shadow"
              size="icon"
            >
              <ArrowRightIcon size={16} />
            </Button>
          </div>
          <div className="text-muted-foreground mt-4 text-center text-[11px]">This assistant may produce inaccurate information.</div>
        </div>
      </CardFooter>
    </Card>
  )
}
