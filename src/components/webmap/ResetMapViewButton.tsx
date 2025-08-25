import { FiRefreshCcw } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { memo, useCallback } from 'react'

interface GenericMapContext {
  requestLocate?: () => void
  resetView?: () => void
}

interface ResetMapViewButtonProps {
  context?: GenericMapContext | null
  onReset?: () => void
  className?: string
  size?: 'sm' | 'default' | 'lg' | 'icon'
  children?: React.ReactNode
}

/**
 * 💡 ResetMapViewButton
 * Attempts to reset map view using the following priority:
 * 1. Explicit onReset prop if provided
 * 2. context.resetView if available
 * 3. context.requestLocate as a fallback
 */
export function ResetMapViewButton({ context, onReset, className, size = 'sm', children }: ResetMapViewButtonProps) {
  const handleReset = useCallback(() => {
    // Attempt functions in order of priority
    if (onReset) {
      onReset()
      return
    }
    if (context?.resetView) {
      context.resetView()
      return
    }
    if (context?.requestLocate) {
      context.requestLocate()
    }
  }, [onReset, context])

  return (
    <Button variant="secondary" size={size} aria-label="Reset map view" onClick={handleReset} className={cn('bg-background shrink-0 rounded-full text-xs sm:text-sm', className)}>
      <FiRefreshCcw className="text-accent-foreground h-3 w-3 sm:h-4 sm:w-4" />
      {children ? <span className="hidden lg:inline">{children}</span> : <span className="hidden lg:inline">Reset View</span>}
    </Button>
  )
}

export default memo(ResetMapViewButton)
