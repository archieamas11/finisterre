import type { NewsCategory, NewsStatus } from '@/types/news.types'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { createNews } from '@/api/news.api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

const newsCategories: NewsCategory[] = ['Announcement', 'Update', 'Event', 'Story']
const newsStatuses: NewsStatus[] = ['draft', 'scheduled', 'published', 'archived']

const createNewsSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must not exceed 200 characters'),
  slug: z.string().optional(),
  excerpt: z.string().max(300, 'Excerpt must not exceed 300 characters').optional(),
  content: z.string().optional(),
  category: z.enum(['Announcement', 'Update', 'Event', 'Story'] as const),
  status: z.enum(['draft', 'scheduled', 'published', 'archived'] as const),
  is_featured: z.boolean(),
  cover_image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  author: z.string().optional(),
  published_at: z.string().optional(),
})

type CreateNewsFormValues = z.infer<typeof createNewsSchema>

interface CreateNewsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateNewsDialog({ open, onOpenChange }: CreateNewsDialogProps) {
  const queryClient = useQueryClient()

  const form = useForm<CreateNewsFormValues>({
    resolver: zodResolver(createNewsSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'Announcement',
      status: 'draft',
      is_featured: false,
      cover_image: '',
      author: '',
      published_at: '',
    },
  })

  const { mutate: createNewsMutation, isPending } = useMutation({
    mutationFn: createNews,
    onSuccess: () => {
      toast.success('News created successfully!')
      void queryClient.invalidateQueries({ queryKey: ['news'] })
      form.reset()
      onOpenChange(false)
    },
    onError: () => {
      toast.error('Failed to create news')
    },
  })

  const onSubmit = React.useCallback(
    (values: CreateNewsFormValues) => {
      const payload = {
        ...values,
        slug: values.slug || undefined,
        excerpt: values.excerpt || undefined,
        content: values.content || undefined,
        cover_image: values.cover_image || undefined,
        author: values.author || undefined,
        published_at: values.published_at || undefined,
      }
      createNewsMutation(payload)
    },
    [createNewsMutation],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create News Article</DialogTitle>
          <DialogDescription>Fill in the details to create a new news article.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter news title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="auto-generated-slug" {...field} />
                    </FormControl>
                    <FormDescription>Leave empty to auto-generate from title</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Brief summary..." rows={2} {...field} />
                    </FormControl>
                    <FormDescription>Short summary displayed in cards (max 300 chars)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Full article content..." rows={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {newsCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {newsStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cover_image"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Cover Image URL</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Author name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="published_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publish Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormDescription>Leave empty for current date/time</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 sm:col-span-2">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured Article</FormLabel>
                      <FormDescription>Display this article prominently on the homepage</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create News'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
