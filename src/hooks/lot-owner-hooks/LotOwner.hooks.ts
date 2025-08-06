import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

import type { LotOwners } from "@/types/interment.types";

import { createLotOwner, editLotOwner, getLotOwner } from "@/api/lotOwner.api";

// 2) Mutation for add/edit
export function useUpsertLotOwner() {
  const qc = useQueryClient();
  return useMutation<LotOwners, Error, Partial<LotOwners>>({
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lotOwners"] });
    },
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
  });
}

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
