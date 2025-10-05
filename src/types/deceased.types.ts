export interface DeceasedData {
  deceased_id: string | number
  lot_id: string | number
  dead_fullname: string
  dead_interment: string
  dead_birth_date: string
  dead_date_death: string
  created_at: Date
  updated_at: Date

  // Additional fields
  block: string | null
  category: string | null
  niche_number: string | null
}
