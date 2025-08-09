import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

import type { plots } from "@/types/map.types";

import { createPlots, editPlots, getPlots } from "@/api/plots.api";

// 2) Mutation for create
export function useCreatePlots() {
  const qc = useQueryClient();
  return useMutation<plots, Error, Partial<plots>>({
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plots"] });
    },
    mutationFn: async (data) => {
      return await createPlots(data as plots);
    },
  });
}

// 3) Mutation for edit
export function useEditPlots() {
  const qc = useQueryClient();
  return useMutation<plots, Error, plots>({
    mutationFn: async (data) => {
      return await editPlots(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plots"] });
    },
  });
}

// 1) Query for list
export function usePlots() {
  return useQuery({
    queryKey: ["plots"],
    queryFn: async () => {
      const r = await getPlots();
      return r.plots ?? [];
    },
  });
}

export { editPlots, createPlots };
