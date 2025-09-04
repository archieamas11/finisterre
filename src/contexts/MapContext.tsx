import { createContext } from 'react'

import type { LotSearchResult } from '@/types/map.types'

// ==== Map State Management Types ====
export interface MapState {
  isNavigationInstructionsOpen: boolean
  isDirectionLoading: boolean
  shouldCenterOnUser: boolean
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
  // Popup close orchestration
  pendingPopupClose: boolean
  // Declarative popup close flag (instead of DOM query removal)
  forceClosePopupsToken: number // increment to signal popups should close
}

export type MapAction =
  | { type: 'SET_NAV_OPEN'; value: boolean }
  | { type: 'SET_DIRECTION_LOADING'; value: boolean }
  | { type: 'REQUEST_LOCATE' }
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
  | { type: 'REQUEST_POPUP_CLOSE' }
  | { type: 'POPUP_CLOSE_CONFIRMED' }
  | { type: 'RESET_VIEW' }

// ==== Context Types ====
export interface AvailableGroup {
  key: string
  label: string
  count: number
}

export interface LocateContextValue extends MapState {
  requestLocate: () => Promise<void>
  clearRoute: () => void
  resetView: () => void
  toggleGroupSelection: (groupKey: string) => void
  resetGroupSelection: () => void
  availableGroups: AvailableGroup[]
  handleClusterClick: (groupKey: string) => void
  setSearchQuery: (query: string) => void
  searchLot: (lotId: string) => Promise<void>
  clearSearch: () => void
  setAutoOpenPopupFor: (plotId: string | null) => void
  requestPopupClose: () => void
  showUserPlotsOnly: () => void
  // Count of user-owned plots (used to conditionally show My Plots entry in filters)
  userOwnedPlotsCount: number
}

// ==== Contexts ====
export const MapStateContext = createContext<MapState | null>(null)
export const MapDispatchContext = createContext<React.Dispatch<MapAction> | null>(null)

// Backwards compatible combined context (will be deprecated): retains original shape where feasible
export const LocateContext = createContext<LocateContextValue | null>(null)
