import { getClassById } from '@/lib/actions/classes'
import { getStudentsByClass } from '@/lib/actions/students'
import { getSessionsByClass } from '@/lib/actions/attendance'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CreateSessionForm } from '@/components/features/attendance/CreateSessionForm'
import { SessionList } from '@/components/features/attendance/SessionList'

export default async function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let classData
  let students = []
  let sessions = []

  try {
    classData = await getClassById(id)
    students = await getStudentsByClass(id)
    sessions = await getSessionsByClass(id)
  } catch (error) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <Link href="/lecturer">
          <Button variant="outline" className="mb-4">← Back to Dashboard</Button>
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{classData.name}</h1>
            <p className="text-muted-foreground mt-1">
              {classData.degree_level} • {classData.semester}
            </p>
          </div>
          <Link href={`/lecturer/classes/${classData.id}/edit`}>
            <Button>Edit Class</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Class Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Class Name</p>
              <p className="text-lg">{classData.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Enrollment Code</p>
              <p className="text-2xl font-mono font-bold tracking-widest">{classData.code}</p>
              <p className="text-xs text-muted-foreground mt-1">Share this code with students to enroll</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Degree Level</p>
              <p className="text-lg">{classData.degree_level}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Semester</p>
              <p className="text-lg">{classData.semester}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {classData.location_lat && classData.location_lng ? (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Coordinates</p>
                  <p className="text-sm font-mono bg-muted p-2 rounded mt-1">
                    {classData.location_lat.toFixed(6)}, {classData.location_lng.toFixed(6)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Attendance Radius</p>
                  <p className="text-lg">{classData.location_radius} meters</p>
                </div>
              </>
            ) : (
              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="text-muted-foreground mb-4">No location set for this class.</p>
                <Link href={`/lecturer/classes/${classData.id}/edit`}>
                  <Button variant="outline" size="sm">Set Location</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Enrolled Students</CardTitle>
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {students.length} Student{students.length !== 1 ? 's' : ''}
          </div>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center p-8 border-2 border-dashed rounded-lg bg-muted/50">
              <p className="text-muted-foreground">No students currently enrolled.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Share the enrollment code <span className="font-mono font-bold">{classData.code}</span> with your students.
              </p>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted">
                  <tr>
                    <th className="px-6 py-3">Full Name</th>
                    <th className="px-6 py-3">Student ID</th>
                    <th className="px-6 py-3 text-right">Enrollment Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {students.map((student) => (
                    <tr key={student.id} className="bg-background hover:bg-muted/50">
                      <td className="px-6 py-4 font-medium">{student.full_name}</td>
                      <td className="px-6 py-4 font-mono text-muted-foreground">{student.student_id}</td>
                      <td className="px-6 py-4 text-right text-muted-foreground">
                        {new Date(student.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance Session Management Section */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Create Session Form - Takes up 1 column on desktop */}
        <div className="md:col-span-1">
          <CreateSessionForm classId={classData.id} />
        </div>

        {/* Session List - Takes up 2 columns on desktop */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Attendance History</CardTitle>
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {sessions.length} Session{sessions.length !== 1 ? 's' : ''}
              </div>
            </CardHeader>
            <CardContent>
              <SessionList sessions={sessions} classId={classData.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
