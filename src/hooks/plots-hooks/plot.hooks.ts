import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPlots, createPlots, editPlots, getColPlots } from "@/api/plots.api";
import type { plots } from "@/types/map.types";

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

export function useColPlots() {
  return useQuery({
    queryKey: ["colPlots"],
    queryFn: async () => {
      const r = await getColPlots();
      return r.plots ?? [];
    },
  });
}

// 2) Mutation for create
export function useCreatePlots() {
  const qc = useQueryClient();
  return useMutation<plots, Error, Partial<plots>>({
    mutationFn: async (data) => {
      return await createPlots(data as plots);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plots"] });
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

export { editPlots, createPlots };
