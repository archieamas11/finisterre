import { SearchIcon, X, ArrowRightIcon } from 'lucide-react'
import { useCallback, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { isAndroid } from '@/utils/platform.utils'
import { Searchbar } from 'konsta/react'

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
  const containerRef = useRef<HTMLDivElement>(null)

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
      } else if (e.key === 'Enter' && context.searchQuery.trim()) {
        context.searchLot(context.searchQuery)
      }
    },
    [context],
  )

  const handleClearSearch = useCallback(() => {
    context.clearSearch()
  }, [context])

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {isAndroid() ? (
        // Konsta Searchbar for Android native-like UI
        <form onSubmit={handleSearchSubmit} role="search" aria-label="Lot search">
          <Searchbar
            value={context.searchQuery}
            onInput={(e) => context.setSearchQuery(e.target.value)}
            onClear={handleClearSearch}
            placeholder="Search lot..."
            onDisable={() => context.setSearchQuery('')}
          />
        </form>
      ) : (
        // Default search UI for web and other platforms
        <div className="flex w-full items-center">
          <form onSubmit={handleSearchSubmit} className="flex w-full gap-1" role="search" aria-label="Lot search">
            <div className="relative flex-1">
              <Input
                className="peer dark:bg-background h-9 w-full rounded-full bg-white ps-9 pe-10 text-xs md:h-10 md:text-sm"
                placeholder="Search lot..."
                value={context.searchQuery}
                onChange={(e) => context.setSearchQuery(e.target.value)}
                onKeyDown={handleSearchInputKeyDown}
                disabled={context.isSearching}
                aria-label="Search lot"
              />

              {/* 🔍 Search icon */}
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <SearchIcon size={16} />
              </div>

              {/* ❌ Clear/Submit button */}
              {context.searchQuery.trim() ? (
                <button
                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-10 items-center justify-center rounded-e-full transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Clear search"
                  type="button"
                  onClick={handleClearSearch}
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
        </div>
      )}
    </div>
  )
}
