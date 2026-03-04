import { z } from 'zod'

export const classSchema = z.object({
  name: z.string().min(3, 'Class name must be at least 3 characters').max(100),
  degree_level: z.enum(['Bachelor', 'Master'], {
    message: 'Degree level must be Bachelor or Master',
  }),
  semester: z.string().min(1, 'Semester is required'),
  location_lat: z.coerce.number().min(-90).max(90).nullable(),
  location_lng: z.coerce.number().min(-180).max(180).nullable(),
  location_radius: z.coerce.number().int().min(10).max(500).default(50),
})

export type ClassFormData = z.infer<typeof classSchema>
