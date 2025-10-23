import type { CreateUserPayload, UpdateUserPayload } from '@/api/users.api'
import type { UserData } from '@/types/user.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { archiveUser, createUser, getUsers, updateUser } from '@/api/users.api'

export function useUsers(params: { isAdmin?: number } = {}) {
  return useQuery<UserData[]>({
    queryKey: ['users', params],
    queryFn: async () => {
      const response = await getUsers(params)
      return response.users ?? []
    },
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.refetchQueries({ queryKey: ['users'] })
      }
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(payload),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.refetchQueries({ queryKey: ['users'] })
      }
    },
  })
}

export function useArchiveUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (user_id: number) => archiveUser(user_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
