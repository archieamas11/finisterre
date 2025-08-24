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

export async function getUsers(params: { isAdmin?: number } = {}) {
  // backend may not have this endpoint yet; this follows the project pattern
  const res = await api.post('users/get_users.php', params)
  return res.data as {
    success: boolean
    message: string
    users: UserRecord[]
  }
}
