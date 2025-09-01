import { type DeceasedData } from '@/types/deceased.types'
import { type LotOwnerData } from '@/types/lot-owner.types'
import { type UserData } from '@/types/user.types'

import { api } from './axiosInstance'

export interface UserDashboardData {
  connected_memorials: number
  active_lots: number
  upcoming_events: number
  lots: LotOwnerData[]
  deceased_records: DeceasedData[]
  customer_id?: number | null
}

// 🔗 Raw backend response before transformation
export interface UserDashboardRawData {
  connected_memorials: number
  active_lots: number
  upcoming_events: number
  lots: Array<Omit<LotOwnerData, 'coordinates'> & { coordinates: string }>
  deceased_records: DeceasedData[]
  customer_id?: number | null
}

export async function getUsers(params: { isAdmin?: number } = {}) {
  const res = await api.post('users/get_users.php', params)
  return res.data as {
    users: UserData[]
  }
}

export async function getUserDashboard() {
  const res = await api.post('users/get_user_dashboard.php')
  return res.data as {
    success: boolean
    message: string
    data: UserDashboardRawData
  }
}

// Utility function to parse coordinates string to [lat, lng] array
export function parseCoordinates(coordinates?: string): [number, number] | null {
  if (!coordinates) return null

  const parts = coordinates.split(',').map((part) => parseFloat(part.trim()))
  if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    // coordinates are stored as "lng, lat", return as [lat, lng]
    return [parts[1], parts[0]]
  }

  return null
}
