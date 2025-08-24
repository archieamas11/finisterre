import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createLotOwner } from "@/api/lotOwner.api";

export function useCreateLotOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLotOwner,
    onSuccess: async (_, variables) => {
      console.log("🎯 Lot owner created successfully, invalidating queries...");

      // 🔄 Force immediate invalidation of plots data to update marker colors
      await queryClient.invalidateQueries({
        queryKey: ["plots"],
        refetchType: "active", // Force immediate refetch
      });

      // 🔄 Invalidate plot details for the specific plot
      if (variables.plot_id) {
        await queryClient.invalidateQueries({
          queryKey: ["plotDetails", variables.plot_id],
          refetchType: "active",
        });
      }

      // 📊 Invalidate map stats to reflect ownership changes
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["map-stats"] }),
        queryClient.invalidateQueries({ queryKey: ["map-stats", "chambers"] }),
        queryClient.invalidateQueries({ queryKey: ["map-stats", "serenity"] }),
        queryClient.invalidateQueries({ queryKey: ["lotOwners"] }),
      ]);

      console.log("✅ All plot-related queries invalidated");
    },
    onError: (error) => {
      console.error("❌ Failed to create lot owner:", error);
    },
  });
}
