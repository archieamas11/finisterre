import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ImportIcon } from 'lucide-react'

interface ImportFileButtonProps {
  onFileSelect?: (file: File) => void
  className?: string
  label?: string
  icon?: boolean
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  accept?: string
}

export function ImportFileButton({
  onFileSelect,
  className,
  label = 'Import',
  icon = true,
  size = 'sm',
  variant = 'outline',
  accept = '.xlsx,.xls',
}: ImportFileButtonProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleClick = () => fileInputRef.current?.click()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onFileSelect) onFileSelect(file)
  }

  return (
    <div className={cn('inline-flex items-center', className)}>
      <input type="file" ref={fileInputRef} accept={accept} onChange={handleFileChange} className="hidden" />
      <Button size={size} variant={variant} onClick={handleClick}>
        {icon && <ImportIcon className="h-4 w-4" />}
        {label}
      </Button>
    </div>
  )
}
