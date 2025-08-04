import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDeceasedRecords,
  editDeceasedRecords,
  getDeceasedRecords,
} from "@/api/deceased.api";
import type { DeceasedRecords } from "@/types/interment.types";

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

// 2) Mutation for add/edit
export function useUpsertDeceasedRecord() {
  const qc = useQueryClient();
  return useMutation<DeceasedRecords, Error, Partial<DeceasedRecords>>({
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["deceasedRecords"] });
    },
  });
}
