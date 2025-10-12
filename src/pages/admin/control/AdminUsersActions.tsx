import { useState } from 'react'
import type { Row } from '@tanstack/react-table'
import type { UserData } from '@/types/user.types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Archive } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import AddNewUserDialog from './dialog/AddNewUserDialog'
import { useArchiveUser } from '@/hooks/user-hooks/useUsers'
import { toast } from 'sonner'

interface AdminUsersActionsProps {
  row: Row<UserData>
}

export default function AdminUsersActions({ row }: AdminUsersActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const archiveUserMutation = useArchiveUser()

  async function handleArchive() {
    if (!confirm(`Archive user ${row.original.username}?`)) return
    await toast.promise(archiveUserMutation.mutateAsync(row.original.user_id as number), {
      loading: 'Archiving user...',
      success: 'User archived successfully!',
      error: 'Failed to archive user. Please try again.',
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0" variant="ghost">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-50" align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>Edit User</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleArchive} className="text-red-600 hover:bg-red-100">
            <Archive className="mr-2 h-4 w-4 text-red-600" />
            Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <AddNewUserDialog
            mode="edit"
            user={{
              user_id: row.original.user_id as number,
              username: row.original.username,
              role: row.original.role as 'admin' | 'staff',
            }}
            onSuccess={() => setIsEditOpen(false)}
            onClose={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
