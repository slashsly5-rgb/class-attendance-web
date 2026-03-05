'use client'

import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { enrollStudent, type EnrollmentState } from '@/lib/actions/students'
import { useRouter } from 'next/navigation'

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus()

    return (
        <Button type="submit" disabled={pending} className="min-h-[44px] w-full mt-4">
            {pending ? 'Enrolling...' : label}
        </Button>
    )
}

export function EnrollmentForm() {
    const initialState: EnrollmentState = { message: null, errors: {}, success: false, data: null }
    const [state, formAction] = useActionState(enrollStudent, initialState)
    const router = useRouter()

    useEffect(() => {
        if (state?.success && state?.data) {
            const params = new URLSearchParams({
                className: state.data.className as string,
                studentName: state.data.studentName as string,
            })
            router.push(`/enroll/success?${params.toString()}`)
        }
    }, [state, router])

    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="classCode">Class Code *</Label>
                <Input
                    id="classCode"
                    name="classCode"
                    type="text"
                    placeholder="e.g., A3K7M9XP"
                    required
                    className="min-h-[44px] font-mono uppercase"
                />
                {state?.errors?.classCode && (
                    <p className="text-destructive text-sm">{state.errors.classCode[0]}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                    className="min-h-[44px]"
                />
                {state?.errors?.fullName && (
                    <p className="text-destructive text-sm">{state.errors.fullName[0]}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="studentId">Student ID *</Label>
                <Input
                    id="studentId"
                    name="studentId"
                    type="text"
                    placeholder="e.g., 20250001"
                    required
                    className="min-h-[44px] font-mono"
                />
                {state?.errors?.studentId && (
                    <p className="text-destructive text-sm">{state.errors.studentId[0]}</p>
                )}
            </div>

            <SubmitButton label="Enroll in Class" />

            {state?.message && !state?.success && (
                <div className="p-3 border border-destructive/50 bg-destructive/10 text-destructive rounded-md mt-4 text-center text-sm">
                    {state.message}
                </div>
            )}
        </form>
    )
}
