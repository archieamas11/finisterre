import { Button } from '@/components/ui/button'

interface NavigationControlsProps {
  onResetView: () => void
}

export function NavigationControls({ onResetView }: NavigationControlsProps) {
  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
      <div className="flex gap-2">
        <Button onClick={onResetView} variant="outline" size="sm">
          Reset View
        </Button>
      </div>
    </div>
  )
}
