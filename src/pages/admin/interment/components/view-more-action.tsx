import type { Button } from '@/components/ui/button'
import { CgMoreVerticalAlt } from 'react-icons/cg'

import { Button as UIButton } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useIsMobile } from '@/hooks/use-mobile'

interface MoreActionsButtonProps {
  onClick: () => void
  className?: string
  variant?: React.ComponentProps<typeof Button>['variant']
  size?: React.ComponentProps<typeof Button>['size']
  iconClassName?: string
  children?: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function MoreActionsButton({
  onClick,
  className,
  variant = 'outline',
  size = 'sm',
  iconClassName,
  children,
  side = 'bottom',
}: MoreActionsButtonProps) {
  const isMobile = useIsMobile()

  const button = (
    <UIButton onClick={onClick} className={`h-8 w-8 rounded-full ${className || ''}`} variant={variant} size={size}>
      <CgMoreVerticalAlt className={iconClassName} />
      {children}
    </UIButton>
  )

  if (isMobile) {
    return button
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>{button}</div>
      </TooltipTrigger>
      <TooltipContent side={side}>More actions</TooltipContent>
    </Tooltip>
  )
}
