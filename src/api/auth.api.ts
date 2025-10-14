import { api } from './axiosInstance'

export interface LoginResponse {
  token?: string
  message: string
  success: boolean
  role?: 'admin' | 'staff' | 'user'
}

export async function loginUser(username: string, password: string, recaptcha_token?: string, honeypot?: string): Promise<LoginResponse> {
  try {
    const res = await api.post<LoginResponse>('auth/login.php', {
      username,
      password,
      recaptcha_token,
      honeypot,
    })
    return res.data
  } catch (error: unknown) {
    // Handle network errors or server errors (narrow unknown)
    const err = error as {
      response?: { data?: Record<string, unknown> }
      request?: unknown
    }
    if (err.response) {
      // Server responded with error status
      const msg = String(err.response.data?.message ?? 'Server error occurred')
      return { success: false, message: msg }
    }

    if (err.request) {
      // Request was made but no response received
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      }
    }

    return { success: false, message: 'An unexpected error occurred' }
  }
}

export async function resetPassword(username: string, newPassword: string) {
  const res = await api.post('auth/reset_password.php', {
    username,
    new_password: newPassword,
  })
  return res.data
}

export async function forgotPassword(username: string) {
  const res = await api.post('auth/forgot_password.php', {
    username,
  })
  return res.data
}

export interface ChangePasswordPayload {
  current_password: string
  new_password: string
}

export interface ChangePasswordResponse {
  success: boolean
  message: string
}

export async function changePassword(payload: ChangePasswordPayload): Promise<ChangePasswordResponse> {
  try {
    const res = await api.post<ChangePasswordResponse>('auth/change_password.php', payload)
    console.log('Change password response:', res.data)
    return res.data
  } catch (error) {
    console.error('Change password error:', error)
    const err = error as { response?: { data?: ChangePasswordResponse } }

    // If we have a structured response from the backend, use it
    if (err.response?.data) {
      return err.response.data
    }

    return {
      success: false,
      message: 'Failed to change password. Please try again.',
    }
  }
}

// Fetch current authenticated user (decoded from JWT)
export interface MeResponse {
  success: boolean
  message: string
  user?: {
    user_id: number | null
    customer_id?: number | null
    username: string | null
    role: 'admin' | 'staff' | 'user'
    iat: number | null
    exp: number | null
  }
}

export async function fetchMe(): Promise<MeResponse> {
  try {
    const res = await api.get<MeResponse>('auth/me.php')
    return res.data
  } catch (error) {
    const err = error as { response?: { data?: Record<string, unknown> } }
    const msg = String(err.response?.data?.message ?? 'Failed to fetch user')
    return { success: false, message: msg }
  }
}
