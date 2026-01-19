import type { FormFieldProps } from '../../types'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

export function MessageField({ form }: FormFieldProps) {
  return (
    <FormField
      control={form.control}
      name="message"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-600">Message</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Please share how we can help you..."
              className="resize-none border border-gray-400 dark:bg-transparent dark:text-gray-500 dark:hover:bg-white/50"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
