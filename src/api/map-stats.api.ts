import { api } from './axiosInstance'

export interface MapStatsResponse {
  total: number
  available: number
  occupied: number
  reserved: number
}

function normalizeStatsPayload(data: unknown): MapStatsResponse {
  const payload = (data ?? {}) as Record<string, unknown>
  const total = Number(payload.total ?? payload.totalPlots ?? 0)
  const occupied = Number(payload.occupied ?? 0)
  const reserved = Number(payload.reserved ?? 0)
  const available = Number(payload.available ?? total - occupied - reserved)
  return { total, available, occupied, reserved }
}

export async function getChambersStats(): Promise<MapStatsResponse> {
  const res = await api.post('map-stats/get_chambers.php')
  const payload = res?.data?.data ?? res?.data // allow either { data: {...} } or direct fields
  const normalized = normalizeStatsPayload(payload)
  if (Number.isNaN(normalized.total)) {
    throw new Error('Invalid chambers stats response')
  }
  return normalized
}

export async function getSerenityStats(): Promise<MapStatsResponse> {
  const res = await api.post('map-stats/get_serenity.php')
  const payload = res?.data?.data ?? res?.data
  const normalized = normalizeStatsPayload(payload)
  if (Number.isNaN(normalized.total)) {
    throw new Error('Invalid serenity stats response')
  }
  return normalized
}

export async function getColumbariumStats(): Promise<MapStatsResponse> {
  const res = await api.post('map-stats/get_columbarium.php')
  const payload = res?.data?.data ?? res?.data
  const normalized = normalizeStatsPayload(payload)
  if (Number.isNaN(normalized.total)) {
    throw new Error('Invalid columbarium stats response')
  }
  return normalized
}

export async function getSerenityStatsByBlock(block?: string): Promise<MapStatsResponse> {
  const blockParam = block && block !== 'all' ? `?block=${encodeURIComponent(block)}` : ''
  const res = await api.get(`map-stats/get_serenity_by_block.php${blockParam}`)
  const payload = res?.data?.data ?? res?.data
  const normalized = normalizeStatsPayload(payload)
  if (Number.isNaN(normalized.total)) {
    throw new Error('Invalid serenity stats response')
  }
  return normalized
}

export interface LotsTimeSeriesPoint {
  date: string
  serenity: number
  columbarium: number
  chambers: number
}

export async function getLotsTimeSeries(range: '7d' | '30d' | '90d' | '1y' = '90d'): Promise<LotsTimeSeriesPoint[]> {
  const res = await api.get(`map-stats/get_lots_time_series.php?range=${encodeURIComponent(range)}`)
  const data = (res?.data?.data ?? res?.data?.points ?? res?.data) as unknown
  if (!Array.isArray(data)) {
    if (Array.isArray(res?.data?.data)) return res.data.data as LotsTimeSeriesPoint[]
    if (Array.isArray(res?.data?.points)) return res.data.points as LotsTimeSeriesPoint[]
    if (Array.isArray(res?.data)) return res.data as LotsTimeSeriesPoint[]
    return []
  }
  return data as LotsTimeSeriesPoint[]
}
