import { getStudentIdFromCookie } from '@/lib/utils/auth'
import { getStudentEnrollments, getStudentPendingSessions } from '@/lib/actions/attendance'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, CalendarDays, ExternalLink, Activity } from 'lucide-react'

export const metadata = {
    title: 'Dashboard | Student Portal',
}

// Force dynamic rendering so the page isn't cached during build or navigation
export const dynamic = 'force-dynamic'

export default async function StudentDashboardPage() {
    const studentId = await getStudentIdFromCookie()

    if (!studentId) {
        redirect('/student')
    }

    const enrolledClasses = await getStudentEnrollments(studentId)

    // Fetch all pending sessions (active or retroactive) for each class
    const classesWithStatus = await Promise.all(
        enrolledClasses.map(async (c: any) => {
            const pendingSessions = await getStudentPendingSessions(c.id, studentId)
            return {
                ...c,
                pendingSessions
            }
        })
    )

    return (
        <div className="container py-8 max-w-5xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Classes</h1>
                    <p className="text-muted-foreground mt-1 text-lg">
                        Welcome back, {studentId}
                    </p>
                </div>
                <Link href="/enroll">
                    <Button variant="outline" type="button">Enroll in Class</Button>
                </Link>
            </div>

            {classesWithStatus.length === 0 ? (
                <Card className="p-12 text-center border-dashed">
                    <CardContent className="space-y-4">
                        <div className="flex justify-center">
                            <div className="bg-primary/10 p-4 rounded-full text-primary">
                                <CalendarDays className="h-8 w-8" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">No classes yet</h2>
                            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                                You haven&apos;t enrolled in any classes. Enter a class code provided by your lecturer to join a class.
                            </p>
                        </div>
                        <Link href="/enroll">
                            <Button className="mt-4">Enroll Now</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classesWithStatus.map((cls) => {
                        const hasPending = cls.pendingSessions && cls.pendingSessions.length > 0;
                        const primarySession = hasPending ? cls.pendingSessions[0] : null;

                        return (
                            <Card key={cls.id} className={`flex flex-col h-full overflow-hidden transition-all hover:shadow-md group ${hasPending ? (primarySession._type === 'retroactive' ? 'ring-2 ring-amber-500' : 'ring-2 ring-green-500') : ''}`}>
                                {hasPending && (
                                    primarySession._type === 'retroactive' ? (
                                        <div className="bg-amber-500 text-white text-xs font-bold px-4 py-1.5 flex items-center justify-center gap-2">
                                            <Clock className="h-3.5 w-3.5" />
                                            RETROACTIVE ACCESS GRANTED
                                        </div>
                                    ) : (
                                        <div className="bg-green-500 text-white text-xs font-bold px-4 py-1.5 flex items-center justify-center gap-2 animate-pulse">
                                            <Activity className="h-3.5 w-3.5" />
                                            ATTENDANCE ACTIVE NOW
                                        </div>
                                    )
                                )}

                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                            {cls.enrollment_code}
                                        </span>
                                        <span className="text-xs text-muted-foreground font-medium">
                                            {cls.semester}
                                        </span>
                                    </div>
                                    <CardTitle className="text-xl leading-tight group-hover:text-blue-600 transition-colors">
                                        {cls.name}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-1.5 mt-1.5">
                                        <span className="font-medium text-slate-600">{cls.degree_level}</span>
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex-grow pb-4">
                                    <div className="space-y-2 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-slate-400" />
                                            <span>
                                                {cls.location_lat ? 'Location restricted' : 'No location set'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-slate-400" />
                                            <span>Enrolled: {new Date(cls.enrolled_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-0 border-t mt-auto">
                                    <div className="w-full mt-4">
                                        {hasPending ? (
                                            <Link href={`/student/classes/${cls.id}`} className="w-full block">
                                                <Button className={`w-full text-white ${primarySession._type === 'retroactive' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'}`}>
                                                    Submit Attendance
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Link href={`/student/classes/${cls.id}`} className="w-full block">
                                                <Button variant="outline" className="w-full text-slate-600 flex items-center justify-center gap-2 group-hover:border-slate-400">
                                                    View Details <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
