import type { Customer } from '@/api/customer.api'
import type { CustomerFormData } from '@/schema/customer.schema'
import { toast } from 'sonner'

import { useUpsertCustomer } from '@/hooks/customer-hooks/customer.hooks'
import CustomerForm from '@/pages/admin/interment/customer/dialog/CustomerForm'

interface EditCustomerDialogProps {
  open: boolean
  customer: Customer
  onOpenChange: (open: boolean) => void
}

export default function EditCustomerDialog({ open, customer, onOpenChange }: EditCustomerDialogProps) {
  const { isPending, mutateAsync } = useUpsertCustomer()

  async function handleSubmit(values: CustomerFormData) {
    const payload = {
      gender: String(values.gender),
      status: String(values.status),
      email: values.email.trim(),
      address: values.address.trim(),
      customer_id: customer.customer_id as string,
      last_name: values.last_name.trim(),
      first_name: values.first_name.trim(),
      occupation: values.occupation?.trim() || null,
      citizenship: values.citizenship?.trim() || null,
      religion: values.religion?.trim() || null,
      contact_number: values.contact_number.trim(),
      middle_name: values.middle_name?.trim() || null,
      birth_date: values.birth_date ? new Date(values.birth_date).toISOString().slice(0, 10) : null,
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
        loading: 'Updating customer...',
        success: 'Customer updated successfully!',
        error: (err) => err.message,
      },
    )
  }

  const initialValues: CustomerFormData = {
    email: customer.email || '',
    address: customer.address || '',
    middle_name: customer.middle_name || undefined,
    gender: (customer.gender === 'Female' ? 'Female' : 'Male') as CustomerFormData['gender'],
    religion: customer.religion || '',
    last_name: customer.last_name || '',
    status: (customer.status === 'Married'
      ? 'Married'
      : customer.status === 'Widowed'
        ? 'Widowed'
        : customer.status === 'Divorced'
          ? 'Divorced'
          : customer.status === 'Separated'
            ? 'Separated'
            : 'Single') as CustomerFormData['status'],
    first_name: customer.first_name || '',
    occupation: customer.occupation || '',
    citizenship: customer.citizenship || '',
    contact_number: customer.contact_number || '',
    birth_date: customer.birth_date ? String(customer.birth_date).slice(0, 10) : '',
  }

  return (
    <CustomerForm initialValues={initialValues} onOpenChange={onOpenChange} onSubmit={handleSubmit} isPending={isPending} mode="edit" open={open} />
  )
}
