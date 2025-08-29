import { useEffect } from 'react'
import { RiMapPinAddLine } from 'react-icons/ri'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useAdminContext } from '@/hooks/useNavigationContext'

interface AdminControlsProps {
  className?: string
}

export default function AdminControls({ className }: AdminControlsProps) {
  const { context, onAddMarkerClick, onEditMarkerClick } = useAdminContext()

  useEffect(() => {
    if (!context?.isAddingMarker) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onAddMarkerClick()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [context?.isAddingMarker, onAddMarkerClick])

  if (!context) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" className={`bg-background shrink-0 rounded-full ${className || ''}`}>
          <RiMapPinAddLine
            className={cn('h-3 w-3 sm:h-4 sm:w-4', {
              'text-primary-foreground': context.isAddingMarker,
              'text-accent-foreground': !context.isAddingMarker,
            })}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onAddMarkerClick}>{context.isAddingMarker ? 'Cancel Add' : 'Add Marker'}</DropdownMenuItem>
        <DropdownMenuItem onClick={onEditMarkerClick}>{context.isEditingMarker ? 'Cancel Edit' : 'Edit Marker'}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
