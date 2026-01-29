import { createContext } from 'react'

export const LocateContext = createContext<{
  requestLocate: () => void
  isAddingMarker: boolean
  toggleAddMarker: () => void
  isEditingMarker: boolean
  toggleEditMarker: () => void
  isMultiEditSelecting: boolean
  toggleMultiEditSelect: () => void
} | null>(null)

export default LocateContext
