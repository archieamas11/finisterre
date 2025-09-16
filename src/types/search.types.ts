export interface AdminSearchItem {
  lot_id: number
  plot_id: number
  niche_number: string | null
  customer_id: number | null
  customer_fullname: string | null
  deceased_ids: string | null // comma-separated ids
  deceased_names: string | null // comma-separated names
}

export interface AdminSearchResponse {
  success: boolean
  message?: string
  data?: AdminSearchItem[]
}
