import { useContext } from 'react'

import { MapStateContext, MapDispatchContext, type MapState } from '@/contexts/MapContext'

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
