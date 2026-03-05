import { getStudentIdFromCookie } from '@/lib/utils/auth'
import { getStudentEnrollments } from '@/lib/actions/attendance'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const studentId = await getStudentIdFromCookie()

    if (!studentId) {
        return NextResponse.json({ error: 'No cookie found' })
    }

    const enrollments = await getStudentEnrollments(studentId)

    return NextResponse.json({
        cookieValue: studentId,
        cookieLength: studentId.length,
        cookieChars: studentId.split('').map(c => `${c}(${c.charCodeAt(0)})`),
        enrollmentsCount: enrollments.length,
        enrollments
    })
}
