export interface ActivityLog {
  log_id: string | number
  user_id: string | number
  action: string
  target: string
  details: string
  created_at: Date
}
