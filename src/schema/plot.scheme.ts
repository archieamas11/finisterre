import z from 'zod'

export const MarkerTypeSchema = z.object({
  markerType: z.enum(['Serenity Lawn', 'Columbarium', 'Memorial Chambers'], {
    message: 'Please select a marker type',
  }),
})

export const SerenityLawnSchema = z.object({
  category: z.enum(['Bronze', 'Silver', 'Platinum', 'Diamond'], {
    message: 'Category is required',
  }),
  block: z.enum(['A', 'B', 'C', 'D'], {
    message: 'Block is required',
  }),
})

export const MemorialChambersSchema = z.object({
  rows: z.string().min(1, 'Rows is required'),
  columns: z.string().min(1, 'Columns is required'),
  block: z.string()
    .min(1, 'Cluster is required')
    .regex(/^[A-Za-z]+$/, 'Cluster name must only contain letters'),
})

export const ColumbariumSchema = z.object({
  rows: z.string().min(1, 'Rows is required'),
  columns: z.string().min(1, 'Columns is required'),
})

export type MarkerTypeFormData = z.infer<typeof MarkerTypeSchema>
export type SerenityLawnFormData = z.infer<typeof SerenityLawnSchema>
export type MemorialChambersFormData = z.infer<typeof MemorialChambersSchema>
export type ColumbariumFormData = z.infer<typeof ColumbariumSchema>
