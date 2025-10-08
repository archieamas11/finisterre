import { useMutation } from '@tanstack/react-query'

import type { ChangePasswordPayload } from '@/api/auth.api'

import { changePassword } from '@/api/auth.api'

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
  })
}
