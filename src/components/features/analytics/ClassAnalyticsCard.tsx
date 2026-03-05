'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getHealthStatus, getHealthColor } from '@/lib/utils/attendance-thresholds'

interface ClassAnalyticsCardProps {
  classData: {
    id: string
    name: string
    degree_level: string
    semester: string
    code: string
  }
  analytics: {
    totalSessions: number
    totalStudents: number
    avgAttendance: number
    studentsAtRisk: number
  }
}

interface MetricDisplayProps {
  label: string
  value: string | number
  alert?: boolean
  className?: string
}

function MetricDisplay({ label, value, alert = false, className = '' }: MetricDisplayProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn('text-lg font-semibold', alert && 'text-red-600', className)}>
        {value}
      </p>
    </div>
  )
}

export function ClassAnalyticsCard({ classData, analytics }: ClassAnalyticsCardProps) {
  const { name, degree_level, semester, code } = classData
  const { totalSessions, totalStudents, avgAttendance, studentsAtRisk } = analytics

  // Determine health status and colors
  const healthStatus = getHealthStatus(avgAttendance)
  const healthColor = getHealthColor(healthStatus)

  // Handle empty state (no data yet)
  const hasNoData = totalSessions === 0

  return (
    <Card
      className={cn(
        'border-l-4 hover:shadow-lg transition-shadow cursor-pointer',
        healthColor.border,
        healthColor.bg,
        hasNoData && 'opacity-60'
      )}
    >
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate">{name}</CardTitle>
            <CardDescription className="truncate">
              {degree_level} • {semester}
            </CardDescription>
            <p className="text-xs text-muted-foreground mt-1 font-mono">{code}</p>
          </div>
          <Badge
            variant={
              healthStatus === 'excellent'
                ? 'default'
                : healthStatus === 'warning'
                ? 'secondary'
                : 'destructive'
            }
            className="shrink-0"
          >
            {healthStatus.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {hasNoData ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">No data yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Start a session to see analytics
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <MetricDisplay
              label="Avg Attendance"
              value={`${avgAttendance.toFixed(1)}%`}
            />
            <MetricDisplay
              label="Total Sessions"
              value={totalSessions}
            />
            <MetricDisplay
              label="Enrolled Students"
              value={totalStudents}
            />
            <MetricDisplay
              label="At Risk"
              value={studentsAtRisk}
              alert={studentsAtRisk > 0}
              className={studentsAtRisk > 0 ? 'text-red-600 font-bold' : ''}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
