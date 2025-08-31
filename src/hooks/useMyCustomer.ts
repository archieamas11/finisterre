import { useQuery } from '@tanstack/react-query'

import { getCustomerById } from '@/api/customer.api'
import { useMe } from '@/hooks/useMe'

// Hook to fetch the logged-in user's related customer record (if any)
export function useMyCustomer() {
  const { user } = useMe()
  const customerId = user?.customerId ? String(user.customerId) : null

  const query = useQuery({
    enabled: !!customerId,
    queryKey: ['my-customer', customerId],
    queryFn: async () => {
      if (!customerId) return null
      const r = await getCustomerById(customerId)
      // get_customer.php returns { customers: [...] }
      const customer = Array.isArray(r.customers) ? (r.customers[0] ?? null) : null
      return customer
    },
  })

  return {
    customer: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
