import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { LotOwners } from '@/types/interment.types'
import { editLotStatusById, type EditLotStatus } from '@/api/interment.api'

export function useEditLotStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updatedData: EditLotStatus) => editLotStatusById(updatedData),

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries({ queryKey: ['lotOwners'] })
      const previousLotOwners = queryClient.getQueryData<LotOwners[]>(['lotOwners'])
      queryClient.setQueryData<LotOwners[]>(['lotOwners'], (old) => {
        if (!old) return old
        return old.map((record) => (String(record.lot_id) === updatedData.lot_id ? { ...record, ...updatedData } : record))
      })
      return { previousLotOwners }
    },

    onError: (_err, _updatedData, context) => {
      if (context?.previousLotOwners) {
        queryClient.setQueryData(['lotOwners'], context.previousLotOwners)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lotOwners'] })
    },
  })
}
