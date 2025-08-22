import { CalendarIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  error,
  className
}: {
  value?: string
  onChange: (date: string) => void
  placeholder?: string
  error?: boolean
  className?: string
}) {
  const [calendarOpen, setCalendarOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  )
  const [month, setMonth] = React.useState<Date | undefined>(selectedDate)

  function formatDateLocal(date?: Date) {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  React.useEffect(() => {
    if (value) {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        setSelectedDate(date)
        setMonth(date)
      }
    }
  }, [value])

  return (
    <div className='relative'>
      <div className='relative'>
        <Input
          onChange={(e) => {
            onChange(e.target.value)
            const date = new Date(e.target.value)
            if (!isNaN(date.getTime())) {
              setSelectedDate(date)
              setMonth(date)
            }
          }}
          placeholder={placeholder}
          value={value || ''}
          className={cn(
            error && 'border-destructive focus-visible:ring-destructive',
            className,
            'pr-8'
          )}
        />
        <Popover onOpenChange={setCalendarOpen} open={calendarOpen}>
          <PopoverTrigger asChild>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => setCalendarOpen(true)}
              className='absolute top-1/2 right-2 h-5 w-5 -translate-y-1/2 p-0'
            >
              <CalendarIcon className='h-4 w-4' />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className='w-auto overflow-hidden p-0'
            alignOffset={-8}
            sideOffset={10}
            align='end'
          >
            <Calendar
              onSelect={(date) => {
                setSelectedDate(date)
                setMonth(date)
                setCalendarOpen(false)
                onChange(formatDateLocal(date))
              }}
              captionLayout='dropdown'
              onMonthChange={setMonth}
              selected={selectedDate}
              mode='single'
              month={month}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
