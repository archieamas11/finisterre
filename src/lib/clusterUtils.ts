import type { ConvertedMarker } from '@/types/map.types'
import L from 'leaflet'

// Group markers by block or category key used across map layouts
export function groupMarkersByKey(markers: ConvertedMarker[]) {
  const markersByGroup: Record<string, ConvertedMarker[]> = {}
  markers.forEach((marker) => {
    const groupKey = marker.block && String(marker.block).trim() !== '' ? `block:${marker.block}` : `category:${marker.category || 'Uncategorized'}`
    if (!markersByGroup[groupKey]) markersByGroup[groupKey] = []
    markersByGroup[groupKey].push(marker)
  })
  return markersByGroup
}

// Derive a readable label from the grouping key
export function getLabelFromGroupKey(groupKey: string) {
  if (groupKey.startsWith('block:')) {
    const block = groupKey.split('block:')[1]
    return `Block ${block}`
  }
  const category = groupKey.split('category:')[1]
  return category
}

// Create a Leaflet divIcon factory for cluster labels
export function createClusterIconFactory(getLabel: (k: string) => string) {
  return (groupKey: string) => (cluster: { getChildCount: () => number }) => {
    const count = cluster.getChildCount()
    const label = getLabel(groupKey)

    return L.divIcon({
      html: `
      <div class="relative flex flex-col items-center justify-center">
        <div
          class="border-2 border-white text-white bg-black/50 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]"
        >
          ${count}
        </div>
        <span class="shadow-md mt-1 text-xs font-bold text-gray-200">${label}</span>
      </div>
    `,
      className: 'custom-marker-cluster',
      iconSize: [50, 60],
      iconAnchor: [25, 30],
    })
  }
}

export default {
  groupMarkersByKey,
  getLabelFromGroupKey,
  createClusterIconFactory,
}
