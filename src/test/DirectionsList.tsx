import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

type Props = {
  steps: string[]
  navigation: { cancelNavigation: () => void }
}

export function DirectionsList({ steps, navigation }: Props) {
  if (steps.length === 0) return null
  return (
    <div style={{ position: 'absolute', top: 56, left: 10, zIndex: 2 }} className="bg-background rounded-md border p-3 shadow">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-foreground text-sm font-medium">Walking directions</div>
        <Button
          onClick={() => {
            console.log('Cancel button clicked')
            navigation.cancelNavigation()
          }}
          size="sm"
          variant="ghost"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ol className="max-h-64 w-72 list-decimal space-y-1 overflow-auto pl-5 text-sm">
        {steps.map((ins, idx) => (
          <li key={idx}>{ins}</li>
        ))}
      </ol>
    </div>
  )
}
