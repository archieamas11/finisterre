import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { LotOwners } from '@/types/IntermentTypes';
import { createLotOwner, editLotOwner, getLotOwner  } from '@/api/LotOwnerApi';

// 1) Query for list
export function useLotOwners() {
  return useQuery({
    queryKey: ['lotOwners'],
    queryFn: () => getLotOwner().then(r => r.lotOwners),
  });
}

// 2) Mutation for add/edit
export function useUpsertLotOwner() {
  const qc = useQueryClient();
  return useMutation<LotOwners, Error, Partial<LotOwners>>({
    mutationFn: async (data) => {
      // Only call editLotOwner if data.lotOwner_id exists and is not undefined/null
      if ('lot_id' in data && data.lot_id !== undefined && data.lot_id !== null) {
        return await editLotOwner(data);
      }
      return await createLotOwner(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lotOwners'] });
    },
  });
}
