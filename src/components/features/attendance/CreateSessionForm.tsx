'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createSession, type SessionState } from '@/lib/actions/attendance'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="min-h-[44px] w-full mt-4">
            {pending ? 'Creating Session...' : 'Create Attendance Session'}
        </Button>
    )
}

interface CreateSessionFormProps {
    classId: string
}

export function CreateSessionForm({ classId }: CreateSessionFormProps) {
    const initialState: SessionState = { message: null, errors: {} }
    const createSessionWithId = createSession.bind(null, classId)
    const [state, formAction] = useActionState(createSessionWithId, initialState)
    const formRef = useRef<HTMLFormElement>(null)

    // Reset form on success
    useEffect(() => {
        if (state.message === null && Object.keys(state.errors || {}).length === 0 && !state.errors?.session_date) {
            // A bit of a heuristic check for success, since state changes only after action completes.
            // It's safer to handle the UI state optimistically or check for specific success markers.
            // In our action, returning empty errors and null message is the success path.
        }
    }, [state])

    // Simple handler to intercept the action if we want to add any client-side specific pre-checks
    const handleAction = (formData: FormData) => {
        formAction(formData)
        // We could manually reset the form here if we wanted to be optimistic,
        // but better to wait for server response. The page will revalidate anyway.
    }

    // Get current date string in YYYY-MM-DD format for default value
    const today = new Date().toISOString().split('T')[0]

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Create Attendance Session</CardTitle>
                <CardDescription>Schedule a new attendance tracking session for this class</CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} action={handleAction} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="session_date">Date *</Label>
                            <Input
                                id="session_date"
                                name="session_date"
                                type="date"
                                defaultValue={today}
                                required
                                className="min-h-[44px]"
                            />
                            {state?.errors?.session_date && (
                                <p className="text-destructive text-sm">{state.errors.session_date[0]}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="session_time">Time *</Label>
                            <Input
                                id="session_time"
                                name="session_time"
                                type="time"
                                defaultValue="09:00"
                                required
                                className="min-h-[44px]"
                            />
                            {state?.errors?.session_time && (
                                <p className="text-destructive text-sm">{state.errors.session_time[0]}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <input
                            type="checkbox"
                            id="is_retroactive"
                            name="is_retroactive"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="is_retroactive" className="cursor-pointer font-normal">
                            Allow Retroactive Attendance (students can submit past attendance if granted access)
                        </Label>
                    </div>
                    {state?.errors?.is_retroactive && (
                        <p className="text-destructive text-sm">{state.errors.is_retroactive[0]}</p>
                    )}

                    <SubmitButton />

                    {state?.message && (
                        <div className="p-3 border border-destructive/50 bg-destructive/10 text-destructive rounded-md mt-4 text-center text-sm">
                            {state.message}
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    )
}
