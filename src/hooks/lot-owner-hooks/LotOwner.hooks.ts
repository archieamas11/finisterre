import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createLotOwner, editLotOwner, getLotOwner } from "@/api/lotOwner.api";
import type { LotOwners } from "@/types/interment.types";

// 1) Query for list
export function useLotOwners() {
  return useQuery({
    queryKey: ["lotOwners"],
    queryFn: async () => {
      const r = await getLotOwner();
      return r.lotOwners ?? [];
    },
  });
}

// 2) Mutation for add/edit
export function useUpsertLotOwner() {
  const qc = useQueryClient();
  return useMutation<LotOwners, Error, Partial<LotOwners>>({
    mutationFn: async (data) => {
      if (
        "lot_id" in data &&
        data.lot_id !== undefined &&
        data.lot_id !== null
      ) {
        return await editLotOwner(data);
      }
      return await createLotOwner(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lotOwners"] });
    },
  });
}
