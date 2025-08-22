import type { Table } from '@tanstack/react-table'

import React from 'react'

import type { DeceasedRecords } from '@/types/interment.types'

import { Checkbox } from '@/components/ui/checkbox'

type Props = {
  table: Table<DeceasedRecords>
}

export default function DeceasedSelectAllCheckbox({ table }: Props) {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (wrapperRef.current) {
      const input = wrapperRef.current.querySelector('input[type="checkbox"]')
      if (input instanceof HTMLInputElement) {
        const someSelected = table.getIsSomePageRowsSelected()
        const allSelected = table.getIsAllPageRowsSelected()
        input.indeterminate = someSelected && !allSelected
      }
    }
  }, [table])
  return (
    <div ref={wrapperRef}>
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        className='border-gray-500 dark:border-gray-600'
        checked={table.getIsAllPageRowsSelected()}
        aria-label='Select all'
      />
    </div>
  )
}
