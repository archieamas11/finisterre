import { api } from './axiosInstance'

export interface UserRecord {
  user_id: number
  customer_id?: number | null
  username: string
  isAdmin: number
  isArchive?: number
  created_at?: string | null
  updated_at?: string | null
}

export interface LotRecord {
  lot_id: number
  niche_number?: string
  niche_status?: string
  lot_status: string
  created_at: string
  updated_at: string
  plot_id?: number
  block?: string
  category?: string
  coordinates?: string
  plot_status?: string
  customer_name: string
}

export interface DeceasedRecord {
  deceased_id: number
  lot_id: number
  dead_fullname: string
  dead_gender: string
  dead_citizenship?: string
  dead_civil_status?: string
  dead_relationship?: string
  dead_message?: string
  dead_bio?: string
  dead_profile_link?: string
  dead_interment: string
  dead_birth_date: string
  dead_date_death: string
  created_at: string
  updated_at: string
  block?: string
  category?: string
  niche_number?: string
}

export interface UpcomingAnniversary {
  deceased_id: number
  deceased_name: string
  death_date: string
  anniversary_date: string
  years_since: number
  days_until: number
  block?: string
  category?: string
  niche_number?: string
}

export interface UserDashboardData {
  connected_memorials: number
  active_lots: number
  upcoming_events: number
  notifications: number
  lots: LotRecord[]
  deceased_records: DeceasedRecord[]
  upcoming_anniversaries: UpcomingAnniversary[]
  customer_id?: number
}

export async function getUsers(params: { isAdmin?: number } = {}) {
  // backend may not have this endpoint yet; this follows the project pattern
  const res = await api.post('users/get_users.php', params)
  return res.data as {
    success: boolean
    message: string
    users: UserRecord[]
  }
}

export async function getUserDashboard() {
  const res = await api.post('users/get_user_dashboard.php')
  return res.data as {
    success: boolean
    message: string
    data: UserDashboardData
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
