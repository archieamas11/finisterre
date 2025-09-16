import { useState, useCallback } from 'react'
import { SearchIcon, X, ArrowRightIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface AdminSearchBarProps {
  className?: string
  onSearch?: (lotId: string) => Promise<void> | void
}

// Admin variant of the public SearchToggle.
// Currently performs a simple callback invocation; map focusing logic can be wired later.
export function AdminSearchBar({ className, onSearch }: AdminSearchBarProps) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

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

  return (
    <div className={cn('relative w-full', className)}>
      <form onSubmit={handleSubmit} className="flex w-full gap-1" role="search" aria-label="Admin lot search">
        <div className="relative flex-1">
          <Input
            className="peer dark:bg-background h-9 w-full rounded-full bg-white ps-9 pe-10 text-xs md:h-10 md:text-sm"
            placeholder="Search lot..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSearching}
            aria-label="Search lot (admin)"
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
    </div>
  )
}

export default AdminSearchBar
