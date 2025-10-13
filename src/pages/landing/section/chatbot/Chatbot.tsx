import { Button } from '@/components/ui/button'
import { CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { SheetClose } from '@/components/ui/sheet'
import ReactMarkdown from 'react-markdown'
import { toast } from 'sonner'
import { GlobeIcon, MessageCirclePlusIcon, TrashIcon, XIcon, ArrowRightIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import Spinner from '@/components/ui/spinner'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

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
    <div className="flex h-full flex-col overflow-hidden rounded-none border-0 shadow-sm">
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
      <CardHeader className="flex flex-col gap-3 border-b px-4 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <CardTitle className="text-lg font-semibold">Finisbot</CardTitle>
        <div className="flex items-center gap-2">
          {/* Index status indicator */}
          <div
            className="text-muted-foreground flex items-center gap-2 rounded-md px-2 py-1 text-xs"
            title={indexStatus === 'building' ? 'Building index' : indexStatus === 'built' ? 'Index ready' : 'Index not built'}
          >
            {indexStatus === 'building' ? (
              <Spinner className="h-3 w-3" />
            ) : indexStatus === 'built' ? (
              <span className="h-2 w-2 rounded-full bg-green-500" aria-label="Index ready" />
            ) : (
              <span className="h-2 w-2 rounded-full bg-red-600" aria-label="Index not built" />
            )}
          </div>
          {!import.meta.env.PROD && (
            <Button onClick={testConnection} disabled={busy} variant="ghost" size="icon" className="h-8 w-8">
              <GlobeIcon className="h-4 w-4" />
            </Button>
          )}
          <Button onClick={clearSessionStorage} disabled={busy} variant="ghost" size="icon" className="h-8 w-8">
            <TrashIcon className="h-4 w-4" />
          </Button>
          <Button onClick={clearChat} variant="ghost" size="icon" disabled={busy} className="h-8 w-8">
            <MessageCirclePlusIcon className="h-4 w-4" />
          </Button>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <XIcon className="h-4 w-4" />
            </Button>
          </SheetClose>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
        <div ref={scrollerRef} className="scrollbar-hide flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          {showIntro && (
            <div className="mx-auto flex max-w-lg flex-col items-center py-8 text-center sm:py-4">
              {/* Logo/Avatar placeholder */}
              <div className="bg-primary/10 mb-6 flex h-20 w-20 items-center justify-center rounded-full p-3">
                <img src="/favicon-96x96.png" alt="Finisbot" className="h-full w-full object-contain" />
              </div>
              <h2 className="mb-2 text-2xl font-bold">
                Hello there <span className="inline-block">👋</span>
              </h2>
              <p className="text-muted-foreground mb-8 text-xl">How can I help you today?</p>
              <div className="w-full space-y-3">
                {filteredIntroSuggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMsg(s.question)}
                    disabled={busy}
                    className="group border-border bg-card flex w-full cursor-pointer items-start gap-3 rounded-xl border p-4 text-left transition-all hover:shadow-md disabled:opacity-50"
                  >
                    <div className="bg-primary/10 text-primary group-hover:bg-primary/20 flex h-10 w-10 items-center justify-center rounded-lg">
                      <MessageCirclePlusIcon className="h-5 w-5" />
                    </div>
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
          <div className="space-y-4">
            {messages.map((m, i) => {
              const filteredSources = dedupeQuestions(m.sources ?? [], askedQuestions)
              return (
                <div key={i} className={cn('flex', m.sender === 'user' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn('max-w-[85%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[75%]', {
                      'bg-[var(--brand-primary)] text-white': m.sender === 'user',
                      'bg-muted': m.sender === 'bot',
                      'bg-destructive/10 text-destructive border-destructive/20 border': m.sender === 'system',
                    })}
                  >
                    {m.sender !== 'system' && <div className="mb-1 text-xs font-medium opacity-70">{m.sender === 'user' ? 'You' : 'Finisbot'}</div>}
                    <div className="prose prose-sm dark:prose-invert max-w-none break-words">
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
                      <div className="mt-4 space-y-2">
                        <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Suggested replies</div>
                        <div className="flex flex-wrap gap-1">
                          {filteredSources.map((s, j) => (
                            <button
                              key={j}
                              type="button"
                              onClick={() => sendMsg(s.question)}
                              className="bg-background hover:bg-accent w-full cursor-pointer rounded-md border px-3 py-2 text-left text-xs transition-colors disabled:opacity-50"
                              title={`Relevance score: ${s.score}`}
                              disabled={busy}
                            >
                              {s.question}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
      <CardFooter className="shrink-0 border-t p-4 sm:p-6">
        <div className="w-full space-y-2">
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`
              }}
              className="scrollbar-hide max-h-[200px] min-h-[50px] resize-none rounded-lg border py-3 pr-12 leading-relaxed shadow-sm"
              placeholder={busy ? 'Working...' : 'Write your question'}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMsg()
                }
              }}
              disabled={busy}
              rows={1}
              style={{ overflow: 'hidden' }}
            />
            <Button
              onClick={() => sendMsg()}
              disabled={busy || !input.trim()}
              aria-label="Send message"
              size="icon"
              className="absolute right-2 bottom-2 h-8 w-8 rounded-full bg-[var(--brand-primary)] transition-colors hover:bg-[var(--brand-primary)]/90 focus:bg-[var(--brand-primary)] dark:bg-[var(--brand-secondary)]"
            >
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-muted-foreground text-center text-xs">This assistant may produce inaccurate information.</div>
        </div>
      </CardFooter>
    </div>
  )
}
