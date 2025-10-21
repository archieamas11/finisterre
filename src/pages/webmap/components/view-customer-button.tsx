import * as React from 'react'
import { AiFillEye } from 'react-icons/ai'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useIsMobile } from '@/hooks/use-mobile'

interface GetDirectionButtonProps extends React.ComponentProps<'button'> {
  label?: string
  isLoading?: boolean
  variant?: React.ComponentProps<typeof Button>['variant']
  size?: React.ComponentProps<typeof Button>['size']
  className?: string
}

export function ViewCustomerButton({
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
      {<AiFillEye aria-hidden="true" />}
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
      <TooltipContent side="bottom">View Property</TooltipContent>
    </Tooltip>
  )
}

export default ViewCustomerButton
