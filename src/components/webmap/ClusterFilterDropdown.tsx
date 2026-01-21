import type { WebMapContext } from '@/hooks/useNavigationContext'
import { useState } from 'react'
import { Actions, ActionsButton, ActionsGroup, ActionsLabel, Fab } from 'konsta/react'
import { Filter } from 'lucide-react'
import { BiBorderAll } from 'react-icons/bi'
import { FaRedo } from 'react-icons/fa'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { isNativePlatform } from '@/utils/platform.utils'

interface ClusterFilterDropdownProps {
  context: WebMapContext
  className?: string
}

export default function ClusterFilterDropdown({ context, className }: ClusterFilterDropdownProps) {
  if (!context) return null
  const FilterIcon = <Filter className="h-5 w-5" />

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

  if (isNativePlatform()) {
    return (
      <>
        <button className="no-long-press touch-manipulation" onClick={() => setActionsOpened(true)}>
          <Fab className="k-color-brand-green h-10" text="Filter" icon={FilterIcon} />
        </button>

        <Actions opened={actionsOpened} onBackdropClick={() => setActionsOpened(false)}>
          <ActionsGroup>
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
            <ActionsButton onClick={handleShowAll}>
              <BiBorderAll className="mr-2 inline" />
              Show All
            </ActionsButton>
            <ActionsButton onClick={handleReset}>
              <FaRedo className="mr-2 inline" />
              Reset
            </ActionsButton>
          </ActionsGroup>
          <ActionsGroup>
            <ActionsButton onClick={() => setActionsOpened(false)}>Cancel</ActionsButton>
          </ActionsGroup>
        </Actions>
      </>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className={`bg-background text-background-foreground hover:bg-background/80 shrink-0 rounded-lg text-xs sm:text-sm ${className || ''}`}
        >
          <Filter className="text-accent-foreground h-3 w-3 sm:h-4 sm:w-4" />
          <span>Filter</span>
          <ChevronDown className="h-4 w-4" />
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
