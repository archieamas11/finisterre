import React, { useEffect } from 'react'
// toast removed: kept UX in hook implementation

import Spinner from '@/components/ui/spinner'
import { useLogout } from '@/hooks/useLogout'

// The component version that automatically logs out when mounted
const Logout: React.FC<{
  redirectTo?: string
  showLoader?: boolean
  clearClientState?: () => void
}> = ({ redirectTo = '/', showLoader = true, clearClientState }) => {
  const [loading, setLoading] = React.useState(true)
  const { performLogout } = useLogout(redirectTo)

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await performLogout(clearClientState)
      } finally {
        setLoading(false)
      }
    }

    handleLogout()
  }, [performLogout, clearClientState])

  if (!loading || !showLoader) return null

  return (
    <div
      className='flex h-screen w-full items-center justify-center'
      aria-live='polite'
      role='status'
    >
      <Spinner />
    </div>
  )
}

export default Logout
