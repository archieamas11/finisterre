import type { plots } from '@/types/map.types'
import type { Table } from 'dexie'
import { useCallback, useEffect, useState } from 'react'
import Dexie from 'dexie'

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
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const isOffline = typeof navigator !== 'undefined' ? navigator.onLine === false : false

  const loadFromCache = useCallback(async () => {
    const cached = await getDB()
      .plots.toArray()
      .catch(() => [])
    if (cached.length > 0) {
      setData(cached)
      setSource('cache')
    }
    return cached
  }, [])

  const fetchAndCache = useCallback(async () => {
    if (!enabled) return

    // If offline, only load from cache
    if (isOffline) {
      await loadFromCache()
      return
    }

    // For online mode, fetch fresh data in background
    setError(null)
    try {
      const res = await getPlots()
      const plotsData: plots[] = Array.isArray(res) ? res : res?.plots || []
      setData(plotsData)
      setSource('network')

      // Persist (best-effort)
      const database = getDB()
      await database.plots.clear()
      if (plotsData.length) await database.plots.bulkAdd(plotsData)
    } catch (err) {
      setError(err)
      // If we have cached data, keep showing it; otherwise fallback to cache
      if (!data || data.length === 0) {
        await loadFromCache()
      }
    }
  }, [enabled, isOffline, loadFromCache, data])

  // Initial load: show cached data instantly, then fetch fresh data
  useEffect(() => {
    const initializeData = async () => {
      if (!enabled) return

      // First, try to load cached data instantly
      const cachedData = await loadFromCache()

      // If we have cached data, show it immediately
      if (cachedData.length > 0) {
        setIsInitialLoad(false)
      }

      // Then fetch fresh data in background (if online)
      if (!isOffline) {
        setIsLoading(true)
        try {
          const res = await getPlots()
          const plotsData: plots[] = Array.isArray(res) ? res : res?.plots || []
          setData(plotsData)
          setSource('network')

          // Persist fresh data
          const database = getDB()
          await database.plots.clear()
          if (plotsData.length) await database.plots.bulkAdd(plotsData)
        } catch (err) {
          setError(err)
          // Keep showing cached data on network error
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsInitialLoad(false)
      }
    }

    initializeData()
  }, [enabled, isOffline, loadFromCache])

  // Handle refetchKey changes
  useEffect(() => {
    if (refetchKey !== undefined) {
      fetchAndCache()
    }
  }, [refetchKey, fetchAndCache])

  // Listen to online event to refresh automatically
  useEffect(() => {
    const handler = () => {
      if (!isInitialLoad) {
        fetchAndCache()
      }
    }
    window.addEventListener('online', handler)
    return () => window.removeEventListener('online', handler)
  }, [fetchAndCache, isInitialLoad])

  const refetch = useCallback(async () => {
    setIsLoading(true)
    await fetchAndCache()
    setIsLoading(false)
  }, [fetchAndCache])

  return {
    data,
    isLoading: isLoading && !isInitialLoad, // Don't show loading on initial load if we have cached data
    isOffline,
    error,
    refetch,
    source,
  }
}
