export interface DeceasedData {
  deceased_id: string | number
  lot_id: string | number
  dead_fullname: string | null
  dead_gender: 'Male' | 'Female'
  dead_citizenship: string | null
  dead_civil_status: string | null
  dead_relationship: string | null
  dead_message: string | null
  dead_bio: string | null
  dead_profile_link: string | null
  dead_interment: string | null
  dead_birth_date: string | null
  dead_date_death: string | null
  created_at: Date | null
  updated_at: Date | null

  // Additional fields
  block: string | null
  category: string | null
  niche_number: string | null
}
