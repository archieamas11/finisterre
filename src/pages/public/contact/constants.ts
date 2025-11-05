import { MessageCircle, Phone, PhoneCall, Voicemail } from 'lucide-react'

export const SUBJECT_OPTIONS = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'support', label: 'Support' },
  { value: 'billing', label: 'Billing' },
  { value: 'other', label: 'Other' },
]

export const BUSINESS_HOURS = [
  { day: 'Monday - Friday', time: '8:00 AM – 5:00 PM' },
  { day: 'Saturday', time: '8:00 AM – 12:00 PM' },
  { day: 'Sunday & Holidays', time: 'By Appointment' },
]

export const CONTACT_METHODS = [
  { id: 'messenger', label: 'Messenger', value: 'm.me/finisterregardenz', icon: MessageCircle },
  { id: 'viber', label: 'Viber', value: '+63 998 841 1173', icon: PhoneCall },
  { id: 'mobile', label: 'Mobile', value: '+63 917 621 6823', icon: Phone },
  { id: 'landline', label: 'Landline', value: '407 3099 | 254 3065', icon: Voicemail },
]
