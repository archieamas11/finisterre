import { z } from 'zod'
import { PHONE_REGEX } from './constants'

export const formSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100, 'First name too long'),
  last_name: z.string().min(1, 'Last name is required').max(100, 'Last name too long'),
  email: z.string().email('Enter a valid email'),
  phone_number: z
    .string()
    .trim()
    .regex(PHONE_REGEX, 'Enter a valid phone number')
    .optional()
    .or(z.literal('')),
  subject: z.enum(['general', 'support', 'billing', 'other'], {
    message: 'Select a subject',
  }),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().optional(),
})