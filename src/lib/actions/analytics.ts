'use server'

import { createClient } from '@/lib/supabase/server'
import { getHealthStatus } from '@/lib/utils/attendance-thresholds'
import { getClasses } from './classes'

// Type definitions for analytics data
export type StudentMetric = {
  id: string
  full_name: string
  student_id: string
  totalSessions: number
  attended: number
  absent: number
  late: number
  percentage: number
  healthStatus: 'excellent' | 'warning' | 'critical'
}

export type ClassAnalyticsSummary = {
  classInfo: {
    id: string
    name: string
    code: string
    degree_level: string
    semester: string
  }
  totalSessions: number
  totalStudents: number
  avgAttendance: number
  studentsAtRisk: number
}

export type ClassAnalyticsDetail = {
  classInfo: {
    id: string
    name: string
    code: string
    degree_level: string
    semester: string
  }
  totalSessions: number
  studentMetrics: StudentMetric[]
}

/**
 * Fetch summary analytics for a single class (for dashboard cards)
 * Uses optimized JOIN strategy to avoid N+1 queries
 * @param classId - UUID of the class
 * @returns Summary analytics with total sessions, students, avg attendance, and at-risk count
 */
export async function getClassAnalyticsSummary(classId: string): Promise<ClassAnalyticsSummary> {
  try {
    const supabase = await createClient()

    // Query 1: Get class info
    const { data: classInfo, error: classError } = await supabase
      .from('classes')
      .select('id, name, code, degree_level, semester')
      .eq('id', classId)
      .single()

    if (classError || !classInfo) {
      throw new Error(`Failed to fetch class info: ${classError?.message}`)
    }

    // Query 2: Get all enrolled students via JOIN
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select(`
        students (
          id,
          student_id,
          full_name
        )
      `)
      .eq('class_id', classId)

    if (enrollError) {
      throw new Error(`Failed to fetch enrollments: ${enrollError.message}`)
    }

    const students = (enrollments || [])
      .map(e => {
        const s = Array.isArray(e.students) ? e.students[0] : e.students
        return s
      })
      .filter(s => s !== null && s !== undefined) as Array<{
        id: string
        student_id: string
        full_name: string
      }>

    const totalStudents = students.length

    // Query 3: Get all attendance sessions for this class
    const { data: sessions, error: sessionsError } = await supabase
      .from('attendance_sessions')
      .select('id')
      .eq('class_id', classId)

    if (sessionsError) {
      throw new Error(`Failed to fetch sessions: ${sessionsError.message}`)
    }

    const totalSessions = sessions?.length || 0

    // Handle edge case: no sessions yet
    if (totalSessions === 0) {
      return {
        classInfo,
        totalSessions: 0,
        totalStudents,
        avgAttendance: 0,
        studentsAtRisk: 0,
      }
    }

    const sessionIds = sessions.map(s => s.id)

    // Query 4: Fetch all attendance records for these sessions (using IN clause)
    const { data: records, error: recordsError } = await supabase
      .from('attendance_records')
      .select('session_id, student_id, status')
      .in('session_id', sessionIds)

    if (recordsError) {
      throw new Error(`Failed to fetch attendance records: ${recordsError.message}`)
    }

    // Aggregate client-side: Calculate per-student metrics
    const studentMetricsMap = new Map<string, { attended: number; absent: number; late: number }>()

    // Initialize all students with zero counts
    students.forEach(student => {
      studentMetricsMap.set(student.id, { attended: 0, absent: 0, late: 0 })
    })

    // Count attendance records by student
    records?.forEach(record => {
      const metrics = studentMetricsMap.get(record.student_id)
      if (metrics) {
        if (record.status === 'Attend') {
          metrics.attended++
        } else if (record.status === 'Not Attend') {
          metrics.absent++
        } else if (record.status === 'Late') {
          metrics.late++
        }
      }
    })

    // Calculate aggregate metrics
    let totalAttendancePercentages = 0
    let studentsAtRisk = 0

    studentMetricsMap.forEach(metrics => {
      // Calculate percentage for this student
      const percentage = totalSessions > 0 ? (metrics.attended / totalSessions) * 100 : 0
      totalAttendancePercentages += percentage

      // Count at-risk students (2+ absences)
      if (metrics.absent >= 2) {
        studentsAtRisk++
      }
    })

    // Calculate average attendance across all students
    const avgAttendance = totalStudents > 0 ? totalAttendancePercentages / totalStudents : 0

    return {
      classInfo,
      totalSessions,
      totalStudents,
      avgAttendance: Math.round(avgAttendance * 10) / 10, // Round to 1 decimal place
      studentsAtRisk,
    }
  } catch (error) {
    console.error('Error fetching class analytics summary:', error)
    throw error
  }
}

/**
 * Fetch detailed per-student analytics for a class (for class analytics page)
 * Uses same aggregation strategy as Summary but includes full student details
 * @param classId - UUID of the class
 * @returns Detailed analytics with per-student metrics
 */
