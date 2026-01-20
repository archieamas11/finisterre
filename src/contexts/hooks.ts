import { useContext } from 'react'
import { LocationContext, NavigationContext, MapDataContext, MapStateContext } from './contexts'

export function useLocation() {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider')
  }
  return context
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider')
  }
  return context
}

export function useMapData() {
  const context = useContext(MapDataContext)
  if (!context) {
    throw new Error('useMapData must be used within MapDataProvider')
  }
  return context
}

export function useMapState() {
  const context = useContext(MapStateContext)
  if (!context) {
    throw new Error('useMapState must be used within MapStateProvider')
  }
  return context
}
