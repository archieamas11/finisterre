import { FaDirections } from 'react-icons/fa'
import { Button } from '@/components/ui/button'

type GetDirectionsButtonProps = {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  onGetDirections?: (coords: [number, number]) => void
  coords: [number, number]
}

export default function GetDirectionsButton({
  variant = 'secondary',
  size = 'icon',
  className = 'rounded-full bg-[var(--brand-primary)]',
  onGetDirections,
  coords,
}: GetDirectionsButtonProps) {
  return (
    <Button variant={variant} size={size} className={className} onClick={() => onGetDirections?.(coords)}>
      <FaDirections />
    </Button>
  )
}
