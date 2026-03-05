import { createClient } from '@/lib/supabase/server'
import { getClassAnalyticsDetail } from './analytics'

/**
 * Escapes a string for use in a CSV. Double quotes are doubled, 
 * and strings with commas, quotes, or newlines are wrapped in double quotes.
 */
function escapeCSV(field: any): string {
    if (field === null || field === undefined) {
        return ''
    }
    const str = String(field)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
    }
    return str
}

/**
 * Gathers the entire attendance matrix for a class and 
 * formats it directly into a standard CSV string.
 */
export async function getAttendanceCSVExport(classId: string): Promise<{ filename: string, csv: string }> {
    const supabase = await createClient()

    // 1. Re-use the analytics service to get all students and their summary stats
    const analytics = await getClassAnalyticsDetail(classId)
    const { classInfo, studentMetrics } = analytics

    // 2. Fetch all sessions for this class (in chronological order) to form the columns
    const { data: sessions, error: sessionsError } = await supabase
        .from('attendance_sessions')
        .select('id, created_at, date')
        .eq('class_id', classId)
        .order('created_at', { ascending: true })

    if (sessionsError) {
        throw new Error(`Failed to fetch sessions: ${sessionsError.message}`)
    }

    if (!sessions || sessions.length === 0) {
        throw new Error('No attendance sessions exist for this class.')
    }

    // 3. Fetch all records for the matrix
    const sessionIds = sessions.map(s => s.id)
    const { data: records, error: recordsError } = await supabase
        .from('attendance_records')
        .select('session_id, student_id, status')
        .in('session_id', sessionIds)

    if (recordsError) {
        throw new Error(`Failed to fetch attendance records: ${recordsError.message}`)
    }

    // Fast lookup: recordsMap[studentId][sessionId] = status
    const recordsMap: Record<string, Record<string, string>> = {}
    records?.forEach(record => {
        if (!recordsMap[record.student_id]) {
            recordsMap[record.student_id] = {}
        }
        recordsMap[record.student_id][record.session_id] = record.status
    })

    // 4. Build CSV Headers
    // Student ID, Full Name, [Session 1 Date], [Session 2 Date]..., Total Present, Total Late, Total Absent, Percentage
    const headers = ['Student ID', 'Full Name']
    sessions.forEach(session => {
        const d = new Date(session.created_at)
        headers.push(`${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`)
    })
    headers.push('Total Present', 'Total Late', 'Total Absent', 'Attendance %')

    const csvRows: string[][] = []
    csvRows.push(headers)

    // 5. Build CSV Data Rows
    // Ensure roster is sorted by name for the exported sheet
    const sortedStudents = [...studentMetrics].sort((a, b) => a.full_name.localeCompare(b.full_name))

    sortedStudents.forEach(student => {
        const row = [
            student.student_id,
            student.full_name
        ]

        // Add the specific status for each session
        sessions.forEach(session => {
            const status = recordsMap[student.id]?.[session.id] || 'Not Recorded'
            row.push(status)
        })

        // Add summaries from the aggregated metrics
        row.push(
            student.attended.toString(),
            student.late.toString(),
            student.absent.toString(),
            `${student.percentage.toFixed(1)}%`
        )

        csvRows.push(row)
    })

    // 6. Join rows with newlines and cells with commas
    const csvContent = csvRows.map(row => row.map(escapeCSV).join(',')).join('\n')

    // Generate a clean filename: CIS101_Attendance_Report_2026-03-05.csv
    const safeClassName = classInfo.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    const dateStr = new Date().toISOString().split('T')[0]
    const filename = `${safeClassName}_attendance_report_${dateStr}.csv`

    return {
        filename,
        csv: csvContent
    }
}
