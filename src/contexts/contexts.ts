import { createContext } from 'react'
import type { LocationContextValue } from './LocationProvider'
import type { NavigationContextValue } from './NavigationProvider'
import type { MapDataContextValue } from './MapDataProvider'
import type { MapStateContextValue } from './MapStateProvider'

export const LocationContext = createContext<LocationContextValue | null>(null)
export const NavigationContext = createContext<NavigationContextValue | null>(null)
export const MapDataContext = createContext<MapDataContextValue | null>(null)
export const MapStateContext = createContext<MapStateContextValue | null>(null)
