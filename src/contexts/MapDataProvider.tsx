import type { ConvertedMarker } from '@/types/map.types'
import type { ReactNode } from 'react'
import { useMemo } from 'react'

import { usePlots } from '@/hooks/plots-hooks/plot.hooks'
import { useMarkersOffline } from '@/hooks/useMarkersOffline'
import { convertUserPlotToMarker, useUserOwnedPlots } from '@/hooks/user-hooks/useUserOwnedPlots'
import { groupMarkersByKey } from '@/lib/clusterUtils'
import { convertPlotToMarker } from '@/types/map.types'
import { MapDataContext } from './contexts'

export interface AvailableGroup {
  key: string
  label: string
  count: number
}

interface MapDataContextValue {
  // Plot data
  markers: ConvertedMarker[]
  userMarkers: ConvertedMarker[]
  markersByGroup: Record<string, ConvertedMarker[]>
  availableGroups: AvailableGroup[]

  // Loading states
  isLoading: boolean

  // Metadata
  userOwnedPlotsCount: number
}

export type { MapDataContextValue }

interface MapDataProviderProps {
  children: ReactNode
}

export function MapDataProvider({ children }: MapDataProviderProps) {
  const { isLoading: rqLoading, data: plotsDataRQ } = usePlots()
  const { data: offlinePlots, isLoading: offlineLoading } = useMarkersOffline()
  const { data: userPlotsData } = useUserOwnedPlots()

  const plotsData = offlinePlots && offlinePlots.length > 0 ? offlinePlots : plotsDataRQ
  const isLoading = !plotsData && (rqLoading || offlineLoading)

  const markers = useMemo(() => plotsData?.map(convertPlotToMarker) || [], [plotsData])

  const userMarkers = useMemo(() => {
    if (!userPlotsData?.plots) return []
    return userPlotsData.plots.map(convertUserPlotToMarker).filter((marker): marker is NonNullable<typeof marker> => marker !== null)
  }, [userPlotsData])

  const markersByGroup = useMemo(() => groupMarkersByKey(markers), [markers])

  const availableGroups = useMemo(
    () =>
      Object.entries(markersByGroup)
        .map(([key, groupMarkers]) => {
          const raw = key.startsWith('block:') ? key.split('block:')[1] : key.startsWith('category:') ? key.split('category:')[1] : key
          const label = key.startsWith('category:') ? raw.charAt(0).toUpperCase() + raw.slice(1) : `Block ${raw}`
          return { key, label, count: groupMarkers.length }
        })
        .sort((a, b) => a.label.localeCompare(b.label)),
    [markersByGroup],
  )

  const contextValue = useMemo<MapDataContextValue>(
    () => ({
      markers,
      userMarkers,
      markersByGroup,
      availableGroups,
      isLoading,
      userOwnedPlotsCount: userMarkers.length,
    }),
    [markers, userMarkers, markersByGroup, availableGroups, isLoading],
  )

  return <MapDataContext.Provider value={contextValue}>{children}</MapDataContext.Provider>
}
