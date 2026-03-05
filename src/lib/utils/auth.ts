// Quick helper to read student ID from cookies
import { cookies } from 'next/headers'

export async function getStudentIdFromCookie(): Promise<string | null> {
    const cookieStore = await cookies()
    const studentId = cookieStore.get('student_id')

    if (!studentId || !studentId.value) {
        return null
    }

    return studentId.value
}
