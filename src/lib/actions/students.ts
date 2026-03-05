'use server'

import { studentEnrollmentSchema } from '@/lib/validations/student'
import { createClient } from '@/lib/supabase/server'

export type EnrollmentState = {
    message?: string | null
    errors?: {
        classCode?: string[]
        fullName?: string[]
        studentId?: string[]
    }
    success?: boolean
    data?: {
        className: string
        studentName: string
    } | null
}

export async function enrollStudent(prevState: EnrollmentState, formData: FormData): Promise<EnrollmentState> {
    // 1. Validate input using Zod schema
    const validatedFields = studentEnrollmentSchema.safeParse({
        classCode: formData.get('classCode'),
        fullName: formData.get('fullName'),
        studentId: formData.get('studentId'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Validation failed. Please check your inputs.',
        }
    }

    const supabase = await createClient()
    const { classCode, fullName, studentId } = validatedFields.data

    // 2. Query classes table to verify the class code exists
    const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('id, name')
        .eq('code', classCode)
        .single()

    if (classError || !classData) {
        return {
            message: 'Invalid class code. Please try again.',
        }
    }

    const classId = classData.id

    // 3. Prevent duplicate enrollment
    // Check if student with same student_id AND same enrolled_classes (in this case, just check if they are in this class)
    // Actually, in our schema, Student has `enrolled_classes (array of class_ids)`.
    // First, check if student exists
    const { data: existingStudent, error: existingStudentError } = await supabase
        .from('students')
        .select('*')
        .eq('student_id', studentId)
        .single()

    if (existingStudentError && existingStudentError.code !== 'PGRST116') {
        // PGRST116 is the PostgREST code for "JSON object requested, multiple (or no) rows returned"
        // Meaning the student doesn't exist yet, which is fine.
        return {
            message: 'An error occurred while checking student records.',
        }
    }

    let finalStudentId = null

    if (existingStudent) {
        // Student exists, check if already enrolled in this class using the enrollments table
        const { data: existingEnrollment } = await supabase
            .from('enrollments')
            .select('*')
            .eq('student_id', existingStudent.id)
            .eq('class_id', classId)
            .single()

        if (existingEnrollment) {
            return {
                message: 'You are already enrolled in this class.',
            }
        }

        // Add to enrollments table
        const { error: enrollError } = await supabase
            .from('enrollments')
            .insert([{ student_id: existingStudent.id, class_id: classId }])

        if (enrollError) {
            return {
                message: 'Failed to complete enrollment.',
            }
        }
        finalStudentId = existingStudent.id
    } else {
        // New student, create record
        const { data: newStudent, error: insertError } = await supabase
            .from('students')
            .insert([{ student_id: studentId, full_name: fullName }])
            .select()
            .single()

        if (insertError) {
            return {
                message: 'Failed to create student record.',
            }
        }
        finalStudentId = newStudent.id

        // Add to enrollments table
        const { error: enrollError } = await supabase
            .from('enrollments')
            .insert([{ student_id: finalStudentId, class_id: classId }])

        if (enrollError) {
            return {
                message: 'Failed to complete enrollment.',
            }
        }
    }

    // Return success info instead of redirecting directly so the form can trigger the redirect with params
    return {
        success: true,
        data: {
            className: classData.name,
            studentName: fullName,
        }
    }
}

export async function getStudentsByClass(classId: string) {
    const supabase = await createClient()

    // Find students through the enrollments junction table
    const { data, error } = await supabase
        .from('enrollments')
        .select(`
            students (
                id,
                student_id,
                full_name,
                created_at
            )
        `)
        .eq('class_id', classId)

    if (error) {
        console.error('Failed to fetch enrolled students:', error)
        return []
    }

    // In Supabase, joining to a single record returns the object directly or an array if it's a one-to-many
    // Based on our schema, one enrollment has one student. The generated type might be array or single based on foreign keys.
    // Let's flatten the array of enrollments to just array of students
    const students = data
        .map(enrollment => {
            // If it's an array for some reason, get the first one, otherwise use it directly
            const s = Array.isArray(enrollment.students) ? enrollment.students[0] : enrollment.students;
            return s;
        })
        .filter(student => student !== null && student !== undefined)
        // We must cast here as Supabase's generated types for joins are notoriously tricky
        .sort((a: any, b: any) => a.full_name.localeCompare(b.full_name)) as any[]

    return students
}
