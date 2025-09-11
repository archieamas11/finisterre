import GetDirectionsButton from '@/test/components/GetDirectionsButton'
import ShareDialog from './ShareDialog'
import type { PlotFeatureProps } from '../buildGeoJSON'

type PlotPopupProps = {
  coords: [number, number]
  props: PlotFeatureProps
  onGetDirections?: (destination: [number, number]) => void
}

export default function SinglePopup({ coords, props, onGetDirections }: PlotPopupProps) {
  return (
    <div className="">
      <div className="mb-4 flex gap-2">
        <GetDirectionsButton onGetDirections={onGetDirections} coords={coords} />
        <ShareDialog coords={coords} location={props.location} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <span className="text-secondary">Location:</span>
        <span className="text-secondary">{props.location}</span>
        <span className="text-secondary">Category:</span>
        <span className="text-secondary">{props.category}</span>
        <span className="text-secondary">Status:</span>
        <span className="text-secondary">{props.plotStatus}</span>
        {props.deceased.dead_fullname && (
          <>
            <span className="text-secondary">Deceased:</span>
            <span className="text-secondary">{props.deceased.dead_fullname}</span>
            {props.deceased.dead_interment && (
              <>
                <span className="text-secondary">Interment:</span>
                <span className="text-secondary">{props.deceased.dead_interment}</span>
              </>
            )}
          </>
        )}
        {props.owner.fullname && (
          <>
            <span className="text-secondary">Owner:</span>
            <span className="text-secondary">{props.owner.fullname}</span>
            {props.owner.email && (
              <>
                <span className="text-secondary">Email:</span>
                <span className="text-secondary">{props.owner.email}</span>
              </>
            )}
            {props.owner.contact && (
              <>
                <span className="text-secondary">Contact:</span>
                <span className="text-secondary">{props.owner.contact}</span>
              </>
            )}
          </>
        )}
        <span className="text-secondary">Dimensions:</span>
        <span className="text-secondary">
          {props.dimensions.length} x {props.dimensions.width} ({props.dimensions.area} sqm)
        </span>
        {props.rows && (
          <>
            <span className="text-secondary">Row:</span>
            <span className="text-secondary">{props.rows}</span>
          </>
        )}
        {props.columns && (
          <>
            <span className="text-secondary">Column:</span>
            <span className="text-secondary">{props.columns}</span>
          </>
        )}
      </div>
    </div>
  )
}
