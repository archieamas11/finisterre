import type { AdminSearchItem } from '@/types/search.types'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, ArrowRightIcon, Loader2, MapPin, Search, SearchIcon, X } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'

import { adminSearch } from '@/api/admin.api'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface AdminSearchBarProps {
  className?: string
  onSearch?: (lotId: string) => Promise<void> | void
  onSelectResult?: (item: AdminSearchItem) => void
}

// Admin variant of the public SearchToggle.
// Currently performs a simple callback invocation; map focusing logic can be wired later.
export function AdminSearchBar({ className, onSearch, onSelectResult }: AdminSearchBarProps) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [debounced, setDebounced] = useState('')
  const rootRef = useRef<HTMLDivElement | null>(null)

  // debounce input by 250ms
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), 250)
    return () => clearTimeout(id)
  }, [query])

  const { data, isFetching, isError } = useQuery({
    queryKey: ['admin-search', debounced],
    queryFn: async () => {
      const res = await adminSearch(debounced)
      return res
    },
    // allow searching single-char values (useful for numeric lot ids)
    enabled: debounced.length >= 1,
    staleTime: 15_000,
    gcTime: 5 * 60_000,
  })

  const results: AdminSearchItem[] = useMemo(() => (data?.data ?? []) as AdminSearchItem[], [data])
  const backendNoResults = useMemo(() => {
    // backend sometimes returns success: false with a message when nothing found
    if (!data) return false
    if (typeof data?.success === 'boolean' && data.success === false) return true
    // or when success=true but data array is empty
    if (Array.isArray(data?.data) && data.data.length === 0) return true
    return false
  }, [data])

  const backendMessage = useMemo(() => {
    if (!data) return undefined
    if (typeof data?.success === 'boolean' && data.success === false && data.message) return data.message
    return undefined
  }, [data])

  const formatDeceasedNames = (raw?: string | null) => {
    if (!raw) return ''
    const parts = raw
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
    return parts.map((p, i) => `#${i + 1} ${p}`).join(', ')
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const trimmed = query.trim()
      if (!trimmed) return
      try {
        setIsSearching(true)
        await onSearch?.(trimmed)
      } finally {
        setIsSearching(false)
      }
    },
    [query, onSearch],
  )

  const handleClear = useCallback(() => {
    setQuery('')
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setQuery('')
  }, [])

  // Clear the results when clicking outside the component
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current) return
      // if dropdown not active, nothing to do
      if (debounced.length < 1) return
      if (rootRef.current.contains(e.target as Node)) return
      setQuery('')
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [debounced])

  // Allow Escape to close when dropdown is active using react-hotkeys-hook
  useHotkeys(
    'escape',
    (event) => {
      if (debounced.length < 1) return
      event.preventDefault()
      setQuery('')
    },
    { enabled: debounced.length >= 1 },
    [debounced],
  )

  // Add custom scrollbar styles
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 2px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #aaa;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div ref={rootRef} className={cn('relative w-full', className)}>
      <form onSubmit={handleSubmit} className="flex w-full gap-1" role="search" aria-label="Admin lot search">
        <div className="relative flex-1">
          <Input
            className="peer dark:bg-background h-9 w-full rounded-full bg-white ps-9 pe-10 text-xs md:h-10 md:text-sm"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSearching}
            aria-label="Search lot"
            autoComplete="off"
            name="search"
          />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
            <SearchIcon size={16} />
          </div>
          {query.trim() ? (
            <button
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-10 items-center justify-center rounded-e-full transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Clear search"
              type="button"
              onClick={handleClear}
            >
              <X size={16} aria-hidden="true" />
            </button>
          ) : (
            <button
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-10 items-center justify-center rounded-e-full transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Submit search"
              type="submit"
            >
              <ArrowRightIcon size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </form>

      <AnimatePresence>
        {debounced.length >= 1 && (isFetching || results.length > 0 || isError || backendNoResults) && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.995 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.2 }}
            className="bg-floating-card absolute right-0 left-0 z-[1000] mt-1.5 overflow-hidden rounded-xl shadow-xl"
          >
            {isError && (
              <div className="flex items-center gap-3 bg-red-50 p-4">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <span className="text-sm font-medium text-red-800">Failed to search</span>
                  <p className="mt-1 text-xs text-red-600">Please try again later.</p>
                </div>
              </div>
            )}
            {!isError && (
              <div className="custom-scrollbar max-h-80 overflow-auto">
                {isFetching && results.length === 0 && (
                  <div className="flex flex-col items-center justify-center gap-4 py-12">
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-primary)]">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                      </div>
                      <div className="absolute inset-0 animate-ping rounded-full border-2 border-blue-200"></div>
                    </div>
                    <div className="text-center">
                      <span className="text-base font-medium text-gray-700">Searching…</span>
                      <p className="mt-1 text-sm text-gray-500">Please wait while we find results</p>
                    </div>
                  </div>
                )}
                {results.length === 0 && !isFetching && backendNoResults && (
                  <div className="flex flex-col items-center justify-center gap-4 py-12">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <Search className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="text-center">
                      <span className="text-primary text-base font-medium">{backendMessage ?? 'No matches'}</span>
                      <p className="text-primary/50 mt-1 text-sm">Try different search terms</p>
                    </div>
                  </div>
                )}
                {results.length === 0 && !isFetching && !backendNoResults && (
                  <div className="flex flex-col items-center justify-center gap-4 py-12">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <Search className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="text-center">
                      <span className="text-base font-medium text-gray-700">Start typing to search</span>
                      <p className="mt-1 text-sm text-gray-500">Type 2+ characters to see results</p>
                    </div>
                  </div>
                )}
                {results.length > 0 && (
                  // result list
                  <div>
                    <div className="bg-card/90 sticky top-0 z-10 border-b px-4 py-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-primary text-xs font-semibold tracking-wider uppercase">Search Results</h3>
                        <span className="bg-primary/80 text-primary-foreground rounded-full px-2.5 py-1 text-xs shadow-sm">
                          {results.length} items
                        </span>
                      </div>
                    </div>
                    <ul>
                      {results.map((item) => {
                        const deceasedFormatted = formatDeceasedNames(item.deceased_names)
                        const primary = deceasedFormatted || item.customer_fullname || `Lot #${item.lot_id}`
                        const location = `Plot ${item.plot_id}${item.niche_number ? ` • Niche ${item.niche_number}` : ''}`
                        return (
                          <li
                            key={`${item.lot_id}-${item.plot_id}-${item.niche_number ?? 'x'}`}
                            className={cn(
                              'group border-primary/20 flex cursor-pointer items-start gap-3 border-b px-4 py-3.5 transition-all duration-200 last:border-b-0',
                              'hover:bg-primary/5 hover:shadow-sm',
                            )}
                            onClick={() => {
                              onSelectResult?.(item)
                              console.log('Selected search item:', item)
                              setQuery('')
                            }}
                          >
                            <div className="mt-0.5 flex-shrink-0">
                              <div className="bg-primary/20 rounded-lg p-2.5 shadow-sm">
                                <MapPin className="text-primary h-4 w-4" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-secondary truncate text-sm font-medium">{primary}</div>
                              <div className="text-secondary/70 mt-1 flex items-center gap-1 truncate text-xs">
                                <span>{location}</span>
                              </div>
                            </div>
                            <div className="flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminSearchBar
