import { z } from 'zod'

export const studentEnrollmentSchema = z.object({
    classCode: z.string().min(6, { message: 'Class code must be at least 6 characters.' }),
    fullName: z.string().min(2, { message: 'Full name is required.' }),
    studentId: z.string().min(4, { message: 'Student ID is required.' }),
})

export type StudentEnrollmentFormData = z.infer<typeof studentEnrollmentSchema>
