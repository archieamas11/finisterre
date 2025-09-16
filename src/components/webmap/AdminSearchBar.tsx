import { useState, useCallback, useEffect, useMemo } from 'react'
import { SearchIcon, X, ArrowRightIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { adminSearch } from '@/api/admin.api'
import type { AdminSearchItem } from '@/types/search.types'

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
    enabled: debounced.length >= 2,
    staleTime: 15_000,
    gcTime: 5 * 60_000,
  })

  const results: AdminSearchItem[] = useMemo(() => (data?.data ?? []) as AdminSearchItem[], [data])

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

      {/* Results dropdown */}
      {debounced.length >= 2 && (isFetching || results.length > 0 || isError) && (
        <div className="bg-background absolute right-0 left-0 z-[1000] mt-1 rounded-lg border shadow-xl">
          {isError && <div className="text-muted-foreground p-3 text-sm">Failed to search. Try again.</div>}
          {!isError && (
            <ul className="max-h-64 overflow-auto py-1">
              {isFetching && results.length === 0 && <li className="text-muted-foreground px-3 py-2 text-sm">Searching…</li>}
              {results.length === 0 && !isFetching && <li className="text-muted-foreground px-3 py-2 text-sm">No matches</li>}
              {results.map((item) => {
                const primary = item.deceased_names || item.customer_fullname || `Lot #${item.lot_id}`
                const location = `Plot ${item.plot_id}${item.niche_number ? ` • Niche ${item.niche_number}` : ''}`
                return (
                  <li
                    key={`${item.lot_id}-${item.plot_id}-${item.niche_number ?? 'x'}`}
                    className={cn('hover:bg-accent hover:text-accent-foreground cursor-pointer px-3 py-2 text-sm')}
                    onClick={() => {
                      onSelectResult?.(item)
                      console.log('Selected search item:', item)
                      setQuery('')
                    }}
                  >
                    <div className="font-medium">{primary}</div>
                    <div className="text-muted-foreground text-xs">{location}</div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminSearchBar
