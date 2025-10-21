import type { Button } from '@/components/ui/button'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useIsMobile } from '@/hooks/use-mobile'
import { ShareDialog } from '@/pages/webmap/ShareDialog'

interface ShareButtonProps {
  coords: [number, number]
  location: string
  className?: string
  variant?: React.ComponentProps<typeof Button>['variant']
  size?: React.ComponentProps<typeof Button>['size']
  iconClassName?: string
  children?: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function ShareButton({ coords, location, className, variant, size, iconClassName, children, side = 'right' }: ShareButtonProps) {
  const isMobile = useIsMobile()

  const shareDialog = (
    <ShareDialog
      coords={coords}
      location={location}
      triggerClassName={className}
      triggerVariant={variant}
      triggerSize={size}
      iconClassName={iconClassName}
    >
      {children}
    </ShareDialog>
  )

  if (isMobile) {
    return shareDialog
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>{shareDialog}</div>
      </TooltipTrigger>
      <TooltipContent side={side}>Share this marker location</TooltipContent>
    </Tooltip>
  )
}
