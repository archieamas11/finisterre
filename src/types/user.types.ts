export interface UserData {
  user_id: number | string
  customer_id: number | string | null
  username: string
  role: 'admin' | 'staff' | 'user'
  isArchive?: number
  created_at: Date
  updated_at: Date
}