export async function getClassAnalyticsDetail(classId: string): Promise<ClassAnalyticsDetail> {
  try {
    const supabase = await createClient()

    // Query 1: Get class info
    const { data: classInfo, error: classError } = await supabase
      .from('classes')
      .select('id, name, code, degree_level, semester')
      .eq('id', classId)
      .single()

    if (classError || !classInfo) {
      throw new Error(`Failed to fetch class info: ${classError?.message}`)
    }

    // Query 2: Get all enrolled students via JOIN
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select(`
        students (
          id,
          student_id,
          full_name
        )
      `)
      .eq('class_id', classId)

    if (enrollError) {
      throw new Error(`Failed to fetch enrollments: ${enrollError.message}`)
    }

    const students = (enrollments || [])
      .map(e => {
        const s = Array.isArray(e.students) ? e.students[0] : e.students
        return s
      })
      .filter(s => s !== null && s !== undefined) as Array<{
        id: string
        student_id: string
        full_name: string
      }>

    // Query 3: Get all attendance sessions for this class
    const { data: sessions, error: sessionsError } = await supabase
      .from('attendance_sessions')
      .select('id')
      .eq('class_id', classId)

    if (sessionsError) {
      throw new Error(`Failed to fetch sessions: ${sessionsError.message}`)
    }

    const totalSessions = sessions?.length || 0

    // Handle edge case: no sessions yet
    if (totalSessions === 0 || students.length === 0) {
      return {
        classInfo,
        totalSessions,
        studentMetrics: students.map(student => ({
          id: student.id,
          full_name: student.full_name,
          student_id: student.student_id,
          totalSessions: 0,
          attended: 0,
          absent: 0,
          late: 0,
          percentage: 0,
          healthStatus: 'critical' as const,
        })),
      }
    }

    const sessionIds = sessions.map(s => s.id)

    // Query 4: Fetch all attendance records for these sessions
    const { data: records, error: recordsError } = await supabase
      .from('attendance_records')
      .select('session_id, student_id, status')
      .in('session_id', sessionIds)

    if (recordsError) {
      throw new Error(`Failed to fetch attendance records: ${recordsError.message}`)
    }

    // Aggregate client-side: Calculate per-student metrics
    const studentMetricsMap = new Map<string, { attended: number; absent: number; late: number }>()

    // Initialize all students with zero counts
    students.forEach(student => {
      studentMetricsMap.set(student.id, { attended: 0, absent: 0, late: 0 })
    })

    // Count attendance records by student
    records?.forEach(record => {
      const metrics = studentMetricsMap.get(record.student_id)
      if (metrics) {
        if (record.status === 'Attend') {
          metrics.attended++
        } else if (record.status === 'Not Attend') {
          metrics.absent++
        } else if (record.status === 'Late') {
          metrics.late++
        }
      }
    })

    // Build detailed student metrics array
    const studentMetrics: StudentMetric[] = students.map(student => {
      const metrics = studentMetricsMap.get(student.id) || { attended: 0, absent: 0, late: 0 }
      const percentage = totalSessions > 0 ? (metrics.attended / totalSessions) * 100 : 0
      const healthStatus = getHealthStatus(percentage)

      return {
        id: student.id,
        full_name: student.full_name,
        student_id: student.student_id,
        totalSessions,
        attended: metrics.attended,
        absent: metrics.absent,
        late: metrics.late,
        percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal place
        healthStatus,
      }
    })

    // Sort by attendance percentage descending (best first)
    studentMetrics.sort((a, b) => b.percentage - a.percentage)

    return {
      classInfo,
      totalSessions,
      studentMetrics,
    }
  } catch (error) {
    console.error('Error fetching class analytics detail:', error)
    throw error
  }
}

/**
 * Fetch analytics for all classes in parallel (for main dashboard)
 * @returns Array of classes with their analytics summary
 */
export async function getAllClassesAnalytics() {
  try {
    const classes = await getClasses()

    // Fetch analytics for all classes in parallel
    const analyticsPromises = classes.map(c =>
      getClassAnalyticsSummary(c.id).catch(error => {
        console.error(`Failed to fetch analytics for class ${c.id}:`, error)
        // Return default analytics if fetch fails for a class
        return {
          classInfo: {
            id: c.id,
            name: c.name,
            code: c.code,
            degree_level: c.degree_level,
            semester: c.semester,
          },
          totalSessions: 0,
          totalStudents: 0,
          avgAttendance: 0,
          studentsAtRisk: 0,
        }
      })
    )

    const analytics = await Promise.all(analyticsPromises)

    // Combine classes with their analytics
    return classes.map((c, i) => ({
      ...c,
      analytics: analytics[i],
    }))
  } catch (error) {
    console.error('Error fetching all classes analytics:', error)
    throw error
  }
}
