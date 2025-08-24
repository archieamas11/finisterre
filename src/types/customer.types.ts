export interface CustomerData {
  customer_id: string | number
  lot_id: string | number
  first_name: string
  middle_name: string | null
  last_name: string
  fullname?: string
  email: string
  address: string
  contact_number: string
  birth_date: string
  gender: 'Male' | 'Female'
  religion: string
  citizenship: string
  status: string
  occupation: string
  isArchive: number
  created_at: Date
  updated_at: Date
}
