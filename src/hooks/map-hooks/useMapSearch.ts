import type { MapAction, MapState } from '@/contexts/MapContext'
import type { ConvertedMarker, LotSearchResult } from '@/types/map.types'
import { useCallback } from 'react'
import type L from 'leaflet'

import { searchLotById } from '@/api/plots.api'
import { MAP_ZOOM } from '@/constants/map.constants'

import type { UseMapNotificationsReturn } from './useMapNotifications'

/**
 * Options for the useMapSearch hook
 */
export interface UseMapSearchOptions {
  /** The Leaflet map instance */
  mapInstance: L.Map | null
  /** Array of plot markers to search through */
  markers: ConvertedMarker[]
  /** Current map state */
  state: MapState
  /** Dispatch function for map state reducer */
  dispatch: React.Dispatch<MapAction>
  /** Notifications hook for showing search results */
  notifications: UseMapNotificationsReturn
}

/**
 * Return type for the useMapSearch hook
 */
export interface UseMapSearchReturn {
  /** Search for a lot by ID */
  searchLot: (lotId: string) => Promise<void>
  /** Clear the current search */
  clearSearch: () => void
  /** Set the search query text */
  setSearchQuery: (query: string) => void
  /** Set the auto-open popup plot ID */
  setAutoOpenPopupFor: (plotId: string | null) => void
  /** Current search query text */
  searchQuery: string
  /** Current search result */
  searchResult: LotSearchResult | null
  /** Whether a search is in progress */
  isSearching: boolean
  /** Currently highlighted niche (for visual emphasis) */
  highlightedNiche: string | null
  /** Plot ID to auto-open popup for */
  autoOpenPopupFor: string | null
}

/**
 * Parse coordinates string from API format ("lng, lat" or "lng,lat")
 * to Leaflet format [lat, lng]
 */
function parseCoordinates(coordinates: string): [number, number] | null {
  try {
    const [lng, lat] = coordinates.split(',').map((coord: string) => parseFloat(coord.trim()))
    if (!isNaN(lat) && !isNaN(lng)) {
      return [lat, lng]
    }
  } catch {
    console.warn('Failed to parse coordinates:', coordinates)
  }
  return null
}

/**
 * Hook for managing lot search functionality
 * Handles search API calls, result processing, and map centering
 *
 * @example
 * ```tsx
 * const {
 *   searchLot,
 *   clearSearch,
 *   setSearchQuery,
 *   searchResult,
 *   isSearching,
 * } = useMapSearch({
 *   mapInstance,
 *   markers,
 *   state,
 *   dispatch,
 *   notifications,
 * })
 *
 * // Search for a lot
 * await searchLot('LOT-123')
 *
 * // Clear search
 * clearSearch()
 * ```
 */
export function useMapSearch({
  mapInstance,
  markers,
  state,
  dispatch,
  notifications,
}: UseMapSearchOptions): UseMapSearchReturn {
  const { notify, notifyError, notifySuccess } = notifications

  /**
   * Search for a lot by ID
   * Centers map on result and highlights the marker
   */
  const searchLot = useCallback(
    async (lotId: string) => {
      if (!lotId.trim()) {
        notifyError('Please enter a lot ID', 'Search Error')
        return
      }

      dispatch({ type: 'SEARCH_START' })

      try {
        const result = await searchLotById(lotId.trim())
        dispatch({ type: 'SEARCH_SUCCESS', result })

        if (result.success && result.data) {
          const { plot_id, niche_number, coordinates } = result.data

          // Parse coordinates from result
          let plotCoords: [number, number] | null = null
          if (coordinates) {
            plotCoords = parseCoordinates(coordinates)
          }

          // Find matching marker in our markers array
          const matchedMarker = markers.find((m: ConvertedMarker) => m.plot_id === plot_id)

          if (matchedMarker) {
            // Select the group containing this marker
            const groupKey = matchedMarker.block
              ? `block:${matchedMarker.block}`
              : `category:${matchedMarker.category}`
            dispatch({ type: 'SELECT_GROUPS', groups: new Set([groupKey]) })

            // Highlight the niche if present
            if (niche_number) {
              dispatch({ type: 'SET_HIGHLIGHTED_NICHE', niche: niche_number })
            }

            // Set auto-open popup for this plot
            dispatch({ type: 'SET_AUTO_POPUP', plotId: String(plot_id) })

            // Center map on the plot
            const centerCoords = plotCoords || matchedMarker.position
            if (mapInstance && centerCoords) {
              mapInstance.setView(centerCoords, MAP_ZOOM.SEARCH_RESULT, { animate: true })
            }
          }

          // Show success notification
          const subtitle = `${result.data.category} ${result.data.block ? `- Block ${result.data.block}` : '- Chamber'}`
          notify({
            title: 'Lot found',
            subtitle,
            text: `Plot ${result.data.plot_id}`,
            titleRightText: 'now',
          })
          notifySuccess(`Lot found in ${result.data.category} - ${result.data.block ? `Block ${result.data.block}` : 'Chamber'}`)
        } else {
          // Show error notification
          const errorMessage = result.message || 'Lot not found'
          notifyError(errorMessage, 'Search Error')
        }
      } catch (error) {
        console.error('Search error:', error)
        notifyError('Failed to search lot. Please try again.', 'Search Error')
      } finally {
        dispatch({ type: 'SEARCH_END' })
      }
    },
    [markers, mapInstance, dispatch, notify, notifyError, notifySuccess],
  )

  /**
   * Clear the current search and reset related state
   */
  const clearSearch = useCallback(() => {
    dispatch({ type: 'SET_SEARCH_QUERY', query: '' })
    dispatch({ type: 'SEARCH_SUCCESS', result: null })
    dispatch({ type: 'SET_HIGHLIGHTED_NICHE', niche: null })
    dispatch({ type: 'SET_AUTO_POPUP', plotId: null })
    dispatch({ type: 'RESET_GROUPS' })
  }, [dispatch])

  /**
   * Set the search query text
   */
  const setSearchQuery = useCallback(
    (query: string) => {
      dispatch({ type: 'SET_SEARCH_QUERY', query })
    },
    [dispatch],
  )

  /**
   * Set the auto-open popup plot ID
   */
  const setAutoOpenPopupFor = useCallback(
    (plotId: string | null) => {
      dispatch({ type: 'SET_AUTO_POPUP', plotId })
    },
    [dispatch],
  )

  return {
    searchLot,
    clearSearch,
    setSearchQuery,
    setAutoOpenPopupFor,
    searchQuery: state.searchQuery,
    searchResult: state.searchResult,
    isSearching: state.isSearching,
    highlightedNiche: state.highlightedNiche,
    autoOpenPopupFor: state.autoOpenPopupFor,
  }
}
