import { getClassById } from '@/lib/actions/classes'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let classData

  try {
    classData = await getClassById(id)
  } catch (error) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/lecturer">
          <Button variant="outline" className="mb-4">← Back to Dashboard</Button>
        </Link>
        <div className="flex justify-between items-start">
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
              <p className="text-2xl font-mono font-bold">{classData.code}</p>
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
                  <p className="text-sm font-mono">
                    {classData.location_lat.toFixed(6)}, {classData.location_lng.toFixed(6)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Attendance Radius</p>
                  <p className="text-lg">{classData.location_radius} meters</p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">No location set. Edit class to set attendance area.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Attendance Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No sessions yet. Attendance sessions will appear here in Phase 4.</p>
        </CardContent>
      </Card>
    </div>
  )
}
