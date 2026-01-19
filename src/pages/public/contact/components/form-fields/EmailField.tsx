import type { FormFieldProps } from '../../types'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export function EmailField({ form }: FormFieldProps) {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-600">Email</FormLabel>
          <FormControl>
            <Input
              className="border border-gray-400 text-gray-600 dark:bg-transparent"
              placeholder="Enter your email"
              type="email"
              autoComplete="email"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
