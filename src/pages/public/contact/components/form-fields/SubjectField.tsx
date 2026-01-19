import type { FormFieldProps, SubjectOption } from '../../types'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SUBJECT_OPTIONS } from '../../constants'

export function SubjectField({ form }: FormFieldProps) {
  return (
    <FormField
      control={form.control}
      name="subject"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-600">Subject</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="w-full border border-gray-400 dark:bg-transparent dark:text-gray-500 dark:hover:bg-white/50">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="border-white/50 bg-white text-gray-800">
              {SUBJECT_OPTIONS.map((option: SubjectOption) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
