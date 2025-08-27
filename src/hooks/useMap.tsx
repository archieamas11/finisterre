import { useContext } from 'react'

import { MapStateContext, MapDispatchContext, type MapState } from '@/contexts/MapContext'

// Selector hook to minimize re-renders
export function useMapState<T>(selector: (s: MapState) => T): T {
  const state = useContext(MapStateContext)
  if (!state) throw new Error('useMapState must be used within MapPage provider')
  return selector(state)
}

export function useMapDispatch() {
  const dispatch = useContext(MapDispatchContext)
  if (!dispatch) throw new Error('useMapDispatch must be used within MapPage provider')
  return dispatch
}
