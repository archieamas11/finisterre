import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editLotOwner } from "@/api/lotOwner.api";
import { type LotOwners } from "@/types/interment.types";

export function useEditLotOwner() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (updatedData: Partial<LotOwners>) => editLotOwner(updatedData),

        // Optimistic update
        onMutate: async (updatedData) => {
            await queryClient.cancelQueries({ queryKey: ["lotOwner"] });

            const prevData = queryClient.getQueryData<LotOwners[]>(["lotOwner"]);

            queryClient.setQueryData<LotOwners[]>(["lotOwner"], (old) =>
                old
                    ? old.map((lot) =>
                        lot.lot_id === updatedData.lot_id ? { ...lot, ...updatedData } : lot
                    )
                    : []
            );

            return { prevData };
        },

        onError: (_err, _updatedData, context) => {
            if (context?.prevData) {
                queryClient.setQueryData(["lotOwner"], context.prevData);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["lotOwner"] });
        },
    });
}
