import { createClient } from '@/lib/supabase/server'
import { getStudentsWithoutAttendance, getRetroactiveAccessBySession } from '@/lib/actions/retroactive'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { RetroactiveAccessManager } from '@/components/features/attendance/RetroactiveAccessManager'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft, Clock, Calendar, Users } from 'lucide-react'

export const metadata = {
    title: 'Session Details | Lecturer Dashboard',
}

interface PageProps {
    params: Promise<{ id: string, sessionId: string }>
}

export default async function SessionDetailsPage({ params }: PageProps) {
    const { id, sessionId } = await params
    const supabase = await createClient()

    // Verify session
    const { data: session, error: sessionError } = await supabase
        .from('attendance_sessions')
        .select('*, classes(name, enrollment_code)')
        .eq('id', sessionId)
        .eq('class_id', id)
        .single()

    if (sessionError || !session) {
        redirect(`/lecturer/classes/${id}`)
    }

    // Get attendance stats 
    const { data: records, error: recordsError } = await supabase
        .from('attendance_records')
        .select(`
            status,
            is_retroactive,
            students (
                full_name,
                student_id
            )
        `)
        .eq('session_id', sessionId)

    const presentCount = records?.filter(r => r.status === 'Present').length || 0
    const lateCount = records?.filter(r => r.status === 'Late').length || 0
    const absentCount = records?.filter(r => r.status === 'Absent').length || 0

    // Get retroactive data
    const eligibleStudents = await getStudentsWithoutAttendance(id, sessionId)
    const existingPasses = await getRetroactiveAccessBySession(sessionId)

    const date = new Date(session.session_date).toLocaleDateString()
    const time = session.session_time.substring(0, 5)

    return (
        <div className="container py-8 max-w-5xl">
            <div className="mb-6">
                <Link href={`/lecturer/classes/${id}`} className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-2 w-fit">
                    <ArrowLeft className="h-4 w-4" /> Back to Class
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column: Stats */}
                <div className="w-full md:w-1/3 space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight mb-1">Session Details</h1>
                        <p className="text-slate-500 text-sm">{(session.classes as any).name}</p>
                    </div>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Session Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium">{date}</p>
                                    <p className="text-xs text-slate-500">Date</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium">{time}</p>
                                    <p className="text-xs text-slate-500">Time</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5 text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium">
                                        {session.is_active ?
                                            <span className="text-green-600 font-bold">Active</span> :
                                            <span className="text-slate-500">Closed</span>}
                                    </p>
                                    <p className="text-xs text-slate-500">Status</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Attendance Stats</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-2 text-center py-2">
                                <div className="bg-green-50 p-2 rounded-md border border-green-100">
                                    <p className="text-2xl font-bold text-green-700">{presentCount}</p>
                                    <p className="text-[10px] uppercase font-bold text-green-600 mt-1">Present</p>
                                </div>
                                <div className="bg-amber-50 p-2 rounded-md border border-amber-100">
                                    <p className="text-2xl font-bold text-amber-700">{lateCount}</p>
                                    <p className="text-[10px] uppercase font-bold text-amber-600 mt-1">Late</p>
                                </div>
                                <div className="bg-red-50 p-2 rounded-md border border-red-100">
                                    <p className="text-2xl font-bold text-red-700">{absentCount}</p>
                                    <p className="text-[10px] uppercase font-bold text-red-600 mt-1">Absent</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Retroactive Management */}
                <div className="w-full md:w-2/3">
                    <RetroactiveAccessManager
                        classId={id}
                        sessionId={sessionId}
                        eligibleStudents={eligibleStudents}
                        existingPasses={existingPasses}
                    />
                </div>
            </div>
        </div>
    )
}
