import { create } from 'zustand'
import type { PlotFeatureProps } from '../buildGeoJSON'

interface MapUIState {
  // Popup state
  popup: { coords: [number, number]; props: PlotFeatureProps } | null
  isFullscreen: boolean

  // Actions
  setPopup: (popup: { coords: [number, number]; props: PlotFeatureProps } | null) => void
  clearPopup: () => void
  setIsFullscreen: (isFullscreen: boolean) => void
  toggleFullscreen: () => void
}

export const useMapUIStore = create<MapUIState>((set, get) => ({
  // Initial state
  popup: null,
  isFullscreen: false,

  // Actions
  setPopup: (popup) => set({ popup }),

  clearPopup: () => set({ popup: null }),

  setIsFullscreen: (isFullscreen) => set({ isFullscreen }),

  toggleFullscreen: () => {
    const { isFullscreen } = get()
    set({ isFullscreen: !isFullscreen })
  },
}))
