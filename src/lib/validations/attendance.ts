import { z } from 'zod'

export const createSessionSchema = z.object({
    session_date: z.string().min(1, 'Date is required'),
    session_time: z.string().min(1, 'Time is required'),
    is_retroactive: z.boolean().default(false),
})

export type CreateSessionData = z.infer<typeof createSessionSchema>

export const submitAttendanceSchema = z.object({
    status: z.enum(['Present', 'Late', 'Absent']),
    reason: z.string().optional()
}).refine((data) => {
    // If status is Late or Absent, reason becomes REQUIRED and must not be empty
    if ((data.status === 'Late' || data.status === 'Absent') && (!data.reason || data.reason.trim() === '')) {
        return false
    }
    return true
}, {
    message: "A reason is required when marking Late or Absent.",
    path: ['reason']
})

export type SubmitAttendanceData = z.infer<typeof submitAttendanceSchema>
