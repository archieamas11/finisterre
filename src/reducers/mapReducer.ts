import type { MapAction, MapState } from '@/contexts/MapContext'
import type { LotSearchResult } from '@/types/map.types'

import { initialMapState } from '@/constants/map.constants'

/**
 * Reducer function for map state management
 * Handles navigation, search, clustering, and UI state
 */
export function mapReducer(state: MapState, action: MapAction): MapState {
  switch (action.type) {
    case 'SET_NAV_OPEN':
      return { ...state, isNavigationInstructionsOpen: action.value }

    case 'SET_DIRECTION_LOADING':
      return { ...state, isDirectionLoading: action.value }

    case 'SELECT_GROUPS':
      return {
        ...state,
        selectedGroups: action.groups,
        clusterViewMode: action.groups.size > 0 ? 'selective' : 'all',
      }

    case 'TOGGLE_GROUP': {
      const newSet = new Set(state.selectedGroups)
      if (newSet.has(action.group)) {
        newSet.delete(action.group)
      } else {
        newSet.add(action.group)
      }
      return {
        ...state,
        selectedGroups: newSet,
        clusterViewMode: newSet.size > 0 ? 'selective' : 'all',
      }
    }

    case 'RESET_GROUPS':
      return {
        ...state,
        selectedGroups: new Set(),
        clusterViewMode: 'all',
      }

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
      return {
        ...state,
        isSearching: true,
        searchResult: null,
        highlightedNiche: null,
      }

    case 'SEARCH_SUCCESS':
      return { ...state, searchResult: action.result }

    case 'SEARCH_END':
      return { ...state, isSearching: false }

    case 'SET_HIGHLIGHTED_NICHE':
      return { ...state, highlightedNiche: action.niche }

    case 'SET_AUTO_POPUP':
      return { ...state, autoOpenPopupFor: action.plotId }

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

/**
 * Action creators for map state management
 * Provides type-safe action creation with descriptive function names
 */
export const mapActions = {
  /** Open or close navigation instructions panel */
  setNavOpen: (value: boolean): MapAction => ({
    type: 'SET_NAV_OPEN',
    value,
  }),

  /** Set direction loading state */
  setDirectionLoading: (value: boolean): MapAction => ({
    type: 'SET_DIRECTION_LOADING',
    value,
  }),

  /** Select specific groups for filtering */
  selectGroups: (groups: Set<string>): MapAction => ({
    type: 'SELECT_GROUPS',
    groups,
  }),

  /** Toggle a single group selection */
  toggleGroup: (group: string): MapAction => ({
    type: 'TOGGLE_GROUP',
    group,
  }),

  /** Reset all group selections to show all markers */
  resetGroups: (): MapAction => ({
    type: 'RESET_GROUPS',
  }),

  /** Switch to user plots view mode */
  showUserPlots: (): MapAction => ({
    type: 'SHOW_USER_PLOTS',
  }),

  /** Update the search query string */
  setSearchQuery: (query: string): MapAction => ({
    type: 'SET_SEARCH_QUERY',
    query,
  }),

  /** Start a search operation */
  searchStart: (): MapAction => ({
    type: 'SEARCH_START',
  }),

  /** Set the search result */
  searchSuccess: (result: LotSearchResult | null): MapAction => ({
    type: 'SEARCH_SUCCESS',
    result,
  }),

  /** End a search operation */
  searchEnd: (): MapAction => ({
    type: 'SEARCH_END',
  }),

  /** Set the highlighted niche for visual emphasis */
  setHighlightedNiche: (niche: string | null): MapAction => ({
    type: 'SET_HIGHLIGHTED_NICHE',
    niche,
  }),

  /** Set the plot ID to auto-open popup for */
  setAutoPopup: (plotId: string | null): MapAction => ({
    type: 'SET_AUTO_POPUP',
    plotId,
  }),

  /** Reset the entire map view to default state */
  resetView: (): MapAction => ({
    type: 'RESET_VIEW',
  }),
}

// Re-export initialMapState for convenience
export { initialMapState }
