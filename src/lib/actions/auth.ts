'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export type LoginState = {
    message?: string | null
    error?: string | null
}

export async function studentLogin(prevState: LoginState, formData: FormData): Promise<LoginState> {
    const studentId = formData.get('student_id') as string

    if (!studentId || studentId.trim() === '') {
        return { error: 'Please enter your Student ID' }
    }

    const cleanStudentId = studentId.trim()
    const supabase = await createClient()

    // Verify the student exists in the database
    const { data, error } = await supabase
        .from('students')
        .select('id, student_id, full_name')
        .eq('student_id', cleanStudentId)
        .single()

    if (error || !data) {
        console.error('Login error:', error)
        return { error: 'Student ID not found. Have you enrolled in a class yet?' }
    }

    // Set secure HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('student_id', cleanStudentId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
    })

    // Redirect to dashboard
    redirect('/student/dashboard')
}

export async function studentLogout() {
    const cookieStore = await cookies()
    cookieStore.delete('student_id')
    redirect('/student')
}
