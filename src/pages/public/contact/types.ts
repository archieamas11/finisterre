import type { LucideIcon } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type { z } from 'zod'

import type { formSchema } from './schema'

export type FormValues = z.infer<typeof formSchema>

export interface ContactFormProps {
  form: UseFormReturn<FormValues>
  onSubmit: (values: FormValues) => Promise<void>
}

export interface FormFieldProps {
  form: UseFormReturn<FormValues>
}

export interface BusinessHour {
  day: string
  time: string
}

export interface ContactMethod {
  id: string
  label: string
  value: string
  icon: LucideIcon
}

export interface ContactMethodItemProps {
  method: ContactMethod
}

export interface SubjectOption {
  value: string
  label: string
}
