'use server'

import { createSessionSchema, submitAttendanceSchema } from '@/lib/validations/attendance'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type SessionState = {
    message?: string | null
    errors?: {
        session_date?: string[]
        session_time?: string[]
        is_retroactive?: string[]
    }
}

export async function createSession(classId: string, prevState: SessionState, formData: FormData): Promise<SessionState> {
    // Validate input
    const validatedFields = createSessionSchema.safeParse({
        session_date: formData.get('session_date'),
        session_time: formData.get('session_time'),
        is_retroactive: formData.get('is_retroactive') === 'on',
    })

    // Return early if form data is invalid
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing or invalid fields. Failed to create session.',
        }
    }

    const { session_date, session_time, is_retroactive } = validatedFields.data
    const supabase = await createClient()

    // Insert session
    const { error } = await supabase
        .from('attendance_sessions')
        .insert([{
            class_id: classId,
            session_date,
            session_time,
            is_retroactive,
            is_active: false // Explicitly default to false
        }])

    if (error) {
        console.error('Failed to create session:', error)
        return {
            message: 'Database error: Failed to create session.',
        }
    }

    revalidatePath(`/lecturer/classes/${classId}`)

    // Return success
    return {
        message: null,
        errors: {}
    }
}

export async function getSessionsByClass(classId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('attendance_sessions')
        .select('*')
        .eq('class_id', classId)
        .order('session_date', { ascending: false })
        .order('session_time', { ascending: false })

    if (error) {
        console.error('Failed to fetch sessions:', error)
        return []
    }

    return data
}

export async function activateSession(sessionId: string, classId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('attendance_sessions')
        .update({
            is_active: true,
            activated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .eq('class_id', classId)

    if (error) {
        console.error('Failed to activate session:', error)
        return { success: false, message: 'Failed to activate session.' }
    }

    revalidatePath(`/lecturer/classes/${classId}`)
    return { success: true }
}

export async function closeSession(sessionId: string, classId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('attendance_sessions')
        .update({
            is_active: false,
            closed_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .eq('class_id', classId)

    if (error) {
        console.error('Failed to close session:', error)
        return { success: false, message: 'Failed to close session.' }
    }

    revalidatePath(`/lecturer/classes/${classId}`)
    return { success: true }
}

export type SubmitAttendanceState = {
    message?: string | null
    errors?: {
        status?: string[]
        reason?: string[]
    }
}

export async function submitAttendance(
    sessionId: string,
    studentId: string,
    prevState: SubmitAttendanceState,
    formData: FormData
): Promise<SubmitAttendanceState> {
    const validatedFields = submitAttendanceSchema.safeParse({
        status: formData.get('status'),
        reason: formData.get('reason'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid submission fields.',
        }
    }

    const { status, reason } = validatedFields.data
    const supabase = await createClient()

    // 1. Verify session is still active OR student has a retroactive pass
    const { data: session } = await supabase
        .from('attendance_sessions')
        .select('is_active, class_id')
        .eq('id', sessionId)
        .single()

    if (!session) {
        return { message: 'This attendance session is invalid.' }
    }

    // Lookup Student UUID from string ID
    const { data: studentDoc } = await supabase
        .from('students')
        .select('id')
        .eq('student_id', studentId)
        .single()

    if (!studentDoc) {
        return { message: 'Invalid student ID.' }
    }

    const studentUuid = studentDoc.id

    let isRetroactiveSubmission = false

    if (!session.is_active) {
        // Check for retroactive pass
        const { data: retroPass } = await supabase
            .from('retroactive_access')
            .select('id, used')
            .eq('session_id', sessionId)
            .eq('student_id', studentUuid)
            .single()

        if (!retroPass || retroPass.used) {
            return { message: 'This attendance session is closed.' }
        }

        isRetroactiveSubmission = true
    }

    // 2. Insert record
    const { error } = await supabase
        .from('attendance_records')
        .insert([{
            session_id: sessionId,
            student_id: studentUuid,
            status,
            reason: reason || null,
            recorded_at: new Date().toISOString(),
            is_retroactive: isRetroactiveSubmission
        }])

    if (error) {
        // Handle unique constraint (student already submitted)
        if (error.code === '23505') {
            return { message: 'You have already submitted attendance for this session.' }
        }
        console.error('Failed to submit attendance:', error)
        return { message: 'Failed to record attendance. Please try again.' }
    }

    // 3. Consume retroactive pass if applicable
    if (isRetroactiveSubmission) {
        const { error: retroError } = await supabase
            .from('retroactive_access')
            .update({ used: true })
            .eq('session_id', sessionId)
            .eq('student_id', studentUuid)

        if (retroError) {
            console.error('Failed to consume retroactive pass:', retroError)
            // Note: we don't return an error here because the attendance record was saved successfully, 
            // but the pass was just not marked used. Admin might need to fix it.
        }
    }

    revalidatePath(`/student/classes/${session.class_id}`)

    return {
        message: null,
        errors: {}
    }
}

export async function getActiveSessionForClass(classId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('attendance_sessions')
        .select('*')
        .eq('class_id', classId)
        .eq('is_active', true)
        .limit(1)
        .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching active session:', error)
        return null
    }

    return data
}

export async function getStudentPendingSessions(classId: string, studentId: string) {
    const supabase = await createClient()

    // Query 1: Get active session (if any)
    const { data: activeSession, error: activeErr } = await supabase
        .from('attendance_sessions')
        .select('*')
        .eq('class_id', classId)
        .eq('is_active', true)
        .limit(1)
        .single()

    // Query 2: Get any unused retroactive passes for this student in this class
    const { data: retroPasses, error: retroErr } = await supabase
        .from('retroactive_access')
        .select(`
            used,
            session_id,
            attendance_sessions!inner (*),
            students!inner (student_id)
        `)
        .eq('students.student_id', studentId)
        .eq('used', false)
        .eq('attendance_sessions.class_id', classId)

    const pendingSessions = []

    if (activeSession) {
        pendingSessions.push({ ...activeSession, _type: 'active' })
    }

    if (retroPasses && retroPasses.length > 0) {
        for (const pass of retroPasses) {
            // Avoid duplicating if somehow an active session also has a retro pass
            if (!pendingSessions.find(s => s.id === pass.session_id)) {
                pendingSessions.push({ ...(pass.attendance_sessions as any), _type: 'retroactive' })
            }
        }
    }

    return pendingSessions
}

export async function getStudentEnrollments(studentId: string) {
    const supabase = await createClient()

    // 1. Lookup Student UUID from string ID
    const { data: studentDoc, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('student_id', studentId)
        .single()

    if (studentError || !studentDoc) {
        console.error('Error fetching student UUID for enrollments:', studentError?.message)
        return []
    }

    // 2. Fetch enrollments using the internal UUID
    const { data, error } = await supabase
        .from('enrollments')
        .select(`
            class_id,
            enrolled_at,
            classes (
                id,
                name,
                enrollment_code,
                degree_level,
                semester,
                location_lat,
                location_lng,
                radius
            )
        `)
        .eq('student_id', studentDoc.id)
        .order('enrolled_at', { ascending: false })

    if (error) {
        console.error('Error fetching student enrollments:', error)
        return []
    }

    // Flatten the result
    return data.map((e: any) => ({
        ...e.classes,
        enrolled_at: e.enrolled_at
    }))
}
