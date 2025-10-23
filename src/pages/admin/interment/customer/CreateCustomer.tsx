import type { Customer } from '@/api/customer.api'
import type { CustomerFormData } from '@/schema/customer.schema'
import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SquarePlus } from 'lucide-react'
import { toast } from 'sonner'

import { createCustomer } from '@/api/customer.api'
import { Button } from '@/components/ui/button'
import CustomerForm from '@/pages/admin/interment/customer/dialog/CustomerForm'

export default function CreateCustomer() {
  const queryClient = useQueryClient()
  const [open, setOpen] = React.useState(false)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createCustomer,
  })

  const handleSubmit = async (data: CustomerFormData) => {
    try {
      const payload: Partial<Customer> = {
        first_name: data.first_name,
        middle_name: data.middle_name ?? '',
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
        success: (res) => {
          setOpen(false)
          return (res as { message: string }).message
        },
        error: (err) => (err as { message: string }).message,
      })
      await mutationPromise
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    } catch (error) {
      console.error('Customer creation failed:', error)
    }
  }

  return (
    <div className="items-right flex flex-row justify-end">
      <Button onClick={() => setOpen(true)} variant="outline" size="sm">
        <SquarePlus />
        Add Customer
      </Button>
      <CustomerForm onOpenChange={setOpen} isPending={isPending} onSubmit={handleSubmit} open={open} mode="add" />
    </div>
  )
}
