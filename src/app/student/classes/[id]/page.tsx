import { getStudentIdFromCookie } from '@/lib/utils/auth'
import { getStudentPendingSessions } from '@/lib/actions/attendance'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SubmissionForm } from '@/components/features/attendance/SubmissionForm'
import { LocationVerification } from '@/components/features/attendance/LocationVerification'
import { ArrowLeft, Clock, MapPin, CalendarDays } from 'lucide-react'

export const metadata = {
    title: 'Submit Attendance | Student Portal',
}

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function StudentClassPage({ params }: PageProps) {
    const { id } = await params
    const studentId = await getStudentIdFromCookie()

    if (!studentId) {
        redirect('/student')
    }

    const supabase = await createClient()

    // 1. Verify student is actually enrolled
    const { data: enrollment, error: enrollError } = await supabase
        .from('enrollments')
        .select('enrolled_at')
        .eq('class_id', id)
        .eq('student_id', studentId)
        .single()

    if (enrollError || !enrollment) {
        redirect('/student/dashboard')
    }

    // 2. Fetch Class Details
    const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('*')
        .eq('id', id)
        .single()

    if (classError || !classData) {
        redirect('/student/dashboard')
    }

    // 3. Fetch Active Session
    const pendingSessions = await getStudentPendingSessions(id, studentId)
    const activeSession = pendingSessions.length > 0 ? pendingSessions[0] : null

    return (
        <div className="container py-8 max-w-3xl">
            <div className="mb-6">
                <Link href="/student/dashboard" className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-2 w-fit">
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Link>
            </div>

            <div className="mb-8 p-6 bg-slate-50 rounded-lg border">
                <div className="flex justify-between items-start mb-2">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {classData.enrollment_code}
                    </span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">{classData.name}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600 mt-4">
                    <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4" />
                        <span>{classData.semester}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        <span>{classData.location_lat ? 'Location Verified Class' : 'No Location Set'}</span>
                    </div>
                </div>
            </div>

            {!activeSession ? (
                <Card className="border-dashed bg-slate-50 border-slate-200">
                    <CardHeader className="text-center pb-8 pt-10">
                        <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Clock className="h-6 w-6 text-slate-400" />
                        </div>
                        <CardTitle>No Active Session</CardTitle>
                        <CardDescription className="max-w-md mx-auto mt-2 text-base">
                            There is currently no active attendance session for this class.
                            Please wait for your lecturer to activate a session, then refresh this page.
                        </CardDescription>
                        <div className="mt-8">
                            <Link href="/student/dashboard">
                                <Button variant="outline">Return to Dashboard</Button>
                            </Link>
                        </div>
                    </CardHeader>
                </Card>
            ) : (
                <LocationVerification
                    classLat={classData.location_lat}
                    classLng={classData.location_lng}
                    classRadius={classData.radius || 50}
                    onVerified={() => {
                        // Client side callback if needed for analytics. Next.js handles the rest.
                    }}
                >
                    <SubmissionForm
                        sessionId={activeSession.id}
                        studentId={studentId}
                        isRetroactive={activeSession._type === 'retroactive'}
                    />
                </LocationVerification>
            )}
        </div>
    )
}
