import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function checkData() {
    console.log("Checking DB for S9999999...")

    const { data: student, error: e1 } = await supabase.from('students').select('*').eq('student_id', 'S9999999').single()
    console.log("Student:", student?.id || e1?.message)

    if (student) {
        const { data: enrollments, error: e2 } = await supabase.from('enrollments').select('*').eq('student_id', student.id)
        console.log("Raw Enrollments count:", enrollments?.length || 0, e2?.message || '')

        const { data: classes, error: e3 } = await supabase
            .from('enrollments')
            .select('class_id, classes(name)')
            .eq('student_id', student.id)
        console.log("Joined Classes count:", classes?.length || 0, e3?.message || '')
    }
}

checkData()
