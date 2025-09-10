import { FiNavigation } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { X, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type Props = {
  steps: string[]
  navigation: { cancelNavigation: () => void }
}

export function DirectionsList({ steps, navigation }: Props) {
  const [open, setOpen] = useState(true)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') navigation.cancelNavigation()
      if (e.key === 'd' && (e.ctrlKey || e.metaKey)) setOpen((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigation])

  if (steps.length === 0) return null

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Walking directions"
      className="bg-background fixed right-0 bottom-0 left-0 max-w-full rounded-t-xl border p-2 shadow-lg transition-all duration-200 ease-in-out lg:top-4 lg:bottom-auto lg:left-4 lg:w-80 lg:max-w-100 lg:rounded-lg"
      style={{ width: '100%' }}
    >
      <div className="flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <span className="bg-primary/10 text-primary inline-flex h-7 w-7 items-center justify-center rounded-md">
            <FiNavigation className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Navigation</span>
          </span>
          <div className="text-foreground text-sm font-medium">Navigation</div>
          <div className="bg-muted text-muted-foreground ml-2 hidden rounded-md px-2 py-0.5 text-xs sm:inline-block">{steps.length} steps</div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            aria-expanded={open}
            aria-controls="directions-list"
            onClick={() => setOpen((s) => !s)}
            size="sm"
            variant="ghost"
            title={open ? 'Collapse directions (Ctrl/Cmd+D)' : 'Expand directions (Ctrl/Cmd+D)'}
          >
            <ChevronDown className={open ? 'h-4 w-4 rotate-180 transition-transform' : 'h-4 w-4 transition-transform'} />
          </Button>
          <Button
            onClick={() => navigation.cancelNavigation()}
            size="sm"
            variant="ghost"
            aria-label="Cancel navigation"
            title="Cancel navigation (Esc)"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        id="directions-list"
        className={`mt-2 overflow-hidden transition-[max-height,opacity] duration-200 ease-in-out ${open ? 'opacity-100' : 'opacity-0'}`}
        style={{ maxHeight: open ? 320 : 0 }}
      >
        <ol className="text-foreground max-h-80 w-full list-decimal space-y-2 overflow-auto px-4 py-2 text-sm">
          {steps.map((ins, idx) => (
            <li key={idx} className="flex items-start gap-2 whitespace-normal" title={ins.length > 120 ? ins : undefined}>
              <span className="bg-primary text-primary-foreground mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs">
                {idx + 1}
              </span>
              <div className="break-words">
                <div className="text-foreground text-sm">{ins.length > 200 ? ins.slice(0, 200) + '…' : ins}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
