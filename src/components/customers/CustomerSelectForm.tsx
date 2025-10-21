import type { Customer } from '@/api/customer.api'
import React from 'react'
import { Check, ChevronsUpDown, Save, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useCustomers } from '@/hooks/customer-hooks/customer.hooks'
import { cn } from '@/lib/utils'

export type CustomerSelectFormProps = {
  title?: string
  headingClassName?: string
  containerClassName?: string
  popoverWidthClass?: string
  initialSelectedCustomerId?: string
  isSaving?: boolean
  onCancel: () => void
  onSave: (customerId: string) => void
}

export default function CustomerSelectForm({
  title = 'Select Customer',
  headingClassName = '',
  containerClassName = '',
  popoverWidthClass = 'w-107',
  initialSelectedCustomerId,
  isSaving = false,
  onCancel,
  onSave,
}: CustomerSelectFormProps) {
  const { data: customers = [], isLoading } = useCustomers()
  const [comboOpen, setComboOpen] = React.useState(false)
  const [selectedId, setSelectedId] = React.useState<string>(initialSelectedCustomerId ?? '')

  function handleSelect(id: string) {
    setSelectedId(String(id))
    setComboOpen(false)
  }

  return (
    <div className={containerClassName}>
      <h4 className={headingClassName}>{title}</h4>
      <Popover onOpenChange={setComboOpen} open={comboOpen}>
        <PopoverTrigger asChild>
          <Button
            className="w-full justify-between"
            disabled={isLoading}
            aria-expanded={comboOpen}
            variant="outline"
            role="combobox"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedId
              ? (() => {
                  const c = customers.find((x: Customer) => String(x.customer_id) === String(selectedId))
                  return c ? `${c.first_name} ${c.last_name} | ID: ${c.customer_id}` : 'Select a customer'
                })()
              : isLoading
                ? 'Loading customers...'
                : 'Select a customer'}
            <ChevronsUpDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn(popoverWidthClass, 'p-0')}>
          <Command>
            <CommandInput placeholder="Search customer..." className="h-9" />
            <CommandList>
              <CommandEmpty>{isLoading ? 'Loading customers...' : 'No customer found.'}</CommandEmpty>
              <CommandGroup>
                {customers.map((c: Customer) => (
                  <CommandItem
                    value={`${c.first_name} ${c.last_name} ${c.customer_id}`}
                    onSelect={() => handleSelect(String(c.customer_id))}
                    key={c.customer_id}
                  >
                    {c.first_name} {c.last_name} | ID: {c.customer_id}
                    <Check className={cn('ml-auto h-4 w-4', String(selectedId) === String(c.customer_id) ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="mt-3 flex gap-2">
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onCancel()
          }}
          variant="destructive"
          size="sm"
          className="flex-1 leading-none"
        >
          <X className="mr-1 h-4 w-4" />
          Cancel
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation()
            if (selectedId) onSave(String(selectedId))
          }}
          disabled={isSaving || !selectedId}
          size="sm"
          className="flex-1 leading-none"
          variant={'default'}
        >
          <Save className="mr-1 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  )
}
