import { getAllClassesAnalytics } from '@/lib/actions/analytics'
import { ClassAnalyticsCard } from '@/components/features/analytics/ClassAnalyticsCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function LecturerDashboard() {
  const classesWithAnalytics = await getAllClassesAnalytics()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">My Classes</h2>
          <p className="text-muted-foreground mt-1">
            {classesWithAnalytics.length} {classesWithAnalytics.length === 1 ? 'class' : 'classes'}
          </p>
        </div>
        <Link href="/lecturer/classes/new">
          <Button size="lg" className="min-h-[44px]">Create New Class</Button>
        </Link>
      </div>

      {classesWithAnalytics.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <p className="text-muted-foreground mb-4">No classes yet. Create your first class to get started.</p>
          <Link href="/lecturer/classes/new">
            <Button>Create Class</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classesWithAnalytics.map((cls) => (
            <Link key={cls.id} href={`/lecturer/classes/${cls.id}`}>
              <ClassAnalyticsCard
                classData={cls}
                analytics={cls.analytics}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
