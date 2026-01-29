import { useEffect } from 'react'
import { PencilLineIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAdminContext } from '@/hooks/useNavigationContext'

export default function AdminControls() {
  const { context, onAddMarkerClick, onEditMarkerClick, onMultiEditSelectClick } = useAdminContext()

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
        <Button
          variant="secondary"
          size="sm"
          aria-label="Admin map controls"
          className="bg-background text-background-foreground hover:bg-background/80 shrink-0 rounded-lg text-xs sm:text-sm"
        >
          <PencilLineIcon />
          Modify Markers
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onAddMarkerClick}>{context.isAddingMarker ? 'Cancel Add' : 'Add Marker'}</DropdownMenuItem>
        <DropdownMenuItem onClick={onEditMarkerClick}>{context.isEditingMarker ? 'Cancel Edit' : 'Edit Marker'}</DropdownMenuItem>
        <DropdownMenuItem onClick={onMultiEditSelectClick}>
          {context.isMultiEditSelecting ? 'Cancel Multi Edit' : 'Edit Multiple Markers'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
