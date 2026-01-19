import type { FormFieldProps } from '../../types'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export function PhoneField({ form }: FormFieldProps) {
  return (
    <FormField
      control={form.control}
      name="phone_number"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-600">Phone number (optional)</FormLabel>
          <FormControl>
            <Input
              className="border border-gray-400 dark:bg-transparent dark:text-gray-500"
              placeholder="e.g. +63 912 345 6789"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
