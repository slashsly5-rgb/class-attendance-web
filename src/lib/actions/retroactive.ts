'use server'

import { createClient } from '@/lib/supabase/server'
import { grantAccessSchema } from '@/lib/validations/retroactive'
import { revalidatePath } from 'next/cache'

export type RetroactiveActionState = {
    message?: string | null
    errors?: {
        studentIds?: string[]
        sessionId?: string[]
    }
}

export async function grantRetroactiveAccess(classId: string, prevState: RetroactiveActionState, formData: FormData): Promise<RetroactiveActionState> {
    // We expect studentIds to be passed as multiple identical keys in formData, e.g. studentIds=uuid1&studentIds=uuid2
    const studentIds = formData.getAll('studentIds') as string[]
    const sessionId = formData.get('sessionId') as string

    const validatedFields = grantAccessSchema.safeParse({
        sessionId,
        studentIds,
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid selection. Please try again.',
        }
    }

    const supabase = await createClient()

    // Map to db rows
    const inserts = validatedFields.data.studentIds.map(stId => ({
        session_id: validatedFields.data.sessionId,
        student_id: stId,
        used: false
    }))

    // Upsert or insert ignore - ON CONFLICT DO NOTHING handle
    // Assuming UNIQUE(session_id, student_id)
    const { error } = await supabase
        .from('retroactive_access')
        .upsert(inserts, { onConflict: 'session_id,student_id', ignoreDuplicates: true })

    if (error) {
        console.error('Failed to grant retroactive access:', error)
        return { message: 'Database error. Failed to grant access.' }
    }

    revalidatePath(`/lecturer/classes/${classId}/sessions/${sessionId}`)

    return {
        message: 'Access granted successfully!',
        errors: {} // Empty signifies success conceptually, but we can also use UI redirects/toast
    }
}

export async function getRetroactiveAccessBySession(sessionId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('retroactive_access')
        .select(`
            id,
            used,
            granted_at,
            students (
                id,
                full_name,
                student_id
            )
        `)
        .eq('session_id', sessionId)
        .order('granted_at', { ascending: false })

    if (error) {
        console.error('Failed to fetch retroactive passes:', error)
        return []
    }

    return data
}

export async function getStudentsWithoutAttendance(classId: string, sessionId: string) {
    const supabase = await createClient()

    // 1. Get all students enrolled in the class
    const { data: enrolledStudents, error: enrollError } = await supabase
        .from('enrollments')
        .select(`
            student_id,
            students (
                id,
                full_name,
                student_id
            )
        `)
        .eq('class_id', classId)

    if (enrollError || !enrolledStudents) return []

    // 2. Get students who ALREADY have an attendance record for this session
    const { data: records } = await supabase
        .from('attendance_records')
        .select('student_id')
        .eq('session_id', sessionId)

    const recordedStudentIds = new Set(records?.map(r => r.student_id) || [])

    // 3. Filter and return
    return enrolledStudents
        .map(e => e.students as any)
        .filter(s => s && !recordedStudentIds.has(s.id))
}
