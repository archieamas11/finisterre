import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { createDeceasedRecord } from "../../api/deceased.api";
import { type DeceasedRecords } from "@/types/interment.types";

export function useCreateDeceasedRecord() {
  const qc = useQueryClient();
  return useMutation<DeceasedRecords, Error, Partial<DeceasedRecords>>({
    onSuccess: () => {
      console.log("🎉 Mutation successful, invalidating queries");
      // 🔄 Invalidate deceased records queries
      qc.invalidateQueries({ queryKey: ["deceased"] });
      // 🏛️ Invalidate niche queries to update popup data
      qc.invalidateQueries({ queryKey: ["niches"] });
    },
    onError: (error) => {
      console.error("💥 Mutation failed:", error);
    },
    mutationFn: async (data) => {
      console.log("🔄 Executing mutation with data:", data);
      return await createDeceasedRecord(data as DeceasedRecords);
    },
  });
}
