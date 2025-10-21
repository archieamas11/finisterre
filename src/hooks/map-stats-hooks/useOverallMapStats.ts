import type { MapStatsResponse } from '@/api/map-stats.api'
import { useQuery } from '@tanstack/react-query'

import { getChambersStats, getColumbariumStats, getSerenityStats } from '@/api/map-stats.api'

export interface OverallMapStats {
  total: number
  available: number
  occupied: number
  reserved: number
  chambers: MapStatsResponse
  serenity: MapStatsResponse
  columbarium: MapStatsResponse
  occupancyRate: number
  availableRate: number
  reservedRate: number
}

async function fetchOverallStats(): Promise<OverallMapStats> {
  const [chambers, serenity, columbarium] = await Promise.all([getChambersStats(), getSerenityStats(), getColumbariumStats()])
  const total = chambers.total + serenity.total + columbarium.total
  const occupied = chambers.occupied + serenity.occupied + columbarium.occupied
  const reserved = chambers.reserved + serenity.reserved + columbarium.reserved
  const available = chambers.available + serenity.available + columbarium.available
  const safeDiv = (a: number, b: number) => (b > 0 ? (a / b) * 100 : 0)
  return {
    total,
    occupied,
    reserved,
    available,
    chambers,
    serenity,
    columbarium,
    occupancyRate: Number(safeDiv(occupied, total).toFixed(1)),
    availableRate: Number(safeDiv(available, total).toFixed(1)),
    reservedRate: Number(safeDiv(reserved, total).toFixed(1)),
  }
}

export function useOverallMapStats() {
  return useQuery({
    queryKey: ['map-stats', 'overall'],
    queryFn: fetchOverallStats,
    staleTime: 60_000,
  })
}
