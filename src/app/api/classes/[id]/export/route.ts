import { getAttendanceCSVExport } from '@/lib/actions/export'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        // Only checking basic auth/existence (in MVP there is no auth, just checking DB validity)
        const supabase = await createClient()

        // Validate the class exists
        const { data: classDoc, error } = await supabase
            .from('classes')
            .select('id')
            .eq('id', id)
            .single()

        if (error || !classDoc) {
            return new NextResponse('Class Not Found', { status: 404 })
        }

        const { filename, csv } = await getAttendanceCSVExport(id)

        // Set headers to trigger a file download natively in the browser
        const headers = new Headers()
        headers.set('Content-Type', 'text/csv; charset=utf-8')
        headers.set('Content-Disposition', `attachment; filename="${filename}"`)

        return new NextResponse(csv, { headers, status: 200 })
    } catch (error: any) {
        console.error('Failed to generate CSV:', error)
        return new NextResponse('Internal Server Error: ' + error.message, { status: 500 })
    }
}
