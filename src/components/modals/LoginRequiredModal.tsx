import { LogIn } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Dialog as KonstaDialog, DialogButton } from 'konsta/react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { isAndroid } from '@/utils/platform.utils'

interface LoginRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  feature?: string
}

export default function LoginRequiredModal({ isOpen, onClose, feature = 'My Plots' }: LoginRequiredModalProps) {
  const navigate = useNavigate()

  const handleLogin = () => {
    onClose()
    navigate('/login')
  }

  const LoginRequiredContent = (
    <div className="space-y-4">
      <p>You need to sign in to access {feature}. Please log in with your property ID and password.</p>
    </div>
  )

  return (
    <>
      {isAndroid() ? (
        <KonstaDialog
          opened={isOpen}
          onBackdropClick={onClose}
          title="Login Required"
          content={LoginRequiredContent}
          buttons={[
            <DialogButton onClick={onClose} className="bg-black/20">
              Cancel
            </DialogButton>,
            <DialogButton strongIos onClick={handleLogin} className="bg-blue-400">
              Sign In
            </DialogButton>,
          ]}
        />
      ) : (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <LogIn className="h-5 w-5" />
                Login Required
              </DialogTitle>
              <DialogDescription>{LoginRequiredContent}</DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={onClose} className="sm:flex-1">
                Cancel
              </Button>
              <Button onClick={handleLogin} className="sm:flex-1">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
