import type { ChangePasswordPayload } from '@/api/auth.api'
import { useMutation } from '@tanstack/react-query'

import { changePassword } from '@/api/auth.api'

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
  })
}
