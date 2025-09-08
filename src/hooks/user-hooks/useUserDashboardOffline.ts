import Dexie, { type Table } from 'dexie'
import { useEffect, useState, useCallback } from 'react'

import type { UserDashboardData } from '@/api/users.api'

import { getUserDashboard, parseCoordinates } from '@/api/users.api'

// Dexie database definition for user dashboard data
class UserDashboardDB extends Dexie {
  dashboard!: Table<UserDashboardData, string>

  constructor() {
    super('UserDashboardDB')
    this.version(1).stores({
      dashboard: 'customer_id', // Using customer_id as primary key
    })
  }
}

let userDashboardDB: UserDashboardDB | null = null
const getUserDashboardDB = () => {
  if (!userDashboardDB) userDashboardDB = new UserDashboardDB()
  return userDashboardDB
}

export interface UseUserDashboardOfflineOptions {
  // Force refetch override (e.g. manual refresh button)
  refetchKey?: number
  enabled?: boolean
}

interface UseUserDashboardOfflineResult {
  data: UserDashboardData | undefined
  isLoading: boolean
  isOffline: boolean
  error: unknown
  refetch: () => Promise<void>
  source: 'network' | 'cache' | undefined
}

// Default data structure to ensure consistent response shape
const DEFAULT_DASHBOARD_DATA: UserDashboardData = {
  connected_memorials: 0,
  active_lots: 0,
  upcoming_events: 0,
  lots: [],
  deceased_records: [],
  customer_id: null,
}

// Hook to manage online/offline user dashboard loading with Dexie persistence
export function useUserDashboardOffline(options: UseUserDashboardOfflineOptions = {}): UseUserDashboardOfflineResult {
  const { refetchKey, enabled = true } = options
  const [data, setData] = useState<UserDashboardData | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)
  const [source, setSource] = useState<'network' | 'cache' | undefined>(undefined)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const isOffline = typeof navigator !== 'undefined' ? navigator.onLine === false : false

  const loadFromCache = useCallback(async () => {
    try {
      const cached = await getUserDashboardDB()
        .dashboard.toArray()
        .catch(() => [])

      if (cached.length > 0) {
        // Use the most recent cached data (assuming single user per device)
        const latestData = cached[0]
        setData(latestData)
        setSource('cache')
        return latestData
      } else {
        // No cached data available, use defaults
        setData(DEFAULT_DASHBOARD_DATA)
        setSource('cache')
        return DEFAULT_DASHBOARD_DATA
      }
    } catch (err) {
      console.warn('Failed to load dashboard from cache:', err)
      setData(DEFAULT_DASHBOARD_DATA)
      setSource('cache')
      return DEFAULT_DASHBOARD_DATA
    }
  }, [])

  const fetchAndCache = useCallback(async () => {
    if (!enabled) return

    if (isOffline) {
      await loadFromCache()
      return
    }

    setError(null)

    try {
      const response = await getUserDashboard()

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch dashboard data')
      }

      const rawData = response.data || {}

      // Transform lots data with coordinate parsing, filter out lots with invalid coordinates
      const transformedLots = (rawData.lots || [])
        .map((lot) => ({
          ...lot,
          coordinates: parseCoordinates(lot.coordinates),
        }))
        .filter((lot): lot is typeof lot & { coordinates: [number, number] } => lot.coordinates !== null)

      const transformedData: UserDashboardData = {
        connected_memorials: rawData.connected_memorials ?? DEFAULT_DASHBOARD_DATA.connected_memorials,
        active_lots: rawData.active_lots ?? DEFAULT_DASHBOARD_DATA.active_lots,
        upcoming_events: rawData.upcoming_events ?? DEFAULT_DASHBOARD_DATA.upcoming_events,
        lots: transformedLots,
        deceased_records: rawData.deceased_records ?? DEFAULT_DASHBOARD_DATA.deceased_records,
        customer_id: rawData.customer_id ?? DEFAULT_DASHBOARD_DATA.customer_id,
      }

      setData(transformedData)
      setSource('network')

      // Persist to cache (best-effort)
      try {
        const database = getUserDashboardDB()
        // Clear existing data and add new data
        await database.dashboard.clear()
        await database.dashboard.add(transformedData)
      } catch (cacheError) {
        console.warn('Failed to cache dashboard data:', cacheError)
        // Don't throw - caching failure shouldn't break the app
      }
    } catch (err) {
      setError(err)
      // If we have cached data, keep showing it; otherwise fallback to cache
      if (!data || (data.connected_memorials === 0 && data.active_lots === 0 && data.lots.length === 0)) {
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
      if (cachedData && (cachedData.connected_memorials > 0 || cachedData.active_lots > 0 || cachedData.lots.length > 0)) {
        setIsInitialLoad(false)
      }

      // Then fetch fresh data in background (if online)
      if (!isOffline) {
        setIsLoading(true)
        try {
          const response = await getUserDashboard()

          if (!response.success) {
            throw new Error(response.message || 'Failed to fetch dashboard data')
          }

          const rawData = response.data || {}

          // Transform lots data with coordinate parsing, filter out lots with invalid coordinates
          const transformedLots = (rawData.lots || [])
            .map((lot) => ({
              ...lot,
              coordinates: parseCoordinates(lot.coordinates),
            }))
            .filter((lot): lot is typeof lot & { coordinates: [number, number] } => lot.coordinates !== null)

          const transformedData: UserDashboardData = {
            connected_memorials: rawData.connected_memorials ?? DEFAULT_DASHBOARD_DATA.connected_memorials,
            active_lots: rawData.active_lots ?? DEFAULT_DASHBOARD_DATA.active_lots,
            upcoming_events: rawData.upcoming_events ?? DEFAULT_DASHBOARD_DATA.upcoming_events,
            lots: transformedLots,
            deceased_records: rawData.deceased_records ?? DEFAULT_DASHBOARD_DATA.deceased_records,
            customer_id: rawData.customer_id ?? DEFAULT_DASHBOARD_DATA.customer_id,
          }

          setData(transformedData)
          setSource('network')

          // Persist fresh data
          try {
            const database = getUserDashboardDB()
            await database.dashboard.clear()
            await database.dashboard.add(transformedData)
          } catch (cacheError) {
            console.warn('Failed to cache dashboard data:', cacheError)
          }
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
