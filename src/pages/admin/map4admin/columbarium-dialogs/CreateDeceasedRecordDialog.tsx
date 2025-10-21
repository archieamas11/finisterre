import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import type { DeceasedRecords } from '@/types/interment.types'

import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export interface DeceasedDialogProps {
  open: boolean
  initialValues?: DeceasedRecords
  isPending?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: DeceasedRecords) => Promise<void> | void
}

const formSchema = z.object({
  dead_fullname: z.string().min(1, 'Name is required').min(3, 'Name must be at least 3 characters').max(50, 'Name must be less than 50 characters'),
  dead_birth_date: z.string().min(1, 'Birth date is required'),
  dead_date_death: z.string().min(1, 'Date of death is required'),
  dead_interment: z.string().min(1, 'Interment date is required'),
})

type FormData = z.infer<typeof formSchema>

export function CreateDeceasedRecordDialog({ open, onOpenChange, onSubmit: propOnSubmit, initialValues, isPending = false }: DeceasedDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dead_fullname: initialValues?.dead_fullname || '',
      dead_birth_date: initialValues?.dead_birth_date || '',
      dead_date_death: initialValues?.dead_date_death || '',
      dead_interment: initialValues?.dead_interment || '',
    },
  })

  const handleSubmit = async (values: FormData) => {
    try {
      const currentTime = new Date().toISOString()
      const deceasedId = `DEC_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      const payload = {
        lot_id: initialValues?.lot_id || '',
        deceased_id: deceasedId,
        dead_fullname: values.dead_fullname,
        full_name: values.dead_fullname,
        dead_birth_date: values.dead_birth_date,
        dead_date_death: values.dead_date_death,
        dead_interment: values.dead_interment,
        created_at: currentTime,
        updated_at: currentTime,
      }
      await propOnSubmit(payload)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>{'Create New Deceased Record'}</DialogTitle>
          <DialogDescription>{'Add a new deceased person record to the cemetery system.'}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mx-auto max-w-3xl space-y-8">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="dead_fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Full Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter deceased full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="dead_birth_date"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>
                        Birth Date<span className="text-red-500">*</span>
                      </FormLabel>
                      <DatePicker value={field.value} onChange={field.onChange} placeholder="Select birth date" error={!!fieldState.error} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="dead_date_death"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>
                        Date of Death<span className="text-red-500">*</span>
                      </FormLabel>
                      <DatePicker value={field.value} onChange={field.onChange} placeholder="Select date of death" error={!!fieldState.error} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="dead_interment"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>
                        Interment Date<span className="text-red-500">*</span>
                      </FormLabel>
                      <DatePicker value={field.value} onChange={field.onChange} placeholder="Select interment date" error={!!fieldState.error} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="min-w-[100px]">
                {isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Create Record'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
