import type { ConvertedMarker, LotSearchResult } from '@/types/map.types'
import { memo } from 'react'

import CustomClusterManager from '@/components/map/CustomClusterManager'
import CenterSerenityMarkers from '@/pages/webmap/CenterSerenityMarkers'
import ChapelMarkers from '@/pages/webmap/ChapelMarkers'
import ComfortRoomMarker from '@/pages/webmap/ComfortRoomMarkers'
import MainEntranceMarkers from '@/pages/webmap/MainEntranceMarkers'
import ParkingMarkers from '@/pages/webmap/ParkingMarkers'
import PetersRockMarkers from '@/pages/webmap/PeterRock'
import PlaygroundMarkers from '@/pages/webmap/PlaygroundMarkers'
import PlotMarkers from '@/pages/webmap/PlotMarkers'

// Memoize individual marker components for performance
const MemoizedComfortRoomMarker = memo(ComfortRoomMarker)
const MemoizedParkingMarkers = memo(ParkingMarkers)
const MemoizedCenterSerenityMarkers = memo(CenterSerenityMarkers)
const MemoizedMainEntranceMarkers = memo(MainEntranceMarkers)
const MemoizedChapelMarkers = memo(ChapelMarkers)
const MemoizedPlaygroundMarkers = memo(PlaygroundMarkers)
const MemoizedPetersRockMarkers = memo(PetersRockMarkers)
const MemoizedPlotMarkers = memo(PlotMarkers)

/**
 * Props for the MapMarkersLayer component
 */
export interface MapMarkersLayerProps {
  /** Markers grouped by block or category */
  markersByGroup: Record<string, ConvertedMarker[]>
  /** User's owned plot markers */
  userMarkers: ConvertedMarker[]
  /** Handle direction click from markers */
  onDirectionClick: (coordinates: [number, number]) => void
  /** Whether direction loading is in progress */
  isDirectionLoading: boolean
  /** Currently selected groups for filtering */
  selectedGroups: Set<string>
  /** Current cluster view mode */
  clusterViewMode: 'all' | 'selective' | 'user-plots'
  /** Handle click on a cluster marker */
  onClusterClick: (groupKey: string) => void
  /** Current search result */
  searchResult: LotSearchResult | null
  /** Currently highlighted niche */
  highlightedNiche: string | null
}

/**
 * Component for rendering all map markers
 * Includes static POI markers and dynamic plot markers with clustering
 *
 * @example
 * ```tsx
 * <MapContainer>
 *   <MapMarkersLayer
 *     markersByGroup={markersByGroup}
 *     userMarkers={userMarkers}
 *     onDirectionClick={handleDirectionClick}
 *     isDirectionLoading={state.isDirectionLoading}
 *     selectedGroups={state.selectedGroups}
 *     clusterViewMode={state.clusterViewMode}
 *     onClusterClick={handleClusterClick}
 *     searchResult={state.searchResult}
 *     highlightedNiche={state.highlightedNiche}
 *   />
 * </MapContainer>
 * ```
 */
function MapMarkersLayerComponent({
  markersByGroup,
  userMarkers,
  onDirectionClick,
  isDirectionLoading,
  selectedGroups,
  clusterViewMode,
  onClusterClick,
  searchResult,
  highlightedNiche,
}: MapMarkersLayerProps) {
  return (
    <>
      {/* Static POI markers */}
      <MemoizedComfortRoomMarker
        onDirectionClick={onDirectionClick}
        isDirectionLoading={isDirectionLoading}
      />
      <MemoizedParkingMarkers
        onDirectionClick={onDirectionClick}
        isDirectionLoading={isDirectionLoading}
      />
      <MemoizedPlaygroundMarkers
        onDirectionClick={onDirectionClick}
        isDirectionLoading={isDirectionLoading}
      />
      <MemoizedCenterSerenityMarkers
        onDirectionClick={onDirectionClick}
        isDirectionLoading={isDirectionLoading}
      />
      <MemoizedMainEntranceMarkers
        onDirectionClick={onDirectionClick}
        isDirectionLoading={isDirectionLoading}
      />
      <MemoizedChapelMarkers
        onDirectionClick={onDirectionClick}
        isDirectionLoading={isDirectionLoading}
      />
      <MemoizedPetersRockMarkers
        onDirectionClick={onDirectionClick}
        isDirectionLoading={isDirectionLoading}
      />

      {/* Dynamic plot markers with clustering */}
      <CustomClusterManager
        markersByGroup={markersByGroup}
        onDirectionClick={onDirectionClick}
        isDirectionLoading={isDirectionLoading}
        selectedGroups={selectedGroups}
        clusterViewMode={clusterViewMode}
        onClusterClick={onClusterClick}
        PlotMarkersComponent={MemoizedPlotMarkers}
        searchResult={searchResult}
        highlightedNiche={highlightedNiche}
        userMarkers={userMarkers}
      />
    </>
  )
}

export const MapMarkersLayer = memo(MapMarkersLayerComponent)
MapMarkersLayer.displayName = 'MapMarkersLayer'
