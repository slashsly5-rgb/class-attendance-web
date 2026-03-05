import { z } from 'zod'

export const grantAccessSchema = z.object({
    sessionId: z.string().uuid("Invalid session ID"),
    studentIds: z.array(z.string().uuid("Invalid student ID")).min(1, "Please select at least one student."),
})

export type GrantAccessData = z.infer<typeof grantAccessSchema>
