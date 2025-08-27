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
      {children ? <span>{children}</span> : <span>Reset View</span>}
    </Button>
  )
}

export default memo(ResetMapViewButton)
