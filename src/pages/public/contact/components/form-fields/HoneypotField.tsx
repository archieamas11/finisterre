import type { FormFieldProps } from '../../types'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export function HoneypotField({ form }: FormFieldProps) {
  return (
    <FormField
      control={form.control}
      name="honeypot"
      render={({ field }) => (
        <FormItem className="absolute left-[-9999px]">
          <FormControl>
            <Input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
