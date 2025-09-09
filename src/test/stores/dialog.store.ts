import { create } from 'zustand'

interface DialogState {
  // State
  dialogs: Record<string, boolean>

  // Actions
  setDialogOpen: (dialogId: string, isOpen: boolean) => void
  toggleDialog: (dialogId: string) => void
  closeDialog: (dialogId: string) => void
  closeAllDialogs: () => void
  isDialogOpen: (dialogId: string) => boolean
}

export const useDialogStore = create<DialogState>((set, get) => ({
  // Initial state
  dialogs: {},

  // Actions
  setDialogOpen: (dialogId, isOpen) =>
    set((state) => ({
      dialogs: {
        ...state.dialogs,
        [dialogId]: isOpen,
      },
    })),

  toggleDialog: (dialogId) => {
    const currentState = get().isDialogOpen(dialogId)
    get().setDialogOpen(dialogId, !currentState)
  },

  closeDialog: (dialogId) =>
    set((state) => ({
      dialogs: {
        ...state.dialogs,
        [dialogId]: false,
      },
    })),

  closeAllDialogs: () => set({ dialogs: {} }),

  isDialogOpen: (dialogId) => {
    const state = get()
    return state.dialogs[dialogId] ?? false
  },
}))
