import type { LotsTimeSeriesPoint } from '@/api/map-stats.api'
import { useQuery } from '@tanstack/react-query'

import { getLotsTimeSeries } from '@/api/map-stats.api'

export type LotsRange = '7d' | '30d' | '90d' | '1y'

export function useLotsTimeSeries(range: LotsRange) {
  return useQuery<LotsTimeSeriesPoint[], Error>({
    queryKey: ['lots-time-series', range],
    queryFn: () => getLotsTimeSeries(range),
    placeholderData: (prev: LotsTimeSeriesPoint[] | undefined) => prev,
    staleTime: 60_000,
  })
}
