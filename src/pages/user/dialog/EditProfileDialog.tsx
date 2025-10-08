import { zodResolver } from '@hookform/resolvers/zod'
import { memo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import type { Customer } from '@/api/customer.api'
import type { CustomerFormData } from '@/schema/customer.schema'

import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUpdateMyProfile } from '@/hooks/customer-hooks/useUpdateMyProfile'
import { customerSchema } from '@/schema/customer.schema'

interface EditProfileDialogProps {
  open: boolean
  customer: Customer | null
  onOpenChange: (open: boolean) => void
}

export default memo(function EditProfileDialog({ open, customer, onOpenChange }: EditProfileDialogProps) {
  const { mutateAsync, isPending } = useUpdateMyProfile()

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      first_name: '',
      middle_name: undefined,
      last_name: '',
      email: '',
      address: '',
      contact_number: '',
      birth_date: '',
      gender: 'Male',
      religion: '',
      citizenship: '',
      status: 'Single',
      occupation: '',
    },
  })

  // Reset form with customer data when dialog opens
  useEffect(() => {
    if (open && customer) {
      form.reset({
        first_name: customer.first_name || '',
        middle_name: customer.middle_name || undefined,
        last_name: customer.last_name || '',
        email: customer.email || '',
        address: customer.address || '',
        contact_number: customer.contact_number || '',
        birth_date: customer.birth_date ? String(customer.birth_date).slice(0, 10) : '',
        gender: (customer.gender === 'Female' ? 'Female' : 'Male') as CustomerFormData['gender'],
        religion: customer.religion || '',
        citizenship: customer.citizenship || '',
        status: (customer.status === 'Married'
          ? 'Married'
          : customer.status === 'Widowed'
            ? 'Widowed'
            : customer.status === 'Divorced'
              ? 'Divorced'
              : customer.status === 'Separated'
                ? 'Separated'
                : 'Single') as CustomerFormData['status'],
        occupation: customer.occupation || '',
      })
    }
  }, [open, customer, form])

  const handleSubmit = async (values: CustomerFormData) => {
    if (!customer?.customer_id) {
      toast.error('Unable to update profile: Customer ID not found')
      return
    }

    const payload: Partial<Customer> = {
      customer_id: customer.customer_id,
      first_name: values.first_name.trim(),
      middle_name: values.middle_name?.trim() || null,
      last_name: values.last_name.trim(),
      email: values.email.trim(),
      address: values.address.trim(),
      contact_number: values.contact_number.trim(),
      birth_date: values.birth_date || null,
      gender: values.gender,
      religion: values.religion?.trim() || null,
      citizenship: values.citizenship?.trim() || null,
      status: values.status,
      occupation: values.occupation?.trim() || null,
    }

    toast.promise(
      mutateAsync(payload).then((result) => {
        const typedResult = result as { success: boolean }
        if (typedResult.success) {
          onOpenChange(false)
        }
        return typedResult
      }),
      {
        loading: 'Updating profile...',
        success: 'Profile updated successfully!',
        error: 'Failed to update profile.',
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto lg:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your personal information and save changes.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="first_name"
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
              />
              <FormField
                control={form.control}
                name="middle_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter middle name" {...field} />
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
                    <FormLabel>
                      Last Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
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
              />
              <FormField
                control={form.control}
                name="contact_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Contact Number<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="09XXXXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
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
              />
              <FormField
                control={form.control}
                name="birth_date"
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
              <FormField
                control={form.control}
                name="religion"
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
              />
              <FormField
                control={form.control}
                name="citizenship"
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
              />
              <FormField
                control={form.control}
                name="occupation"
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
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button onClick={() => onOpenChange(false)} disabled={isPending} variant="outline" type="button">
                Cancel
              </Button>
              <Button disabled={isPending} type="submit">
                {isPending ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})
