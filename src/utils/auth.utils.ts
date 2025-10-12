export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token')
}

export const getRole = (): 'admin' | 'staff' | 'user' | null => {
  return (localStorage.getItem('role') as 'admin' | 'staff' | 'user' | null) ?? null
}

export const logout = (): void => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
}

export const getToken = (): string | null => {
  return localStorage.getItem('token')
}
