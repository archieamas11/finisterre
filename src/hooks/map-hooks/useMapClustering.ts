import type { MapAction, MapState, AvailableGroup } from '@/contexts/MapContext'
import type { ConvertedMarker } from '@/types/map.types'
import { useCallback, useMemo } from 'react'

import { groupMarkersByKey } from '@/lib/clusterUtils'

/**
 * Options for the useMapClustering hook
 */
export interface UseMapClusteringOptions {
  /** Array of plot markers to cluster */
  markers: ConvertedMarker[]
  /** Current map state */
  state: MapState
  /** Dispatch function for map state reducer */
  dispatch: React.Dispatch<MapAction>
}

/**
 * Return type for the useMapClustering hook
 */
export interface UseMapClusteringReturn {
  /** Markers grouped by block or category */
  markersByGroup: Record<string, ConvertedMarker[]>
  /** Available groups for filter UI */
  availableGroups: AvailableGroup[]
  /** Current view mode */
  clusterViewMode: 'all' | 'selective' | 'user-plots'
  /** Currently selected groups */
  selectedGroups: Set<string>
  /** Toggle a single group selection */
  toggleGroupSelection: (groupKey: string) => void
  /** Reset all group selections */
  resetGroupSelection: () => void
  /** Handle click on a cluster marker */
  handleClusterClick: (groupKey: string) => void
  /** Switch to user plots only view */
  showUserPlotsOnly: () => void
}

/**
 * Hook for managing marker clustering and group filtering
 * Handles grouping markers by block/category and filter state
 *
 * @example
 * ```tsx
 * const {
 *   markersByGroup,
 *   availableGroups,
 *   toggleGroupSelection,
 *   resetGroupSelection,
 *   handleClusterClick,
 *   showUserPlotsOnly,
 *   clusterViewMode,
 *   selectedGroups,
 * } = useMapClustering({
 *   markers,
 *   state,
 *   dispatch,
 * })
 *
 * // Toggle a group filter
 * toggleGroupSelection('block:A')
 *
 * // Click on cluster to expand
 * handleClusterClick('block:A')
 *
 * // Show only user's plots
 * showUserPlotsOnly()
 * ```
 */
export function useMapClustering({
  markers,
  state,
  dispatch,
}: UseMapClusteringOptions): UseMapClusteringReturn {
  /**
   * Group markers by block or category
   */
  const markersByGroup = useMemo(
    () => groupMarkersByKey(markers),
    [markers],
  )

  /**
   * Compute available groups for filter UI
   * Sorted alphabetically by label
   */
  const availableGroups = useMemo<AvailableGroup[]>(() => {
    return Object.entries(markersByGroup)
      .map(([key, groupMarkers]) => {
        const raw = key.startsWith('block:')
          ? key.split('block:')[1]
          : key.startsWith('category:')
            ? key.split('category:')[1]
            : key

        const label = key.startsWith('category:')
          ? raw.charAt(0).toUpperCase() + raw.slice(1)
          : `Block ${raw}`

        return {
          key,
          label,
          count: groupMarkers.length,
        }
      })
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [markersByGroup])

  /**
   * Toggle a single group selection
   */
  const toggleGroupSelection = useCallback(
    (groupKey: string) => {
      dispatch({ type: 'TOGGLE_GROUP', group: groupKey })
    },
    [dispatch],
  )

  /**
   * Reset all group selections to show all markers
   */
  const resetGroupSelection = useCallback(() => {
    dispatch({ type: 'RESET_GROUPS' })
  }, [dispatch])

  /**
   * Handle click on a cluster marker
   * Expands the cluster to show its markers
   */
  const handleClusterClick = useCallback(
    (groupKey: string) => {
      dispatch({ type: 'SELECT_GROUPS', groups: new Set([groupKey]) })
    },
    [dispatch],
  )

  /**
   * Switch to user plots only view
   */
  const showUserPlotsOnly = useCallback(() => {
    dispatch({ type: 'SHOW_USER_PLOTS' })
  }, [dispatch])

  return {
    markersByGroup,
    availableGroups,
    clusterViewMode: state.clusterViewMode,
    selectedGroups: state.selectedGroups,
    toggleGroupSelection,
    resetGroupSelection,
    handleClusterClick,
    showUserPlotsOnly,
  }
}
