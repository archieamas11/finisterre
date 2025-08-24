import { useQuery } from "@tanstack/react-query";

import { getCustomerById, getCustomers } from "@/api/customer.api";

export function useGetCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const r = await getCustomers();
      return r.customers ?? [];
    },
  });
}

export function useGetCustomersId(id: string) {
  return useQuery({
    enabled: !!id,
    queryKey: ["customer", id],
    queryFn: () => getCustomerById(id),
  });
}
