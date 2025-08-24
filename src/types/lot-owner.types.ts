export interface LotOwnerData {
  lot_id: string | number
  customer_id: string | number
  plot_id: string | number
  niche_number: number | null
  niche_status: 'available' | 'reserved' | 'occupied' | null
  lot_status: 'active' | 'completed' | 'cancelled'
  created_at: Date
  updated_at: Date
}
