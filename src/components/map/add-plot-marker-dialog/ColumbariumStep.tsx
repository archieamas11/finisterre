import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ColumbariumSchema, type ColumbariumFormData } from '@/schema/plot.scheme'

import { useCreatePlotMutations } from './useCreatePlotMutations'

interface ColumbariumStepProps {
  coordinates: [number, number] | null
  onBack: () => void
  onCancel: () => void
  onDone: () => void
}

export function ColumbariumStep({ coordinates, onBack, onCancel, onDone }: ColumbariumStepProps) {
  const form = useForm<ColumbariumFormData>({
    resolver: zodResolver(ColumbariumSchema),
    defaultValues: { rows: '', columns: '' },
  })

  const { columbarium, submitColumbarium } = useCreatePlotMutations({ onDone })

  function onSubmit(data: ColumbariumFormData) {
    if (!coordinates) return
    const coordinatesString = `${coordinates[1]}, ${coordinates[0]}`
    submitColumbarium({ ...data, coordinates: coordinatesString })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="columns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rows</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter number of rows" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="rows"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Columns</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter number of columns" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={columbarium.isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={columbarium.isPending || !coordinates}>
            {columbarium.isPending ? 'Saving...' : 'Save Plot'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
