'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ClassFormProps {
  action: (prevState: any, formData: FormData) => Promise<any>
  defaultValues?: {
    name?: string
    degree_level?: 'Bachelor' | 'Master'
    semester?: string
    location_lat?: number | null
    location_lng?: number | null
    location_radius?: number
  }
  submitLabel: string
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="min-h-[44px] w-full sm:w-auto">
      {pending ? 'Saving...' : label}
    </Button>
  )
}

export function ClassForm({ action, defaultValues, submitLabel }: ClassFormProps) {
  const initialState = { message: null, errors: {} }
  const [state, formAction] = useActionState(action, initialState)

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Class Name *</Label>
        <Input
          id="name"
          name="name"
          type="text"
          defaultValue={defaultValues?.name}
          placeholder="Management Information Systems"
          required
          className="min-h-[44px]"
        />
        {state?.errors?.name && (
          <p className="text-destructive text-sm">{state.errors.name[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="degree_level">Degree Level *</Label>
        <select
          id="degree_level"
          name="degree_level"
          defaultValue={defaultValues?.degree_level || 'Bachelor'}
          required
          className="w-full min-h-[44px] px-3 py-2 border border-input rounded-md bg-background"
        >
          <option value="Bachelor">Bachelor</option>
          <option value="Master">Master</option>
        </select>
        {state?.errors?.degree_level && (
          <p className="text-destructive text-sm">{state.errors.degree_level[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="semester">Semester *</Label>
        <Input
          id="semester"
          name="semester"
          type="text"
          defaultValue={defaultValues?.semester || 'Semester 2 2025/2026'}
          placeholder="Semester 2 2025/2026"
          required
          className="min-h-[44px]"
        />
        {state?.errors?.semester && (
          <p className="text-destructive text-sm">{state.errors.semester[0]}</p>
        )}
      </div>

      {/* Hidden fields for location - populated by parent page's LocationPicker */}
      <input
        type="hidden"
        name="location_lat"
        id="location_lat"
        value={defaultValues?.location_lat ?? ''}
      />
      <input
        type="hidden"
        name="location_lng"
        id="location_lng"
        value={defaultValues?.location_lng ?? ''}
      />
      <input
        type="hidden"
        name="location_radius"
        id="location_radius"
        value={defaultValues?.location_radius ?? 50}
      />

      <SubmitButton label={submitLabel} />

      {state?.message && (
        <p className="text-destructive mt-2">{state.message}</p>
      )}
    </form>
  )
}
