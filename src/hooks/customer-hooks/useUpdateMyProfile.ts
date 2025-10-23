import type { Customer } from '@/api/customer.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { editCustomer } from '@/api/customer.api'

export function useUpdateMyProfile() {
  const queryClient = useQueryClient()

  return useMutation<Customer | unknown, Error, Partial<Customer>>({
    mutationFn: async (data) => {
      return await editCustomer(data as Customer)
    },
    onSuccess: (_, variables) => {
      if (variables.customer_id) {
        queryClient.invalidateQueries({ queryKey: ['my-customer', String(variables.customer_id)] })
      }
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}
