import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import type { MarkerType } from '@/types/map.types'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MarkerTypeSchema, type MarkerTypeFormData } from '@/schema/plot.scheme'

interface MarkerTypeStepProps {
  onCancel: () => void
  onContinue: (type: MarkerType) => void
}

export function MarkerTypeStep({ onCancel, onContinue }: MarkerTypeStepProps) {
  const form = useForm<MarkerTypeFormData>({
    resolver: zodResolver(MarkerTypeSchema),
    defaultValues: { markerType: undefined },
  })

  function onSubmit(data: MarkerTypeFormData) {
    onContinue(data.markerType)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="markerType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marker Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose marker type to add" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Serenity Lawn">🌿 Serenity Lawn</SelectItem>
                  <SelectItem value="Columbarium">🏺 Columbarium</SelectItem>
                  <SelectItem value="Memorial Chambers">🏛️ Memorial Chambers</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </Form>
  )
}
