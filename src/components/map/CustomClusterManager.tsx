import type { ConvertedMarker } from '@/types/map.types'
import { memo, useCallback, useMemo } from 'react'
import L from 'leaflet'
import { Marker } from 'react-leaflet'

import { getLabelFromGroupKey } from '@/lib/clusterUtils'
import { ucwords } from '@/lib/format'

interface CustomClusterManagerProps {
  markersByGroup: Record<string, ConvertedMarker[]>
  onDirectionClick: (coordinates: [number, number]) => void
  isDirectionLoading: boolean
  selectedGroups: Set<string>
  clusterViewMode: 'all' | 'selective' | 'user-plots'
  onClusterClick: (groupKey: string) => void
  PlotMarkersComponent: React.ComponentType<{
    markers: ConvertedMarker[]
    isDirectionLoading: boolean
    onDirectionClick: (coordinates: [number, number]) => void
    block: string
    highlightedNiche?: string | null
  }>
  searchResult: any | null
  highlightedNiche: string | null
  userMarkers?: ConvertedMarker[]
}

function calculateCentroid(markers: ConvertedMarker[]): [number, number] {
  if (markers.length === 0) return [0, 0]

  const sum = markers.reduce(
    (acc, marker) => ({
      lat: acc.lat + marker.position[0],
      lng: acc.lng + marker.position[1],
    }),
    { lat: 0, lng: 0 },
  )

  return [sum.lat / markers.length, sum.lng / markers.length]
}

interface CustomClusterMarkerProps {
  groupKey: string
  markers: ConvertedMarker[]
  onClusterClick: (groupKey: string) => void
}

const CustomClusterMarker = memo(({ groupKey, markers, onClusterClick }: CustomClusterMarkerProps) => {
  const centroid = useMemo(() => calculateCentroid(markers), [markers])
  const count = markers.length
  const label = useMemo(() => {
    const raw = getLabelFromGroupKey(groupKey)
    return groupKey.startsWith('category:') ? ucwords(String(raw)) : String(raw)
  }, [groupKey])

  const clusterIcon = useMemo(() => {
    return L.divIcon({
      html: `
        <div class="relative flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform">
          <div
            class="border-2 border-white text-white bg-black/70 hover:bg-black/80 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs shadow-lg"
          >
            ${count}
          </div>
          <span class="mt-1 text-xs font-bold text-gray-200 drop-shadow-md">${label}</span>
        </div>
      `,
      className: 'custom-cluster-marker',
      iconSize: [50, 60],
      iconAnchor: [25, 30],
    })
  }, [count, label])

  const handleClick = useCallback(() => {
    onClusterClick(groupKey)
  }, [groupKey, onClusterClick])

  if (centroid[0] === 0 && centroid[1] === 0) return null

  return (
    <Marker
      position={centroid}
      icon={clusterIcon}
      eventHandlers={{
        click: handleClick,
      }}
    />
  )
})

CustomClusterMarker.displayName = 'CustomClusterMarker'
interface SelectiveGroupMarkersProps {
  groupKey: string
  markers: ConvertedMarker[]
  onDirectionClick: (coordinates: [number, number]) => void
  isDirectionLoading: boolean
  highlightedNiche?: string | null
  PlotMarkersComponent: React.ComponentType<{
    markers: ConvertedMarker[]
    isDirectionLoading: boolean
    onDirectionClick: (coordinates: [number, number]) => void
    block: string
    highlightedNiche?: string | null
  }>
}

const SelectiveGroupMarkers = memo(
  ({ groupKey, markers, onDirectionClick, isDirectionLoading, highlightedNiche, PlotMarkersComponent }: SelectiveGroupMarkersProps) => {
    const block = useMemo(() => (groupKey.startsWith('block:') ? groupKey.split('block:')[1] : ''), [groupKey])
    return (
      <PlotMarkersComponent
        markers={markers}
        isDirectionLoading={isDirectionLoading}
        onDirectionClick={onDirectionClick}
        block={block}
        highlightedNiche={highlightedNiche}
      />
    )
  },
)

