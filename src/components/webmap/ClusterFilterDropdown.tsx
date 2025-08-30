import { Filter } from 'lucide-react'
import { BiBorderAll } from 'react-icons/bi'
import { FaRedo } from 'react-icons/fa'
import { isAndroid } from '@/utils/platform.utils'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Actions, ActionsGroup, ActionsLabel, ActionsButton, Fab } from 'konsta/react'
import type { WebMapContext } from '@/hooks/useNavigationContext'

interface ClusterFilterDropdownProps {
  context: WebMapContext
  className?: string
}

export default function ClusterFilterDropdown({ context, className }: ClusterFilterDropdownProps) {
  if (!context) return null
  const FilterIcon = <Filter className="h-6 w-6" />

  const { availableGroups, selectedGroups, toggleGroupSelection, clearSearch, resetGroupSelection } = context
  const [actionsOpened, setActionsOpened] = useState(false)

  const handleShowAll = () => {
    availableGroups.forEach((group) => {
      if (!selectedGroups.has(group.key)) {
        toggleGroupSelection(group.key)
      }
    })
    setActionsOpened(false)
  }

  const handleReset = () => {
    clearSearch()
    resetGroupSelection()
    setActionsOpened(false)
  }

  if (isAndroid()) {
    return (
      <>
        <button className="bg-transparent" onClick={() => setActionsOpened(true)}>
          <Fab className="k-color-brand-green h-10" text="Filter" icon={FilterIcon} />
        </button>

        <Actions opened={actionsOpened} onBackdropClick={() => setActionsOpened(false)} className="transition-none">
          <ActionsGroup className="transition-none">
            <ActionsLabel>Filter Options</ActionsLabel>
            {availableGroups.map((group) => (
              <ActionsButton
                key={group.key}
                bold={selectedGroups.has(group.key)}
                onClick={() => {
                  toggleGroupSelection(group.key)
                  setActionsOpened(false)
                }}
              >
                {group.label} ({group.count})
              </ActionsButton>
            ))}
            <ActionsButton onClick={handleShowAll} className="active:scale-100 active:duration-0" colors={{ activeBgIos: '', activeBgMaterial: '' }}>
              <BiBorderAll className="mr-2 inline" />
              Show All
            </ActionsButton>
            <ActionsButton onClick={handleReset} className="active:scale-100 active:duration-0" colors={{ activeBgIos: '', activeBgMaterial: '' }}>
              <FaRedo className="mr-2 inline" />
              Reset
            </ActionsButton>
          </ActionsGroup>
          <ActionsGroup className="transition-none">
            <ActionsButton onClick={() => setActionsOpened(false)} className="active:scale-100 active:duration-0" colors={{ activeBgIos: '', activeBgMaterial: '' }}>
              Cancel
            </ActionsButton>
          </ActionsGroup>
        </Actions>
      </>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" className={`bg-background shrink-0 rounded-full text-xs sm:text-sm ${className || ''}`}>
          <Filter className="text-accent-foreground h-3 w-3 sm:h-4 sm:w-4" />
          <span>Filter</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableGroups.map((group) => (
          <DropdownMenuCheckboxItem key={group.key} checked={selectedGroups.has(group.key)} onCheckedChange={() => toggleGroupSelection(group.key)}>
            {group.label} ({group.count})
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <div className="flex w-full gap-2">
          <div className="flex-1">
            <DropdownMenuItem className="w-full" onClick={handleShowAll}>
              <BiBorderAll />
              <span>Show All</span>
            </DropdownMenuItem>
          </div>
          <div className="flex-1">
            <DropdownMenuItem className="w-full" onClick={handleReset}>
              <FaRedo />
              <span>Reset</span>
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
