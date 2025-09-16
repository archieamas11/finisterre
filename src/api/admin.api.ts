import { api } from './axiosInstance'
import type { AdminSearchResponse } from '@/types/search.types'

export async function adminSearch(search: string): Promise<AdminSearchResponse> {
  const res = await api.post('admin/admin_search.php', { search })
  return res.data
}
