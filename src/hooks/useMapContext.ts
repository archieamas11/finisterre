import { useContext } from 'react'

import { MapStateContext, MapDispatchContext } from '@/components/layout/WebMapLayout'

// Re-export MapState type via module augmentation pattern (local only) — declare minimal shape
// If MapState changes, consider exporting it explicitly from layout file for stronger typing.
type MapState = {
  selectedGroups: Set<string>
  clusterViewMode: 'all' | 'selective'
  searchQuery: string
  searchResult: unknown
  isSearching: boolean
  highlightedNiche: string | null
  autoOpenPopupFor: string | null
  forceClosePopupsToken: number
}

// Generic selector-based state consumption to minimize component re-renders
export function useMapSelector<T>(selector: (state: MapState) => T): T {
  const state = useContext(MapStateContext)
  if (!state) throw new Error('useMapSelector must be used within MapPage provider')
  return selector(state)
}

export function useMapDispatch() {
  const dispatch = useContext(MapDispatchContext)
  if (!dispatch) throw new Error('useMapDispatch must be used within MapPage provider')
  return dispatch
}

// Convenience specific selectors
export function useClusterState() {
  return useMapSelector((s) => ({ selectedGroups: s.selectedGroups, clusterViewMode: s.clusterViewMode }))
}

export function useSearchState() {
  return useMapSelector((s) => ({
    searchQuery: s.searchQuery,
    searchResult: s.searchResult,
    isSearching: s.isSearching,
    highlightedNiche: s.highlightedNiche,
  }))
}

export function usePopupState() {
  return useMapSelector((s) => ({ autoOpenPopupFor: s.autoOpenPopupFor, forceClosePopupsToken: s.forceClosePopupsToken }))
}
