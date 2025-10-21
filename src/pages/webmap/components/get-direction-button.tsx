import * as React from 'react'
import { FaDirections } from 'react-icons/fa'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useIsMobile } from '@/hooks/use-mobile'

interface GetDirectionButtonProps extends React.ComponentProps<'button'> {
  label?: string
  isLoading?: boolean
  variant?: React.ComponentProps<typeof Button>['variant']
  size?: React.ComponentProps<typeof Button>['size']
  className?: string
}

export function GetDirectionButton({
  label,
  isLoading = false,
  variant = 'secondary',
  size = 'default',
  className,
  disabled,
  children,
  ...props
}: GetDirectionButtonProps) {
  const button = (
    <Button type="button" variant={variant} size={size} aria-busy={isLoading} disabled={disabled || isLoading} className={className} {...props}>
      {isLoading ? <Spinner /> : <FaDirections aria-hidden="true" />}
      {label && <span>{label}</span>}
      {children}
    </Button>
  )

  if (useIsMobile()) {
    return button
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="bottom">Start Navigation</TooltipContent>
    </Tooltip>
  )
}

export default GetDirectionButton
