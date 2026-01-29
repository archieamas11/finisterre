import { useCallback, useContext } from 'react'

import { LocateContext as WebMapLocateContext } from '@/contexts/MapContext'
import { LocateContext as AdminLocateContext } from '@/pages/admin/map4admin/LocateContext'

export interface AdminContext {
  requestLocate: () => void
  isAddingMarker: boolean
  toggleAddMarker: () => void
  toggleMultiEditSelect: () => void
  isMultiEditSelecting: boolean
  isEditingMarker: boolean
  toggleEditMarker: () => void
}

export interface WebMapContext {
  requestLocate: () => void
  cancelNavigation: () => void
  selectedGroups: Set<string>
  toggleGroupSelection: (groupKey: string) => void
  resetGroupSelection: () => void
  clusterViewMode: 'all' | 'selective' | 'user-plots'
  availableGroups: Array<{ key: string; label: string; count: number }>
  handleClusterClick: (groupKey: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResult: { success: boolean; message: string; data?: unknown } | null
  isSearching: boolean
  searchLot: (lotId: string) => Promise<void>
  clearSearch: () => void
  highlightedNiche: string | null
  autoOpenPopupFor: string | null
  setAutoOpenPopupFor: (plotId: string | null) => void
  showUserPlotsOnly: () => void
  resetView: () => void
  userOwnedPlotsCount: number
  // Tile layer selection
  selectedTileLayer: string
  setSelectedTileLayer: (layer: string) => void
  tileLayerOptions: Record<string, { name: string; url: string }>
}

export type MapContext = AdminContext | WebMapContext | null | undefined

export const isAdminContext = (ctx: unknown): ctx is AdminContext => {
  return (
    typeof ctx === 'object' &&
    ctx !== null &&
    'isAddingMarker' in ctx &&
    'toggleAddMarker' in ctx &&
    'isEditingMarker' in ctx &&
    'toggleEditMarker' in ctx
  )
}

export const isWebMapContext = (ctx: unknown): ctx is WebMapContext => {
  return (
    typeof ctx === 'object' &&
    ctx !== null &&
    'selectedGroups' in ctx &&
    'toggleGroupSelection' in ctx &&
    'resetGroupSelection' in ctx &&
    'clusterViewMode' in ctx &&
    'showUserPlotsOnly' in ctx &&
    'resetView' in ctx &&
    'handleClusterClick' in ctx &&
    'searchQuery' in ctx &&
    'searchLot' in ctx &&
    'userOwnedPlotsCount' in ctx
  )
}

export const useMapContext = () => {
  const webMapCtx = useContext(WebMapLocateContext)
  const adminCtx = useContext(AdminLocateContext)

  const locateCtx = adminCtx || webMapCtx

  return {
    context: locateCtx,
    isAdmin: isAdminContext(locateCtx),
    isWebMap: isWebMapContext(locateCtx),
  }
}

export const useAdminContext = () => {
  const { context, isAdmin } = useMapContext()

  const adminContext = isAdmin && isAdminContext(context) ? context : null

  const onAddMarkerClick = useCallback(() => {
    if (!adminContext) return

    if (adminContext.isEditingMarker) {
      adminContext.toggleEditMarker()
    }
    adminContext.toggleAddMarker()
  }, [adminContext])

  const onEditMarkerClick = useCallback(() => {
    if (!adminContext) return

    if (adminContext.isAddingMarker) {
      adminContext.toggleAddMarker()
    }
    adminContext.toggleEditMarker()
  }, [adminContext])

  const onMultiEditSelectClick = useCallback(() => {
    if (!adminContext) return

    if (adminContext.isAddingMarker) {
      adminContext.toggleAddMarker()
    }
    adminContext.toggleEditMarker()
  }, [adminContext])

  return {
    context: adminContext,
    onAddMarkerClick,
    onEditMarkerClick,
    onMultiEditSelectClick,
  }
}

export const useWebMapContext = () => {
  const { context, isWebMap } = useMapContext()

  return {
    context: isWebMap ? (context as WebMapContext) : null,
  }
}
