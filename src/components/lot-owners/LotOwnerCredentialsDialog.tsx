import { useRef } from 'react'
import { InfoIcon, KeyIcon, PrinterIcon } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useReactToPrint } from 'react-to-print'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export type LotOwnerCredentials = {
  customer_id: string
  first_name: string
  last_name: string
  email?: string
  contact_number?: string
  plot_id: string
  plot_category?: string
  username?: string
  password?: string
  lot_id: string
}

interface LotOwnerCredentialsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  credentials: LotOwnerCredentials | null
}

export default function LotOwnerCredentialsDialog({ open, onOpenChange, credentials }: LotOwnerCredentialsDialogProps) {
  const printContentRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: printContentRef,
  })

  // Handle keyboard shortcuts
  // Enter -> Print, Escape -> Close
  useHotkeys(
    'enter',
    (event) => {
      if (!open) return
      event.preventDefault()
      handlePrint()
    },
    { enabled: open, enableOnFormTags: true },
    [open, handlePrint],
  )

  useHotkeys(
    'escape',
    (event) => {
      if (!open) return
      event.preventDefault()
      onOpenChange(false)
    },
    { enabled: open, enableOnFormTags: true },
    [open, onOpenChange],
  )

  // Don't render if no credentials at all
  if (!credentials) {
    console.log('Dialog not rendering - no credentials provided')
    return null
  }

  const fullName = `${credentials.first_name} ${credentials.last_name}`
  const hasLoginCredentials = !!(credentials.username && credentials.password)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto" showCloseButton={false}>
        <div ref={printContentRef} className="space-y-4 px-2">
          {/* Header for Print and Screen */}
          <div className="border-b pb-4 text-center">
            <h1 className="text-3xl font-bold">Finisterre Gardenz</h1>
            <p className="text-muted-foreground mt-1 text-sm">Lot Ownership Receipt</p>
            <p className="text-muted-foreground mt-2 text-xs">
              Date: {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
            </p>
          </div>

          {/* Customer Details Section */}
          <div className="space-y-2">
            <h3 className="text-muted-foreground border-b pb-2 text-sm font-semibold tracking-wide uppercase">Customer Information</h3>
            <div className="space-y-1.5 text-sm">
              <ReceiptRow label="Customer ID" value={credentials.customer_id} />
              <ReceiptRow label="Full Name" value={fullName} bold />
              {credentials.email && <ReceiptRow label="Email" value={credentials.email} />}
              {credentials.contact_number && <ReceiptRow label="Contact" value={credentials.contact_number} />}
            </div>
          </div>

          <div className="border-t border-dashed" />

          {/* Plot Information Section */}
          <div className="space-y-2">
            <h3 className="text-muted-foreground border-b pb-2 text-sm font-semibold tracking-wide uppercase">Property Details</h3>
            <div className="space-y-1.5 text-sm">
              <ReceiptRow label="Lot ID" value={credentials.lot_id} bold />
              <ReceiptRow label="Location" value={`${credentials.plot_category || 'N/A'} • ${credentials.plot_id}`} />
            </div>
          </div>

          <div className="border-t border-dashed" />

          {/* Login Guide Section - Only show if new credentials were created */}
          {hasLoginCredentials && (
            <>
              <div className="space-y-2">
                <h3 className="text-muted-foreground flex items-center gap-2 border-b pb-2 text-sm font-semibold tracking-wide uppercase">
                  <InfoIcon className="h-4 w-4" />
                  Account Access Guide
                </h3>
                <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                  <CardContent className="pt-4 pb-4">
                    <div className="space-y-3 text-xs">
                      <div>
                        <p className="mb-2 font-semibold text-blue-900 dark:text-blue-100">How to Access Your Account:</p>
                        <ol className="list-inside list-decimal space-y-1 pl-1 text-blue-800 dark:text-blue-200">
                          <li>
                            Visit{' '}
                            <span className="rounded bg-blue-100 px-1 font-mono font-semibold dark:bg-blue-900">
                              https://www.finisterre.site/login
                            </span>
                          </li>
                          <li>Enter your username and password above</li>
                          <li>Change your password immediately after first login</li>
                        </ol>
                      </div>
                      <div className="border-t border-blue-200 pt-2 dark:border-blue-800">
                        <p className="mb-2 font-semibold text-blue-900 dark:text-blue-100">Dashboard Features:</p>
                        <ul className="list-inside list-disc space-y-0.5 pl-1 text-blue-800 dark:text-blue-200">
                          <li>View plot and lot information</li>
                          <li>Access deceased records</li>
                          <li>Update contact information</li>
                          <li>View & navigate your plots location</li>
                          <li>View exclusive promotion and events</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="border-t border-dashed" />

              {/* Login Credentials Section */}
              <div className="space-y-2">
                <h3 className="text-muted-foreground flex items-center gap-2 border-b pb-2 text-sm font-semibold tracking-wide uppercase">
                  <KeyIcon className="h-4 w-4" />
                  Account Credentials
                </h3>
                <div className="space-y-3 rounded border border-yellow-300 bg-yellow-50 p-4 dark:border-yellow-700 dark:bg-yellow-950">
                  <p className="flex items-start gap-2 text-xs font-medium text-yellow-800 dark:text-yellow-200">
                    <span>⚠️</span>
                    <span>Please keep these credentials secure and change the password after first login.</span>
                  </p>
                  <div className="space-y-2">
                    <CredentialRow label="Username" value={credentials.username!} />
                    <CredentialRow label="Password" value={credentials.password!} />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Message for existing users */}
          {!hasLoginCredentials && (
            <div className="space-y-2">
              <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:border-green-800 dark:from-green-950 dark:to-emerald-950">
                <CardContent className="pt-6 pb-6">
                  <div className="space-y-3 text-center">
                    <div className="text-4xl">🎉</div>
                    <div>
                      <p className="text-lg font-semibold text-green-900 dark:text-green-100">Thank You for Your Purchase!</p>
                      <p className="mt-2 text-sm text-green-800 dark:text-green-200">
                        We appreciate your continued trust in Finisterre Memorial Park.
                      </p>
                      <p className="mt-1 text-xs text-green-700 dark:text-green-300">You can access this property through your existing account.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="text-muted-foreground mt-6 hidden border-t pt-4 text-center text-xs print:block">
            <p>
              Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
            <p className="mt-1">For assistance, please contact our office.</p>
          </div>
        </div>

        <div className="flex gap-3 border-t pt-2 print:hidden">
          <Button onClick={handlePrint} variant="outline" className="flex-1">
            <PrinterIcon className="mr-2 h-4 w-4" />
            Print Summary
            <kbd className="bg-muted text-muted-foreground pointer-events-none ml-auto inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
              <span className="text-xs">↵</span>
            </kbd>
          </Button>
          <Button onClick={() => onOpenChange(false)} className="flex-1">
            Close
            <kbd className="bg-muted pointer-events-none ml-auto inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
              <span className="text-xs">Esc</span>
            </kbd>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ReceiptRow({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">{label}:</span>
      <span className={cn('text-right', bold && 'font-semibold')}>{value}</span>
    </div>
  )
}

function CredentialRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1 rounded bg-white p-3 dark:bg-gray-900">
      <div className="text-muted-foreground text-xs font-medium">{label}</div>
      <div className="font-mono text-lg font-bold tracking-wide">{value}</div>
    </div>
  )
}
