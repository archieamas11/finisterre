import type { Button } from '@/components/ui/button'

import { ShareDialog } from '@/pages/webmap/ShareDialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useIsMobile } from '@/hooks/use-mobile'

interface ShareButtonProps {
  coords: [number, number]
  location: string
  className?: string
  variant?: React.ComponentProps<typeof Button>['variant']
  size?: React.ComponentProps<typeof Button>['size']
  iconClassName?: string
  children?: React.ReactNode
}

export function ShareButton({ coords, location, className, variant, size, iconClassName, children }: ShareButtonProps) {
  const ShareButton = (
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

  if (useIsMobile()) {
    return ShareButton
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>{ShareButton}</div>
      </TooltipTrigger>
      <TooltipContent side="right">Share this marker location</TooltipContent>
    </Tooltip>
  )
}
