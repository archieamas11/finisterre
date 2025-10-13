import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { DeceasedRecords } from '@/types/interment.types'
import { editDeceasedStatusById, type EditDeceasedStatus } from '@/api/interment.api'

export function useEditDeceasedStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updatedData: EditDeceasedStatus) => editDeceasedStatusById(updatedData),

    onMutate: async (updatedData) => {
      await queryClient.cancelQueries({ queryKey: ['deceased'] })
      const previousDeceased = queryClient.getQueryData<DeceasedRecords[]>(['deceased'])
      queryClient.setQueryData<DeceasedRecords[]>(['deceased'], (old) => {
        if (!old) return old
        return old.map((record) => (String(record.deceased_id) === updatedData.deceased_id ? { ...record, ...updatedData } : record))
      })
      return { previousDeceased }
    },

    onError: (_err, _updatedData, context) => {
      if (context?.previousDeceased) {
        queryClient.setQueryData(['deceased'], context.previousDeceased)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['deceased'] })
    },
  })
}
