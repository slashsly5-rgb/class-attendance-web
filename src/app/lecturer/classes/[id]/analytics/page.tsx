import { getClassAnalyticsDetail } from '@/lib/actions/analytics'
import { getClassById } from '@/lib/actions/classes'
import { StudentRoster } from '@/components/features/analytics/StudentRoster'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getHealthStatus, getHealthColor } from '@/lib/utils/attendance-thresholds'
import { cn } from '@/lib/utils'

export default async function ClassAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    let classData
    let analytics

    try {
        classData = await getClassById(id)
        analytics = await getClassAnalyticsDetail(id)
    } catch (error) {
        notFound()
    }

    const { totalSessions, studentMetrics } = analytics
    const totalStudents = studentMetrics.length

    // Calculate class-level average
    let classAverage = 0
    if (totalStudents > 0) {
        const sum = studentMetrics.reduce((acc, s) => acc + s.percentage, 0)
        classAverage = sum / totalStudents
    }

    const healthStatus = totalSessions > 0 ? getHealthStatus(classAverage) : 'critical'
    const healthColor = getHealthColor(healthStatus)

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="mb-6">
                <Link href={`/lecturer/classes/${classData.id}`}>
                    <Button variant="outline" className="mb-4">← Back to Class</Button>
                </Link>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">{classData.name} Analytics</h1>
                        <p className="text-muted-foreground mt-1">
                            {classData.degree_level} • {classData.semester}
                        </p>
                    </div>
                    {totalSessions > 0 && (
                        <Link href={`/api/classes/${classData.id}/export`} target="_blank" rel="noopener noreferrer">
                            <Button className="flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Download CSV Report
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalSessions}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Enrolled Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalStudents}</div>
                    </CardContent>
                </Card>
                <Card className={cn("border-l-4", totalSessions > 0 ? healthColor.border : "border-slate-300 opacity-70")}>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Average Attendance</CardTitle>
                        {totalSessions > 0 && (
                            <Badge variant={healthStatus === 'excellent' ? 'default' : healthStatus === 'warning' ? 'secondary' : 'destructive'}
                                className={cn(healthStatus === 'excellent' && "bg-green-600")}>
                                {healthStatus.toUpperCase()}
                            </Badge>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {totalSessions > 0 ? `${classAverage.toFixed(1)}%` : '0%'}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8 space-y-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Student Attendance Records</h2>
                    <p className="text-muted-foreground">
                        View detailed per-student metrics and identify students needing support.
                    </p>
                </div>

                {totalSessions === 0 ? (
                    <Card className="p-12 text-center border-dashed">
                        <CardContent className="space-y-4">
                            <h2 className="text-xl font-semibold">No attendance sessions yet</h2>
                            <p className="text-muted-foreground">
                                Start logging attendance to see analytics.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <StudentRoster students={studentMetrics} />
                )}
            </div>
        </div>
    )
}
