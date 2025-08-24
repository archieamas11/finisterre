import { ChevronsUpDown, Check as CheckIcon } from 'lucide-react'
import React from 'react'

import type { Customer } from '@/api/customer.api'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export default function CustomerSelect({ customers, value, onChange, disabled }: { customers: Customer[]; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  const [comboOpen, setComboOpen] = React.useState(false)
  const [comboValue, setComboValue] = React.useState<string>(String(value ?? ''))

  React.useEffect(() => {
    setComboValue(String(value ?? ''))
  }, [value])

  const selectedCustomer = customers.find((c) => String(c.customer_id) === comboValue)

  return (
    <Popover onOpenChange={disabled ? undefined : setComboOpen} open={comboOpen}>
      <PopoverTrigger asChild>
        <Button className="w-full justify-between" aria-expanded={comboOpen} disabled={disabled} variant="outline" role="combobox">
          {comboValue && selectedCustomer ? `${selectedCustomer.first_name} ${selectedCustomer.last_name} | ID: ${comboValue}` : 'Select a customer'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      {!disabled && (
        <PopoverContent className="w-full p-0 lg:w-80">
          <Command>
            <CommandInput placeholder="Search customer..." className="h-9" />
            <CommandList>
              <CommandEmpty>No customer found.</CommandEmpty>
              <CommandGroup>
                {customers.map((c) => (
                  <CommandItem
                    onSelect={() => {
                      const id = String(c.customer_id)
                      onChange(id)
                      setComboValue(id)
                      setComboOpen(false)
                    }}
                    value={String(c.customer_id)}
                    key={String(c.customer_id)}
                  >
                    {c.first_name} {c.last_name} | ID: {String(c.customer_id)}
                    <CheckIcon className={cn('ml-auto', comboValue === String(c.customer_id) ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  )
}
