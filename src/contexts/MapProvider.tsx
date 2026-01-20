import type { UseLocationTrackingOptions } from '@/hooks/useLocationTracking'
import type { UseValhallaOptions } from '@/hooks/useValhalla'
import type { ReactNode } from 'react'

import { LocationProvider } from './LocationProvider'
import { MapDataProvider } from './MapDataProvider'
import { MapStateProvider } from './MapStateProvider'
import { NavigationProvider } from './NavigationProvider'

interface MapProviderProps {
  children: ReactNode
  locationOptions?: UseLocationTrackingOptions
  navigationOptions?: UseValhallaOptions
  onNavigationStart?: () => void
  onNavigationEnd?: () => void
  onNavigationError?: (error: string) => void
  onResetView?: () => void
}

/**
 * Composite provider that combines all map-related contexts in the correct dependency order:
 *
 * 1. MapDataProvider - Provides plot/marker data (no dependencies)
 * 2. LocationProvider - Provides GPS location tracking (no dependencies)
 * 3. NavigationProvider - Provides routing/navigation (depends on LocationProvider)
 * 4. MapStateProvider - Provides UI state management (depends on MapDataProvider)
 */
export function MapProvider({
  children,
  locationOptions,
  navigationOptions,
  onNavigationStart,
  onNavigationEnd,
  onNavigationError,
  onResetView,
}: MapProviderProps) {
  return (
    <MapDataProvider>
      <LocationProvider options={locationOptions}>
        <NavigationProvider
          options={navigationOptions}
          onNavigationStart={onNavigationStart}
          onNavigationEnd={onNavigationEnd}
          onError={onNavigationError}
        >
          <MapStateProvider onResetView={onResetView}>{children}</MapStateProvider>
        </NavigationProvider>
      </LocationProvider>
    </MapDataProvider>
  )
}

// Re-export types only (hooks and constants should be imported from their respective files)
export type { LocationContextValue } from './LocationProvider'
export type { NavigationContextValue } from './NavigationProvider'
export type { MapDataContextValue, AvailableGroup } from './MapDataProvider'
export type { MapState, MapAction } from './MapStateProvider'
