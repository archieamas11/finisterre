import { ShareButton } from '@/pages/webmap/components/share-button'
import { ViewCustomerButton } from '@/pages/webmap/components/view-customer-button'
import { MoreActionsButton } from '../../components/view-more-action'

interface PropertyActionsProps {
  coordsLatLng: [number, number] | null
  locationLabel: string
  onViewMap: () => void
  isViewDisabled: boolean
  onOpenProperties: () => void
}

export function PropertyActions({ coordsLatLng, locationLabel, onViewMap, isViewDisabled, onOpenProperties }: PropertyActionsProps) {
  return (
    <div className="flex gap-2">
      <ViewCustomerButton
        className="h-8 w-8 rounded-full"
        title="View Customer"
        size="sm"
        variant="outline"
        onClick={onViewMap}
        disabled={isViewDisabled}
      />
      {coordsLatLng && (
        <ShareButton coords={coordsLatLng} location={locationLabel} side="bottom" className="h-8 w-8 rounded-full" variant="outline" size="sm" />
      )}
      <MoreActionsButton onClick={onOpenProperties} />
    </div>
  )
}
