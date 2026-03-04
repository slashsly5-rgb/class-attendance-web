import { getClasses } from '@/lib/actions/classes'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function LecturerDashboard() {
  const classes = await getClasses()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">My Classes</h2>
          <p className="text-muted-foreground mt-1">
            {classes.length} {classes.length === 1 ? 'class' : 'classes'}
          </p>
        </div>
        <Link href="/lecturer/classes/new">
          <Button size="lg" className="min-h-[44px]">Create New Class</Button>
        </Link>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <p className="text-muted-foreground mb-4">No classes yet. Create your first class to get started.</p>
          <Link href="/lecturer/classes/new">
            <Button>Create Class</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((classItem) => (
            <Link key={classItem.id} href={`/lecturer/classes/${classItem.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle>{classItem.name}</CardTitle>
                  <CardDescription>
                    {classItem.degree_level} • {classItem.semester}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Class Code:</span>
                      <span className="font-mono font-bold text-lg">{classItem.code}</span>
                    </div>
                    {classItem.location_lat && classItem.location_lng && (
                      <div className="text-xs text-muted-foreground">
                        Location set ({classItem.location_radius}m radius)
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
