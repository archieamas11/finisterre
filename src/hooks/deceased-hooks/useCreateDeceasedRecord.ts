import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { createDeceasedRecord } from "../../api/deceased.api";
import { type DeceasedRecords } from "@/types/interment.types";

export function useCreateDeceasedRecord() {
  const qc = useQueryClient();
  return useMutation<DeceasedRecords, Error, Partial<DeceasedRecords>>({
    onSuccess: (_, variables) => {
      console.log("🎉 Deceased record created successfully, invalidating queries");

      // 🔄 Invalidate deceased records queries
      qc.invalidateQueries({ queryKey: ["deceased"] });

      // 🗺️ Invalidate plots data to update marker colors from 'reserved' to 'occupied'
      qc.invalidateQueries({ queryKey: ["plots"], refetchType: "active" });

      // 🏛️ Invalidate niche queries to update popup data
      qc.invalidateQueries({ queryKey: ["niches"] });

      // 📊 Invalidate map stats to reflect occupied status changes
      qc.invalidateQueries({ queryKey: ["map-stats"] });
      qc.invalidateQueries({ queryKey: ["map-stats", "chambers"] });
      qc.invalidateQueries({ queryKey: ["map-stats", "serenity"] });

      // 📋 Invalidate specific plot details if we have plot_id
      if (variables.plot_id) {
        qc.invalidateQueries({ queryKey: ["plotDetails", variables.plot_id] });
      }
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
