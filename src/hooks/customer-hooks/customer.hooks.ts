import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

import type { Customer } from "@/api/customer.api";

import { createCustomer, getCustomers, editCustomer } from "@/api/customer.api";

export function useUpsertCustomer() {
  const qc = useQueryClient();
  return useMutation<Customer | any, Error, Partial<Customer>>({
    mutationFn: async (data) => {
      // Only call editCustomer if data.customer_id exists and is not undefined/null
      if ("customer_id" in data && data.customer_id !== undefined && data.customer_id !== null) {
        return await editCustomer(data as any);
      }
      return await createCustomer(data as any);
    },
    onSuccess: (_, variables) => {
      // Force refetch to ensure we have the latest data
      qc.invalidateQueries({ queryKey: ["customers"] });
      // If editing, also optimistically update the cache
      if ("customer_id" in variables && variables.customer_id) {
        qc.setQueryData<Customer[]>(["customers"], (oldData) => {
          if (!oldData) return oldData as any;

          return oldData.map((customer) => (customer.customer_id === variables.customer_id ? { ...customer, ...variables } : customer));
        });
      }
    },
  });
}

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const r = await getCustomers();
      return r.customers ?? [];
    },
  });
}
export { editCustomer };
