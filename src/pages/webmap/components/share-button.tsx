import type { Button } from '@/components/ui/button'

import { ShareDialog } from '@/pages/webmap/ShareDialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

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
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
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
        </div>
      </TooltipTrigger>
      <TooltipContent side="right">Share this marker location</TooltipContent>
    </Tooltip>
  )
}
