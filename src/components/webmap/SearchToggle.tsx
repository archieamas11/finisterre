import { SearchIcon, X, ArrowRightIcon } from 'lucide-react'
import { useState, useCallback, useEffect, useRef } from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface WebMapContext {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchLot: (lotId: string) => Promise<void>
  clearSearch: () => void
  isSearching: boolean
}

interface SearchToggleProps {
  context: WebMapContext
  className?: string
}

export default function SearchToggle({ context, className }: SearchToggleProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // 🎯 Handle focus events to manage auto-close on unfocus only
  useEffect(() => {
    const container = containerRef.current
    if (!container || !isExpanded) return

    const handleFocusOut = (e: FocusEvent) => {
      // ⚡️ Only close if focus is leaving our component entirely
      if (!container.contains(e.relatedTarget as Node)) {
        setIsExpanded(false)
        context.setSearchQuery('')
      }
    }

    container.addEventListener('focusout', handleFocusOut)

    return () => {
      container.removeEventListener('focusout', handleFocusOut)
    }
  }, [isExpanded, context]) // 🔍 Search functions
  const handleSearchSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (context.searchQuery.trim()) {
        await context.searchLot(context.searchQuery)
      }
    },
    [context],
  )

  const handleSearchInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        context.setSearchQuery('')
        setIsExpanded(false)
      }
    },
    [context],
  )

  const handleClearSearch = useCallback(() => {
    context.clearSearch()
    setIsExpanded(false)
  }, [context])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="flex items-center">
        <form onSubmit={handleSearchSubmit} className="flex w-full gap-1">
          <div className="relative flex-1">
            <Input
              className="peer dark:bg-background h-8 w-full rounded-full bg-white ps-9 pe-9 text-xs"
              placeholder="Search lot..."
              value={context.searchQuery}
              onChange={(e) => context.setSearchQuery(e.target.value)}
              onKeyDown={handleSearchInputKeyDown}
              autoFocus
              disabled={context.isSearching}
            />

            {/* 🔍 Search icon */}
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>

            {/* ❌ Clear/Submit button */}
            {context.searchQuery.trim() ? (
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear search"
                type="button"
                onClick={handleClearSearch}
              >
                <X size={16} aria-hidden="true" />
              </button>
            ) : (
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Submit search"
                type="submit"
              >
                <ArrowRightIcon size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
