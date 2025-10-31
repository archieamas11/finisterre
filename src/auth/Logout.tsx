import { useEffect } from 'react'

import Spinner from '@/components/ui/spinner'
import { useLogout } from '@/hooks/useLogout'

const Logout: React.FC<{
  showLoader?: boolean
  clearClientState?: () => void
}> = ({ showLoader = true, clearClientState }) => {
  const { performLogout, isPending } = useLogout()

  useEffect(() => {
    performLogout(clearClientState).catch((err) => {
      console.error('Logout component error:', err)
    })
  }, [clearClientState, performLogout])

  if (!showLoader) return null

  if (!isPending) return null

  return (
    <div className="flex h-screen w-full items-center justify-center" aria-live="polite" role="status">
      <Spinner />
    </div>
  )
}

export default Logout
