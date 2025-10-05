import { useQuery } from '@tanstack/react-query'

import { getChambersStats, getSerenityStats, type MapStatsResponse } from '@/api/map-stats.api'

export interface OverallMapStats extends MapStatsResponse {
  chambers: MapStatsResponse
  serenity: MapStatsResponse
  occupancyRate: number
  availableRate: number
  reservedRate: number
}

async function fetchOverallStats(): Promise<OverallMapStats> {
  const [chambers, serenity] = await Promise.all([getChambersStats(), getSerenityStats()])
  const total = chambers.total + serenity.total
  const occupied = chambers.occupied + serenity.occupied
  const reserved = chambers.reserved + serenity.reserved
  const available = chambers.available + serenity.available
  const safeDiv = (a: number, b: number) => (b > 0 ? (a / b) * 100 : 0)
  return {
    total,
    occupied,
    reserved,
    available,
    chambers,
    serenity,
    occupancyRate: Number(safeDiv(occupied, total).toFixed(1)),
    availableRate: Number(safeDiv(available, total).toFixed(1)),
    reservedRate: Number(safeDiv(reserved, total).toFixed(1)),
  }
}

export function useOverallMapStats() {
  return useQuery({
    queryKey: ['map-stats', 'overall'],
    queryFn: fetchOverallStats,
    staleTime: 60_000, // 1 min
  })
}
