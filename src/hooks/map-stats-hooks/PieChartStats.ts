import type { MapStatsResponse } from '@/api/map-stats.api'
import { useQuery } from '@tanstack/react-query'

import { getChambersStats, getColumbariumStats, getSerenityStatsByBlock } from '@/api/map-stats.api'

export function useSerenityStatsByBlock(block: string) {
  return useQuery<MapStatsResponse>({
    queryKey: ['map-stats', 'serenity', block],
    queryFn: () => getSerenityStatsByBlock(block),
    placeholderData: (prev: MapStatsResponse | undefined) => prev,
    staleTime: 60_000,
  })
}

export function useChambersStats() {
  return useQuery<MapStatsResponse>({
    queryKey: ['map-stats', 'chambers'],
    queryFn: () => getChambersStats(),
    placeholderData: (prev: MapStatsResponse | undefined) => prev,
    staleTime: 60_000,
  })
}

export function useColumbariumStats() {
  return useQuery<MapStatsResponse>({
    queryKey: ['map-stats', 'columbarium'],
    queryFn: () => getColumbariumStats(),
    placeholderData: (prev: MapStatsResponse | undefined) => prev,
    staleTime: 60_000,
  })
}
