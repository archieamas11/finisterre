import { FiRefreshCcw } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { memo, useCallback } from 'react'
import { isAndroid } from '@/utils/platform.utils'
import { Fab } from 'konsta/react'

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
  const FiRefreshCcwIcon = <FiRefreshCcw className="h-6 w-6" />
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
    <>
      {isAndroid() ? (
        <button className="bg-transparent" onClick={handleReset}>
          <Fab className="k-color-brand-green h-10" icon={FiRefreshCcwIcon} />
        </button>
      ) : (
        <Button
          variant="secondary"
          size={size}
          aria-label="Reset map view"
          onClick={handleReset}
          className={cn('bg-background text-background-foreground hover:bg-background/80shrink-0 rounded-full text-xs sm:text-sm', className)}
        >
          <FiRefreshCcw className="text-accent-foreground h-3 w-3 sm:h-4 sm:w-4" />
          {children ? <span>{children}</span> : <span>Reset View</span>}
        </Button>
      )}
    </>
  )
}

export default memo(ResetMapViewButton)
