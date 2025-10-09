import { api } from './axiosInstance'

export interface ContactPayload {
  first_name: string
  last_name: string
  email: string
  phone_number?: string
  subject: 'general' | 'support' | 'billing' | 'other'
  message: string
}

export interface ContactResponse {
  success: boolean
  message: string
  error?: string
}

export async function sendContactMessage(payload: ContactPayload): Promise<ContactResponse> {
  const { data } = await api.post<ContactResponse>('send-mail.php', payload)
  return data
}
