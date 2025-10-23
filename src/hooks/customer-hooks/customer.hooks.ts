import type { Customer } from '@/api/customer.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { archiveCustomer, createCustomer, editCustomer, getCustomers } from '@/api/customer.api'

export function useUpsertCustomer() {
  const qc = useQueryClient()
  return useMutation<Customer | unknown, Error, Partial<Customer>>({
    mutationFn: async (data) => {
      if ('customer_id' in data && data.customer_id !== undefined && data.customer_id !== null) {
        return await editCustomer({
          ...data,
          customer_id: data.customer_id ?? '',
        } as Customer)
      }
      return await createCustomer({
        ...data,
        customer_id: data.customer_id ?? '',
      } as Customer)
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['customers'] })
      if ('customer_id' in variables && variables.customer_id) {
        qc.setQueryData<Customer[]>(['customers'], (oldData) => {
          if (!oldData) return []

          return oldData.map((customer) => (customer.customer_id === variables.customer_id ? { ...customer, ...variables } : customer))
        })
      }
    },
  })
}

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const r = await getCustomers()
      return r.customers ?? []
    },
  })
}

export function useArchiveCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (customer_id: string) => archiveCustomer(customer_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}
export { editCustomer }
