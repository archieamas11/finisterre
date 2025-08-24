import { useQuery } from '@tanstack/react-query'

import { getLotOwnerById, getLotOwner } from '@/api/lotOwner.api'

export function useGetLotOwner() {
  return useQuery({
    queryKey: ['lotOwners'],
    queryFn: async () => {
      const r = await getLotOwner()
      return r.lotOwners ?? []
    },
  })
}

export function useGetLotOwnerId(id: string) {
  return useQuery({
    enabled: !!id,
    queryKey: ['lotOwner', id],
    queryFn: () => getLotOwnerById(id),
  })
}
