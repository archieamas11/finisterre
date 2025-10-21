import type { AdminSearchResponse } from '@/types/search.types'

import { api } from './axiosInstance'

export async function adminSearch(search: string): Promise<AdminSearchResponse> {
  const res = await api.post('admin/admin_search.php', { search })
  return res.data
}
