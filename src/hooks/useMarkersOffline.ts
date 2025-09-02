import Dexie, { type Table } from 'dexie'
import { useEffect, useState, useCallback } from 'react'

import type { plots } from '@/types/map.types'

import { getPlots } from '@/api/plots.api'

// Dexie database definition kept isolated & tree-shakeable
class MarkerDB extends Dexie {
  plots!: Table<plots, string>
  constructor() {
    super('MarkerDB')
    // Schema: primary key plot_id plus some indexes for potential queries
    this.version(1).stores({
      plots: 'plot_id, block, category, status',
    })
  }
}

let db: MarkerDB | null = null
const getDB = () => {
  if (!db) db = new MarkerDB()
  return db
}

export interface UseMarkersOfflineOptions {
  // Force refetch override (e.g. manual refresh button)
  refetchKey?: number
  enabled?: boolean
}

interface UseMarkersOfflineResult {
  data: plots[] | undefined
  isLoading: boolean
  isOffline: boolean
  error: unknown
  refetch: () => Promise<void>
  source: 'network' | 'cache' | undefined
}

// Hook to manage online/offline marker loading with Dexie persistence
export function useMarkersOffline(options: UseMarkersOfflineOptions = {}): UseMarkersOfflineResult {
  const { refetchKey, enabled = true } = options
  const [data, setData] = useState<plots[] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)
  const [source, setSource] = useState<'network' | 'cache' | undefined>(undefined)
  const isOffline = typeof navigator !== 'undefined' ? navigator.onLine === false : false

  const loadFromCache = useCallback(async () => {
    const cached = await getDB()
      .plots.toArray()
      .catch(() => [])
    if (cached.length > 0) {
      setData(cached)
      setSource('cache')
    }
  }, [])

  const fetchAndCache = useCallback(async () => {
    if (!enabled) return
    if (isOffline) {
      await loadFromCache()
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const res = await getPlots()
      const plotsData: plots[] = Array.isArray(res) ? res : res?.plots || []
      setData(plotsData)
      setSource('network')
      // Persist (best-effort)
      const database = getDB()
      // Clear then bulk add (Dexie transaction implicit via table operations order not strictly required here)
      await database.plots.clear()
      if (plotsData.length) await database.plots.bulkAdd(plotsData)
    } catch (err) {
      setError(err)
      // fallback to cache on network failure
      await loadFromCache()
    } finally {
      setIsLoading(false)
    }
  }, [enabled, isOffline, loadFromCache])

  // Initial & refetchKey triggered load
  useEffect(() => {
    fetchAndCache()
  }, [fetchAndCache, refetchKey])

  // Listen to online event to refresh automatically
  useEffect(() => {
    const handler = () => fetchAndCache()
    window.addEventListener('online', handler)
    return () => window.removeEventListener('online', handler)
  }, [fetchAndCache])

  const refetch = useCallback(async () => {
    await fetchAndCache()
  }, [fetchAndCache])

  return { data, isLoading, isOffline, error, refetch, source }
}
