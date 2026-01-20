import { memo } from 'react'

import Spinner from '@/components/ui/spinner'

/**
 * Props for the MapLoadingState component
 */
export interface MapLoadingStateProps {
  /** Whether to show the loading state */
  isLoading: boolean
}

/**
 * Full-screen loading state component for the map
 * Shows a centered spinner while map data is loading
 *
 * @example
 * ```tsx
 * if (isLoading) {
 *   return <MapLoadingState isLoading={isLoading} />
 * }
 * ```
 */
function MapLoadingStateComponent({ isLoading }: MapLoadingStateProps) {
  if (!isLoading) {
    return null
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner />
    </div>
  )
}

export const MapLoadingState = memo(MapLoadingStateComponent)
MapLoadingState.displayName = 'MapLoadingState'