SelectiveGroupMarkers.displayName = 'SelectiveGroupMarkers'

const CustomClusterManager = memo(
  ({
    markersByGroup,
    onDirectionClick,
    isDirectionLoading,
    selectedGroups,
    clusterViewMode,
    onClusterClick,
    PlotMarkersComponent,
    searchResult,
    highlightedNiche,
    userMarkers,
  }: CustomClusterManagerProps) => {
    const isSearchActive = searchResult?.success && searchResult.data
    const handleClusterClick = useCallback(
      (groupKey: string) => {
        onClusterClick(groupKey)
      },
      [onClusterClick],
    )

    const renderClusters = useMemo(() => {
      if (isSearchActive || clusterViewMode === 'user-plots') {
        return null
      }

      if (clusterViewMode === 'all') {
        return Object.entries(markersByGroup).map(([groupKey, markers]) => (
          <CustomClusterMarker key={`cluster-${groupKey}`} groupKey={groupKey} markers={markers} onClusterClick={handleClusterClick} />
        ))
      } else if (clusterViewMode === 'selective') {
        return Object.entries(markersByGroup)
          .filter(([groupKey]) => !selectedGroups.has(groupKey))
          .map(([groupKey, markers]) => (
            <CustomClusterMarker key={`cluster-${groupKey}`} groupKey={groupKey} markers={markers} onClusterClick={handleClusterClick} />
          ))
      }
      return null
    }, [markersByGroup, clusterViewMode, selectedGroups, handleClusterClick, isSearchActive])

    const renderSelectedGroups = useMemo(() => {
      if (clusterViewMode === 'user-plots' && userMarkers && userMarkers.length > 0) {
        return (
          <SelectiveGroupMarkers
            key="user-plots"
            groupKey="user-plots"
            markers={userMarkers}
            onDirectionClick={onDirectionClick}
            isDirectionLoading={isDirectionLoading}
            highlightedNiche={highlightedNiche}
            PlotMarkersComponent={PlotMarkersComponent}
          />
        )
      }

      if (isSearchActive && searchResult.data) {
        const { plot_id } = searchResult.data
        for (const [groupKey, markers] of Object.entries(markersByGroup)) {
          const matchedMarkers = markers.filter((m) => m.plot_id === plot_id)
          if (matchedMarkers.length > 0) {
            return (
              <SelectiveGroupMarkers
                key={`search-result-${plot_id}`}
                groupKey={groupKey}
                markers={matchedMarkers}
                onDirectionClick={onDirectionClick}
                isDirectionLoading={isDirectionLoading}
                highlightedNiche={highlightedNiche}
                PlotMarkersComponent={PlotMarkersComponent}
              />
            )
          }
        }
        return null
      }

      if (clusterViewMode !== 'selective' || selectedGroups.size === 0) {
        return null
      }

      return Array.from(selectedGroups).map((groupKey) => {
        const markers = markersByGroup[groupKey]
        if (!markers) return null

        return (
          <SelectiveGroupMarkers
            key={`group-${groupKey}`}
            groupKey={groupKey}
            markers={markers}
            onDirectionClick={onDirectionClick}
            isDirectionLoading={isDirectionLoading}
            highlightedNiche={highlightedNiche}
            PlotMarkersComponent={PlotMarkersComponent}
          />
        )
      })
    }, [
      clusterViewMode,
      selectedGroups,
      markersByGroup,
      onDirectionClick,
      isDirectionLoading,
      PlotMarkersComponent,
      isSearchActive,
      searchResult,
      userMarkers,
      highlightedNiche,
    ])

    return (
      <>
        {renderClusters}
        {renderSelectedGroups}
      </>
    )
  },
)

CustomClusterManager.displayName = 'CustomClusterManager'

export default CustomClusterManager
