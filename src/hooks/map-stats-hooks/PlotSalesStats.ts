import { useQuery } from '@tanstack/react-query'

import { getLotsTimeSeries, type LotsTimeSeriesPoint } from '@/api/map-stats.api'

export interface MonthlyLotsSharePoint {
  month: string
  serenity: number
  columbarium: number
  memorial: number
}

function toMonthKey(dateStr: string): { key: string; label: string } {
  const d = new Date(`${dateStr}T00:00:00`)
  const y = d.getFullYear()
  const m = d.getMonth() + 1
  const key = `${y}-${String(m).padStart(2, '0')}`
  const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  return { key, label }
}

type LotsTimeSeriesWithMemorial = LotsTimeSeriesPoint & { memorial?: number; chambers?: number }

function aggregateMonthly(daily: LotsTimeSeriesWithMemorial[]): MonthlyLotsSharePoint[] {
  const map = new Map<string, { label: string; serenity: number; columbarium: number; memorial: number }>()
  for (const row of daily) {
    const { key, label } = toMonthKey(row.date)
    const bucket = map.get(key) ?? { label, serenity: 0, columbarium: 0, memorial: 0 }
    bucket.serenity += row.serenity
    bucket.columbarium += row.columbarium
    bucket.memorial += row.memorial ?? row.chambers ?? 0
    map.set(key, bucket)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([, v]) => ({ month: v.label, serenity: v.serenity, columbarium: v.columbarium, memorial: v.memorial }))
}

export function useLotsMonthlyShare() {
  return useQuery<MonthlyLotsSharePoint[], Error>({
    queryKey: ['lots-monthly-share', '1y'],
    queryFn: async () => {
      const daily = await getLotsTimeSeries('1y')
      return aggregateMonthly(daily)
    },
    placeholderData: (prev: MonthlyLotsSharePoint[] | undefined) => prev,
    staleTime: 60_000,
  })
}
