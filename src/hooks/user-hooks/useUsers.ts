import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { UserData } from '@/types/user.types'
import { getUsers, createUser, type CreateUserPayload, updateUser, archiveUser, type UpdateUserPayload } from '@/api/users.api'

export function useUsers(params: { isAdmin?: number } = {}) {
  return useQuery<UserData[]>({
    queryKey: ['users', params],
    queryFn: async () => {
      const response = await getUsers(params)
      return response.users ?? []
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['users'] })
        toast.success('User created successfully!')
      }
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const errorMessage = error?.response?.data?.message || 'Failed to create user. Please try again.'
      toast.error(errorMessage)
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(payload),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['users'] })
        queryClient.invalidateQueries({ queryKey: ['user', 'dashboard'] })
        toast.success('User updated successfully!')
      }
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update user. Please try again.'
      toast.error(errorMessage)
    },
  })
}

export function useArchiveUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (user_id: number) => archiveUser(user_id),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['users'] })
        queryClient.invalidateQueries({ queryKey: ['user', 'dashboard'] })
        toast.success('User archived successfully!')
      }
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const errorMessage = error?.response?.data?.message || 'Failed to archive user. Please try again.'
      toast.error(errorMessage)
    },
  })
}
