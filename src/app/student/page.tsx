import { StudentLoginForm } from '@/components/features/students/StudentLoginForm'
import { getStudentIdFromCookie } from '@/lib/utils/auth'
import { redirect } from 'next/navigation'

export const metadata = {
    title: 'Student Portal Login | Class Attendance',
    description: 'Access your student dashboard',
}

export default async function StudentLoginPage() {
    const studentId = await getStudentIdFromCookie()

    // If already logged in, redirect to dashboard
    if (studentId) {
        redirect('/student/dashboard')
    }

    return (
        <div className="container py-10 px-4">
            <StudentLoginForm />
        </div>
    )
}
