import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import type { CustomerFormData } from '@/schema/customer.schema'

import { createCustomer, type Customer } from '@/api/customer.api'
import { Button } from '@/components/ui/button'
import CustomerForm from '@/pages/admin/interment/customer/CustomerForm'

export default function CreateCustomer() {
  const queryClient = useQueryClient()
  const [open, setOpen] = React.useState(false)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createCustomer,
  })

  const handleSubmit = async (data: CustomerFormData) => {
    try {
      // map form data to API Customer shape
      const payload: Partial<Customer> = {
        first_name: data.first_name,
        middle_name: data.middle_name || null,
        last_name: data.last_name,
        email: data.email,
        address: data.address,
        contact_number: data.contact_number,
        birth_date: data.birth_date || null,
        gender: data.gender,
        religion: data.religion || null,
        citizenship: data.citizenship || null,
        status: data.status,
        occupation: data.occupation || null,
      }

      const mutationPromise = mutateAsync(payload as Customer)
      toast.promise(mutationPromise, {
        loading: 'Saving customer...',
        success: 'Customer saved successfully',
      })
      await mutationPromise
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    } catch (error) {
      console.error('Customer creation failed:', error)
    }
  }

  return (
    <div className="items-right flex flex-row justify-end">
      <Button onClick={() => setOpen(true)} variant="outline" size="sm">
        <Plus />
        Add Customer
      </Button>
      <CustomerForm onOpenChange={setOpen} isPending={isPending} onSubmit={handleSubmit} open={open} mode="add" />
    </div>
  )
}
