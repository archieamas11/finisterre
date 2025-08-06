import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

import type { DeceasedRecords } from "@/types/interment.types";

import {
  createDeceasedRecords,
  editDeceasedRecords,
  getDeceasedRecords,
} from "@/api/deceased.api";

// 2) Mutation for add/edit
export function useUpsertDeceasedRecord() {
  const qc = useQueryClient();
  return useMutation<DeceasedRecords, Error, Partial<DeceasedRecords>>({
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["deceasedRecords"] });
    },
    mutationFn: async (data) => {
      // Only call editCustomer if data.customer_id exists and is not undefined/null
      if (
        "customer_id" in data &&
        data.customer_id !== undefined &&
        data.customer_id !== null
      ) {
        return await editDeceasedRecords(data);
      }
      return await createDeceasedRecords(data);
    },
  });
}

// 1) Query for list
export function useDeceasedRecords() {
  return useQuery({
    queryKey: ["deceasedRecords"],
    queryFn: async () => {
      const r = await getDeceasedRecords();
      return r.deceased ?? [];
    },
  });
}
