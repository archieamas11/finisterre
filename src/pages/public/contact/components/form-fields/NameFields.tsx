import type { FormFieldProps } from '../../types'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export function NameFields({ form }: FormFieldProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="first_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-600">First name</FormLabel>
            <FormControl>
              <Input
                className="border border-gray-400 text-gray-600 dark:bg-transparent"
                placeholder="Enter your first name"
                autoComplete="given-name"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="last_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-600">Last name</FormLabel>
            <FormControl>
              <Input
                className="border border-gray-400 text-gray-600 dark:bg-transparent"
                placeholder="Enter your last name"
                autoComplete="family-name"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
