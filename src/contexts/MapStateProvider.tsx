import type { ConvertedMarker, LotSearchResult } from '@/types/map.types'
import type { ReactNode } from 'react'
import { useCallback, useMemo, useReducer } from 'react'
import { toast } from 'sonner'

import { searchLotById } from '@/api/plots.api'
import { isNativePlatform } from '@/utils/platform.utils'
import { MapStateContext } from './contexts'
import { useMapData } from './hooks'

// ==== Map State Management Types ====
export interface MapState {
  isNavigationInstructionsOpen: boolean
  isDirectionLoading: boolean
  // Cluster
  selectedGroups: Set<string>
  clusterViewMode: 'all' | 'selective' | 'user-plots'
  // Search
  searchQuery: string
  searchResult: LotSearchResult | null
  isSearching: boolean
  highlightedNiche: string | null
  // Auto popup
  autoOpenPopupFor: string | null
  // Tile layer
  selectedTileLayer: string
}

export type MapAction =
  | { type: 'SET_NAV_OPEN'; value: boolean }
  | { type: 'SET_DIRECTION_LOADING'; value: boolean }
  | { type: 'SELECT_GROUPS'; groups: Set<string> }
  | { type: 'TOGGLE_GROUP'; group: string }
  | { type: 'RESET_GROUPS' }
  | { type: 'SHOW_USER_PLOTS' }
  | { type: 'SET_SEARCH_QUERY'; query: string }
  | { type: 'SEARCH_START' }
  | { type: 'SEARCH_SUCCESS'; result: LotSearchResult | null }
  | { type: 'SEARCH_END' }
  | { type: 'SET_HIGHLIGHTED_NICHE'; niche: string | null }
  | { type: 'SET_AUTO_POPUP'; plotId: string | null }
  | { type: 'RESET_VIEW' }
  | { type: 'SET_TILE_LAYER'; layer: string }

interface MapStateContextValue {
  state: MapState
  dispatch: React.Dispatch<MapAction>

  // Convenience methods
  toggleGroupSelection: (groupKey: string) => void
  resetGroupSelection: () => void
  handleClusterClick: (groupKey: string) => void
  setSearchQuery: (query: string) => void
  searchLot: (lotId: string, onSuccess?: (data: LotSearchResult['data']) => void, onError?: (message: string) => void) => Promise<void>
  clearSearch: () => void
  setAutoOpenPopupFor: (plotId: string | null) => void
  showUserPlotsOnly: () => void
  resetView: () => void
  setSelectedTileLayer: (layer: string) => void
}

const initialMapState: MapState = {
  isNavigationInstructionsOpen: false,
  isDirectionLoading: false,
  selectedGroups: new Set(),
  clusterViewMode: 'all',
  searchQuery: '',
  searchResult: null,
  isSearching: false,
  highlightedNiche: null,
  autoOpenPopupFor: null,
  selectedTileLayer: 'arcgis',
}

function mapReducer(state: MapState, action: MapAction): MapState {
  switch (action.type) {
    case 'SET_NAV_OPEN':
      return { ...state, isNavigationInstructionsOpen: action.value }
    case 'SET_DIRECTION_LOADING':
      return { ...state, isDirectionLoading: action.value }
    case 'SELECT_GROUPS':
      return { ...state, selectedGroups: action.groups, clusterViewMode: action.groups.size > 0 ? 'selective' : 'all' }
    case 'TOGGLE_GROUP': {
      const newSet = new Set(state.selectedGroups)
      if (newSet.has(action.group)) newSet.delete(action.group)
      else newSet.add(action.group)
      return { ...state, selectedGroups: newSet, clusterViewMode: newSet.size > 0 ? 'selective' : 'all' }
    }
    case 'RESET_GROUPS':
      return { ...state, selectedGroups: new Set(), clusterViewMode: 'all' }
    case 'SHOW_USER_PLOTS':
      return {
        ...state,
        selectedGroups: new Set(),
        clusterViewMode: 'user-plots',
        searchQuery: '',
        searchResult: null,
        highlightedNiche: null,
      }
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.query }
    case 'SEARCH_START':
      return { ...state, isSearching: true, searchResult: null, highlightedNiche: null }
    case 'SEARCH_SUCCESS':
      return { ...state, searchResult: action.result }
    case 'SEARCH_END':
      return { ...state, isSearching: false }
    case 'SET_HIGHLIGHTED_NICHE':
      return { ...state, highlightedNiche: action.niche }
    case 'SET_AUTO_POPUP':
      return { ...state, autoOpenPopupFor: action.plotId }
    case 'SET_TILE_LAYER':
      return { ...state, selectedTileLayer: action.layer }
    case 'RESET_VIEW':
      return {
        ...state,
        selectedGroups: new Set(),
        clusterViewMode: 'all',
        searchQuery: '',
        searchResult: null,
        highlightedNiche: null,
        autoOpenPopupFor: null,
      }
    default:
      return state
  }
}

