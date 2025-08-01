import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCustomers, createCustomer, editCustomer } from "@/api/customer.api";
import type { Customer } from "@/types/interment.types";
import type { CustomerFormData } from "@/pages/admin/interment/customer/customer.validation";

// 1) Query for list
export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const r = await getCustomers();
      return r.customers ?? [];
    },
  });
}

// 2) Mutation for add/edit
export function useUpsertCustomer() {
  const qc = useQueryClient();
  return useMutation<Customer, Error, Partial<Customer>>({
    mutationFn: async (data) => {
      // Only call editCustomer if data.customer_id exists and is not undefined/null
      if (
        "customer_id" in data &&
        data.customer_id !== undefined &&
        data.customer_id !== null
      ) {
        return await editCustomer(data as CustomerFormData);
      }
      return await createCustomer(data as CustomerFormData);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}
export { editCustomer };
