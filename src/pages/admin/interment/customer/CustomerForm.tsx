import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'

// no direct dependency on API Customer here; callers should map to CustomerFormData
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { DialogDescription, DialogContent, DialogHeader, DialogTitle, Dialog } from '@/components/ui/dialog'
import { FormControl, FormMessage, FormField, FormLabel, FormItem, Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectTrigger, SelectContent, SelectValue, SelectItem, Select } from '@/components/ui/select'
import { customerSchema, type CustomerFormData } from '@/schema/customer.schema'

export interface CustomerFormProps {
  open: boolean
  initialValues?: CustomerFormData
  isPending?: boolean
  mode: CustomerFormMode
  onOpenChange: (open: boolean) => void
  onSubmit: (values: CustomerFormData) => Promise<void> | void
}

export type CustomerFormMode = 'edit' | 'add'

export default function CustomerForm({ mode, open, onSubmit, isPending, onOpenChange, initialValues }: CustomerFormProps) {
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: (initialValues as CustomerFormData) || {
      email: '',
      gender: 'Male',
      status: 'Single',
      address: '',
      religion: '',
      last_name: '',
      first_name: '',
      birth_date: '',
      occupation: '',
      middle_name: undefined,
      citizenship: '',
      contact_number: '',
    },
  })

  // 🔄 Reset form when initialValues change (important for edit mode)
  React.useEffect(() => {
    if (initialValues && open) {
      form.reset(initialValues)
    }
  }, [form, initialValues, open])

  const handleSubmit = async (values: CustomerFormData) => {
    await onSubmit(values)
    if (mode === 'add') {
      form.reset()
    }
    onOpenChange(false)
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="lg:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Customer' : mode === 'edit' ? 'Edit Customer' : 'View Customer'}</DialogTitle>
          <DialogDescription>{mode === 'add' ? "Click save when you're done." : mode === 'edit' ? 'Edit customer details and save.' : 'View customer details.'}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      First Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="first_name"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter middle name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="middle_name"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Last Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="last_name"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Address<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="address"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Contact Number<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="contact_number"
              />
              <FormField
                control={form.control}
                name="birth_date"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Birth Date</FormLabel>
                    <DatePicker value={field.value} onChange={field.onChange} placeholder="Select birth date" error={!!fieldState.error} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Gender<span className="text-red-500">*</span>
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Religion<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter religion" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="religion"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Citizenship<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter citizenship" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="citizenship"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Occupation<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter occupation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="occupation"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="email"
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Status<span className="text-red-500">*</span>
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Separated">Separated</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                onClick={() => {
                  form.reset()
                }}
                disabled={isPending}
                variant="outline"
                type="button"
              >
                Clear
              </Button>
              <Button disabled={isPending} type="submit">
                {isPending ? (mode === 'add' ? 'Saving...' : 'Updating...') : mode === 'add' ? 'Save' : 'Update'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