interface MapStateProviderProps {
  children: ReactNode
  onResetView?: () => void
}

export function MapStateProvider({ children, onResetView }: MapStateProviderProps) {
  const [state, dispatch] = useReducer(mapReducer, initialMapState)
  const { markers } = useMapData()

  const toggleGroupSelection = useCallback((groupKey: string) => dispatch({ type: 'TOGGLE_GROUP', group: groupKey }), [])
  const resetGroupSelection = useCallback(() => dispatch({ type: 'RESET_GROUPS' }), [])
  const handleClusterClick = useCallback((groupKey: string) => dispatch({ type: 'SELECT_GROUPS', groups: new Set([groupKey]) }), [])
  const showUserPlotsOnly = useCallback(() => dispatch({ type: 'SHOW_USER_PLOTS' }), [])
  const setSelectedTileLayer = useCallback((layer: string) => dispatch({ type: 'SET_TILE_LAYER', layer }), [])

  const searchLot = useCallback(
    async (lotId: string, onSuccess?: (data: LotSearchResult['data']) => void, onError?: (message: string) => void) => {
      if (!lotId.trim()) {
        const errorMsg = 'Please enter a lot ID'
        onError?.(errorMsg)
        if (!isNativePlatform()) toast.error(errorMsg)
        return
      }
      dispatch({ type: 'SEARCH_START' })

      try {
        const result = await searchLotById(lotId.trim())
        dispatch({ type: 'SEARCH_SUCCESS', result })

        if (result.success && result.data) {
          const { plot_id, niche_number } = result.data

          const matchedMarker = markers.find((m: ConvertedMarker) => m.plot_id === plot_id)
          if (matchedMarker) {
            const groupKey = matchedMarker.block ? `block:${matchedMarker.block}` : `category:${matchedMarker.category}`
            dispatch({ type: 'SELECT_GROUPS', groups: new Set([groupKey]) })
            if (niche_number) dispatch({ type: 'SET_HIGHLIGHTED_NICHE', niche: niche_number })
            dispatch({ type: 'SET_AUTO_POPUP', plotId: String(plot_id) })
          }

          onSuccess?.(result.data)

          if (!isNativePlatform()) {
            toast.success(`Lot found in ${result.data.category} - ${result.data.block ? `Block ${result.data.block}` : 'Chamber'}`)
          }
        } else {
          const errorMessage = result.message || 'Lot not found'
          onError?.(errorMessage)
          if (!isNativePlatform()) {
            toast.error(errorMessage)
          }
        }
      } catch (error) {
        console.error('Search error:', error)
        const errorMessage = 'Failed to search lot. Please try again.'
        onError?.(errorMessage)
        if (!isNativePlatform()) {
          toast.error(errorMessage)
        }
      } finally {
        dispatch({ type: 'SEARCH_END' })
      }
    },
    [markers],
  )

  const clearSearch = useCallback(() => {
    dispatch({ type: 'SET_SEARCH_QUERY', query: '' })
    dispatch({ type: 'SEARCH_SUCCESS', result: null })
    dispatch({ type: 'SET_HIGHLIGHTED_NICHE', niche: null })
    dispatch({ type: 'SET_AUTO_POPUP', plotId: null })
    dispatch({ type: 'RESET_GROUPS' })
  }, [])

  const resetView = useCallback(() => {
    dispatch({ type: 'RESET_VIEW' })
    onResetView?.()
  }, [onResetView])

  const contextValue = useMemo<MapStateContextValue>(
    () => ({
      state,
      dispatch,
      toggleGroupSelection,
      resetGroupSelection,
      handleClusterClick,
      setSearchQuery: (query: string) => dispatch({ type: 'SET_SEARCH_QUERY', query }),
      searchLot,
      clearSearch,
      setAutoOpenPopupFor: (plotId: string | null) => dispatch({ type: 'SET_AUTO_POPUP', plotId }),
      showUserPlotsOnly,
      resetView,
      setSelectedTileLayer,
    }),
    [
      state,
      toggleGroupSelection,
      resetGroupSelection,
      handleClusterClick,
      searchLot,
      clearSearch,
      showUserPlotsOnly,
      resetView,
      setSelectedTileLayer,
    ],
  )

  return <MapStateContext.Provider value={contextValue}>{children}</MapStateContext.Provider>
}
