import { StudentLoginForm } from '@/components/features/students/StudentLoginForm'

export const metadata = {
    title: 'Student Portal Login | Class Attendance',
    description: 'Access your student dashboard',
}

export default async function StudentLoginPage() {
    return (
        <div className="container py-10 px-4">
            <StudentLoginForm />
        </div>
    )
}
