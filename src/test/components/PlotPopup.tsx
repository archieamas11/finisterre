import { lazy, Suspense } from 'react'
import { Popup } from 'react-map-gl/maplibre'
import type { PlotFeatureProps } from '../buildGeoJSON'

const SinglePopup = lazy(() => import('./SinglePopup'))
const ColumbariumPopup = lazy(() => import('./ColumbariumPopup'))

type PlotPopupProps = {
  coords: [number, number]
  props: PlotFeatureProps
  onClose: () => void
  onGetDirections?: (destination: [number, number]) => void
}

export function PlotPopup({ coords, props, onClose, onGetDirections }: PlotPopupProps) {
  return (
    <div>
      {props.rows && props.columns ? (
        <Popup closeOnClick={false} longitude={coords[0]} latitude={coords[1]} onClose={onClose} closeButton={false}>
          <Suspense fallback={null}>
            <ColumbariumPopup coords={coords} props={props} onGetDirections={onGetDirections} />
          </Suspense>
        </Popup>
      ) : (
        <Popup closeOnClick={false} longitude={coords[0]} latitude={coords[1]} onClose={onClose} closeButton={false}>
          <Suspense fallback={null}>
            <SinglePopup coords={coords} props={props} onGetDirections={onGetDirections} />
          </Suspense>
        </Popup>
      )}
    </div>
  )
}
