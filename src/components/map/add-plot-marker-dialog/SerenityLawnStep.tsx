import type { SerenityLawnFormData } from '@/schema/plot.scheme'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SerenityLawnSchema } from '@/schema/plot.scheme'
import { useCreatePlotMutations } from './useCreatePlotMutations'

interface SerenityLawnStepProps {
  coordinates: [number, number] | null
  onBack: () => void
  onCancel: () => void
  onDone: () => void
}

export function SerenityLawnStep({ coordinates, onBack, onCancel, onDone }: SerenityLawnStepProps) {
  const form = useForm<SerenityLawnFormData>({
    resolver: zodResolver(SerenityLawnSchema),
    defaultValues: { category: undefined, block: undefined },
  })

  const { serenity, submitSerenity } = useCreatePlotMutations({ onDone })

  function onSubmit(data: SerenityLawnFormData) {
    if (!coordinates) return
    const coordinatesString = `${coordinates[1]}, ${coordinates[0]}`
    submitSerenity({ ...data, coordinates: coordinatesString })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ''}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Bronze">🥉 Bronze</SelectItem>
                      <SelectItem value="Silver">🥈 Silver</SelectItem>
                      <SelectItem value="Platinum">⚪ Platinum</SelectItem>
                      <SelectItem value="Diamond">💎 Diamond</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="block"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Block</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ''}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select block" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="A">Block A</SelectItem>
                      <SelectItem value="B">Block B</SelectItem>
                      <SelectItem value="C">Block C</SelectItem>
                      <SelectItem value="D">Block D</SelectItem>
                    </SelectContent>
                  </Select>
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
          <Button type="button" variant="outline" onClick={onCancel} disabled={serenity.isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={serenity.isPending || !coordinates}>
            {serenity.isPending ? 'Saving...' : 'Save Plot'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
