import { create } from 'zustand'
import { useDialogStore } from './dialog.store'

interface ShareDialogState {
  // State
  currentLocation: [number, number] | null
  isGettingLocation: boolean

  // Actions
  setCurrentLocation: (location: [number, number] | null) => void
  setIsGettingLocation: (isGetting: boolean) => void
  reset: () => void
}

// Create a selector for share dialog specifically
export const useShareDialogState = create<ShareDialogState>((set) => ({
  // Initial state
  currentLocation: null,
  isGettingLocation: false,

  // Actions
  setCurrentLocation: (location) => set({ currentLocation: location }),

  setIsGettingLocation: (isGetting) => set({ isGettingLocation: isGetting }),

  reset: () =>
    set({
      currentLocation: null,
      isGettingLocation: false,
    }),
}))

// Combined hook that includes dialog state
export const useShareDialogStore = () => {
  const dialogState = useDialogStore()
  const shareState = useShareDialogState()

  return {
    ...shareState,
    isOpen: dialogState.isDialogOpen('share'),
    setIsOpen: (isOpen: boolean) => dialogState.setDialogOpen('share', isOpen),
    toggleOpen: () => dialogState.toggleDialog('share'),
    closeDialog: () => dialogState.closeDialog('share'),
  }
}
