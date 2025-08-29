import { useContext, useCallback } from 'react'

import { LocateContext as WebMapLocateContext } from '@/contexts/MapContext'
import { LocateContext as AdminLocateContext } from '@/pages/admin/map4admin/LocateContext'

// Define types for different contexts
export interface AdminContext {
  requestLocate: () => void
  isAddingMarker: boolean
  toggleAddMarker: () => void
  isEditingMarker: boolean
  toggleEditMarker: () => void
}

export interface WebMapContext {
  requestLocate: () => void
  clearRoute: () => void
  selectedGroups: Set<string>
  toggleGroupSelection: (groupKey: string) => void
  resetGroupSelection: () => void
  clusterViewMode: 'all' | 'selective'
  availableGroups: Array<{ key: string; label: string; count: number }>
  handleClusterClick: (groupKey: string) => void
  // 🔍 Search functionality
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResult: { success: boolean; message: string; data?: unknown } | null
  isSearching: boolean
  searchLot: (lotId: string) => Promise<void>
  clearSearch: () => void
  highlightedNiche: string | null
  // 🎯 Auto popup functionality
  autoOpenPopupFor: string | null
  setAutoOpenPopupFor: (plotId: string | null) => void
}

export type MapContext = AdminContext | WebMapContext | null | undefined

// 🔧 Type guards
export const isAdminContext = (ctx: unknown): ctx is AdminContext => {
  return typeof ctx === 'object' && ctx !== null && 'isAddingMarker' in ctx && 'toggleAddMarker' in ctx && 'isEditingMarker' in ctx && 'toggleEditMarker' in ctx
}

export const isWebMapContext = (ctx: unknown): ctx is WebMapContext => {
  return (
    typeof ctx === 'object' &&
    ctx !== null &&
    'selectedGroups' in ctx &&
    'toggleGroupSelection' in ctx &&
    'resetGroupSelection' in ctx &&
    'handleClusterClick' in ctx &&
    'searchQuery' in ctx &&
    'searchLot' in ctx
  )
}

// 🎯 Custom hook for context management
export const useMapContext = () => {
  const webMapCtx = useContext(WebMapLocateContext)
  const adminCtx = useContext(AdminLocateContext)

  // 🎯 Use admin context if available, otherwise use web map context
  const locateCtx = adminCtx || webMapCtx

  return {
    context: locateCtx,
    isAdmin: isAdminContext(locateCtx),
    isWebMap: isWebMapContext(locateCtx),
  }
}

// 🎯 Hook for admin-specific functionality
export const useAdminContext = () => {
  const { context, isAdmin } = useMapContext()

  const onAddMarkerClick = useCallback(() => {
    if (isAdmin && context) {
      if ((context as AdminContext).isEditingMarker) {
        ;(context as AdminContext).toggleEditMarker()
      }
      ;(context as AdminContext).toggleAddMarker()
    }
  }, [isAdmin, context])

  const onEditMarkerClick = useCallback(() => {
    if (isAdmin && context) {
      if ((context as AdminContext).isAddingMarker) {
        ;(context as AdminContext).toggleAddMarker()
      }
      ;(context as AdminContext).toggleEditMarker()
    }
  }, [isAdmin, context])

  return {
    context: isAdmin ? (context as AdminContext) : null,
    onAddMarkerClick,
    onEditMarkerClick,
  }
}

// 🎯 Hook for web map specific functionality
export const useWebMapContext = () => {
  const { context, isWebMap } = useMapContext()

  return {
    context: isWebMap ? (context as WebMapContext) : null,
  }
}
