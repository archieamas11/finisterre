import type { WebMapContext } from '@/hooks/useNavigationContext'
import { useMemo, useState } from 'react'

import LegendDialog from '@/components/webmap/LegendDialog'
import WebMapControlsRow from '@/components/webmap/WebMapControlsRow'
import WebMapSearchRow from '@/components/webmap/WebMapSearchRow'
import { TILE_LAYER_OPTIONS } from '@/contexts/constants'
import { useLocation, useMapData, useMapState, useNavigation } from '@/contexts/hooks'

export default function WebMapNavs({ onBack }: { onBack?: () => void }) {
  const { requestLocate } = useLocation()
  const { cancelNavigation } = useNavigation()
  const { availableGroups, userOwnedPlotsCount } = useMapData()
  const {
    state,
    toggleGroupSelection,
    resetGroupSelection,
    handleClusterClick,
    setSearchQuery,
    searchLot,
    clearSearch,
    setAutoOpenPopupFor,
    showUserPlotsOnly,
    resetView,
    setSelectedTileLayer,
  } = useMapState()

  const [isLegendOpen, setIsLegendOpen] = useState(false)

  // Create context object matching WebMapContext interface for compatibility
  const context: WebMapContext = useMemo(
    () => ({
      requestLocate,
      cancelNavigation,
      selectedGroups: state.selectedGroups,
      toggleGroupSelection,
      resetGroupSelection,
      clusterViewMode: state.clusterViewMode,
      availableGroups,
      handleClusterClick,
      searchQuery: state.searchQuery,
      setSearchQuery,
      searchResult: state.searchResult,
      isSearching: state.isSearching,
      searchLot,
      clearSearch,
      highlightedNiche: state.highlightedNiche,
      autoOpenPopupFor: state.autoOpenPopupFor,
      setAutoOpenPopupFor,
      showUserPlotsOnly,
      resetView,
      userOwnedPlotsCount,
      selectedTileLayer: state.selectedTileLayer,
      setSelectedTileLayer,
      tileLayerOptions: TILE_LAYER_OPTIONS,
    }),
    [
      requestLocate,
      cancelNavigation,
      state.selectedGroups,
      state.clusterViewMode,
      state.searchQuery,
      state.searchResult,
      state.isSearching,
      state.highlightedNiche,
      state.autoOpenPopupFor,
      state.selectedTileLayer,
      toggleGroupSelection,
      resetGroupSelection,
      availableGroups,
      handleClusterClick,
      setSearchQuery,
      searchLot,
      clearSearch,
      setAutoOpenPopupFor,
      showUserPlotsOnly,
      resetView,
      userOwnedPlotsCount,
      setSelectedTileLayer,
    ],
  )

  return (
    <>
      <nav
        className="absolute top-2 right-0 left-0 z-[990] mx-auto flex w-full max-w-full flex-col gap-2 pl-3 sm:top-3 sm:px-4 md:top-4 md:px-2 lg:max-w-3xl"
        aria-label="Map navigation"
      >
        <WebMapSearchRow context={context} />
        <WebMapControlsRow context={context} onBack={onBack} onLegendClick={() => setIsLegendOpen(true)} />
      </nav>
      <LegendDialog isOpen={isLegendOpen} onClose={() => setIsLegendOpen(false)} />
    </>
  )
}
