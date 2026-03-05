'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { classSchema } from '@/lib/validations/class'
import { generateClassCode } from '@/lib/utils/code-generator'

export async function createClass(prevState: any, formData: FormData) {
  // 1. Validate input using Zod schema
  const validatedFields = classSchema.safeParse({
    name: formData.get('name'),
    degree_level: formData.get('degree_level'),
    semester: formData.get('semester'),
    location_lat: formData.get('location_lat') || null,
    location_lng: formData.get('location_lng') || null,
    location_radius: formData.get('location_radius'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your inputs.',
    }
  }

  // 2. Generate unique code with retry logic for collision handling
  const supabase = await createClient()
  let attempts = 0
  let data = null
  let error = null

  while (attempts < 3) {
    const code = generateClassCode()

    const result = await supabase
      .from('classes')
      .insert([{ ...validatedFields.data, code }])
      .select()
      .single()

    if (result.error) {
      // Check if unique constraint violation (code collision per Pitfall 5)
      if (result.error.code === '23505') {
        attempts++
        continue // Retry with new code
      }
      error = result.error
      break
    }

    data = result.data
    break
  }

  // 3. Handle errors
  if (error) {
    return {
      message: 'Failed to create class. Please try again.',
      error: error.message,
    }
  }

  if (!data) {
    return {
      message: 'Failed to generate unique class code after 3 attempts.',
    }
  }

  // 4. Revalidate cache and redirect (per Pitfall 3)
  revalidatePath('/lecturer')
  redirect(`/lecturer/classes/${data.id}`)
}

export async function updateClass(classId: string, prevState: any, formData: FormData) {
  const validatedFields = classSchema.safeParse({
    name: formData.get('name'),
    degree_level: formData.get('degree_level'),
    semester: formData.get('semester'),
    location_lat: formData.get('location_lat') || null,
    location_lng: formData.get('location_lng') || null,
    location_radius: formData.get('location_radius'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed.',
    }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('classes')
    .update(validatedFields.data)
    .eq('id', classId)

  if (error) {
    return {
      message: 'Failed to update class.',
      error: error.message,
    }
  }

  revalidatePath('/lecturer')
  revalidatePath(`/lecturer/classes/${classId}`)
  redirect(`/lecturer/classes/${classId}`)
}

export async function deleteClass(classId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('classes')
    .delete()
    .eq('id', classId)

  if (error) {
    throw new Error(`Failed to delete class: ${error.message}`)
  }

  revalidatePath('/lecturer')
  redirect('/lecturer')
}

export async function getClasses() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .order('name')

  if (error) {
    throw new Error(`Failed to fetch classes: ${error.message}`)
  }

  return data
}

export async function getClassById(classId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('id', classId)
    .single()

  if (error) {
    throw new Error(`Failed to fetch class: ${error.message}`)
  }

  return data
}
