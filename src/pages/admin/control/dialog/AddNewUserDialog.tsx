import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateUser, useUpdateUser } from '@/hooks/user-hooks/useUsers'

const createSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  role: z.enum(['admin', 'staff'], { message: 'Please select a role' }),
})

const editSchema = z.object({
  user_id: z.number(),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  role: z.enum(['admin', 'staff'], { message: 'Please select a role' }),
  password: z.string().min(4, 'Password must be at least 4 characters').optional().or(z.literal('')),
})

type CreateForm = z.infer<typeof createSchema>
type EditForm = z.infer<typeof editSchema>

type UpdatePayload = {
  user_id: number
  username: string
  role: 'admin' | 'staff'
  password?: string
}

interface AddNewUserDialogProps {
  onSuccess?: () => void
  onClose?: () => void
  mode?: 'create' | 'edit'
  user?: Partial<EditForm>
}

export default function AddNewUserDialog({ onSuccess, onClose, mode = 'create', user }: AddNewUserDialogProps) {
  const schema = mode === 'create' ? createSchema : editSchema

  const form = useForm<CreateForm | EditForm>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === 'create'
        ? { username: '', password: '', role: undefined }
        : { user_id: user?.user_id, username: user?.username ?? '', role: user?.role ?? undefined, password: '' },
  })

  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()

  async function onSubmit(values: CreateForm | EditForm) {
    try {
      if (mode === 'create') {
        await toast.promise(createUserMutation.mutateAsync(values as CreateForm), {
          loading: 'Creating user...',
          success: 'User created successfully!',
          error: 'Failed to create user. Please try again.',
        })
        form.reset()
        onSuccess?.()
        onClose?.()
      } else {
        // edit
        const editValues = values as EditForm
        const payload: UpdatePayload = {
          user_id: editValues.user_id,
          username: editValues.username,
          role: editValues.role,
        }
        if (editValues.password && editValues.password.trim() !== '') {
          payload.password = editValues.password
        }
        await toast.promise(updateUserMutation.mutateAsync(payload), {
          loading: 'Updating user...',
          success: 'User updated successfully!',
          error: 'Failed to update user. Please try again.',
        })
        onSuccess?.()
        onClose?.()
      }
    } catch (error) {
      // Error is already handled by the mutation's onError callback
      console.error('Form submission error:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter username" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {mode === 'create' && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {mode === 'edit' && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Leave blank to keep current password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{mode === 'create' ? 'Create User' : 'Save Changes'}</Button>
        </div>
      </form>
    </Form>
  )
}
