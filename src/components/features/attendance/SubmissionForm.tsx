'use client'

import { useActionState, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { submitAttendance } from '@/lib/actions/attendance'
import { Loader2, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

interface SubmissionFormProps {
    sessionId: string
    studentId: string
    isRetroactive?: boolean
}

export function SubmissionForm({ sessionId, studentId, isRetroactive }: SubmissionFormProps) {
    // Bind arguments to the server action
    const submitWithArgs = submitAttendance.bind(null, sessionId, studentId)
    const [state, action, isPending] = useActionState(submitWithArgs, {})

    const [status, setStatus] = useState<string>('Present')

    return (
        <Card className="border-blue-200 shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Submit Attendance
                    {isRetroactive && (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                            Retroactive Session
                        </span>
                    )}
                </CardTitle>
                <CardDescription>
                    {isRetroactive
                        ? "You have been granted special access to submit attendance for this closed session."
                        : "Please select your current attendance status."}
                </CardDescription>
            </CardHeader>

            <form action={action}>
                <CardContent className="space-y-6">
                    {state.message && (
                        <div className={`p-3 rounded-md text-sm font-medium ${state.errors ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-blue-50 text-blue-600 border border-blue-200'
                            }`}>
                            {state.message}
                        </div>
                    )}

                    <div className="space-y-4">
                        <RadioGroup
                            name="status"
                            defaultValue="Present"
                            value={status}
                            onValueChange={setStatus}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                            <div>
                                <RadioGroupItem value="Present" id="status-present" className="peer sr-only" />
                                <Label
                                    htmlFor="status-present"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-green-500 peer-data-[state=checked]:bg-green-50 [&:has([data-state=checked])]:border-green-500 cursor-pointer"
                                >
                                    <CheckCircle className="mb-2 h-6 w-6 text-green-500" />
                                    Present
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="Late" id="status-late" className="peer sr-only" />
                                <Label
                                    htmlFor="status-late"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-amber-500 peer-data-[state=checked]:bg-amber-50 [&:has([data-state=checked])]:border-amber-500 cursor-pointer"
                                >
                                    <AlertTriangle className="mb-2 h-6 w-6 text-amber-500" />
                                    Late
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="Absent" id="status-absent" className="peer sr-only" />
                                <Label
                                    htmlFor="status-absent"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:bg-red-50 [&:has([data-state=checked])]:border-red-500 cursor-pointer"
                                >
                                    <XCircle className="mb-2 h-6 w-6 text-red-500" />
                                    Absent
                                </Label>
                            </div>
                        </RadioGroup>
                        {state.errors?.status && (
                            <p className="text-sm text-red-500">{state.errors.status[0]}</p>
                        )}
                    </div>

                    {(status === 'Late' || status === 'Absent') && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <Label htmlFor="reason">Reason (Required)</Label>
                            <Textarea
                                id="reason"
                                name="reason"
                                placeholder="Please provide a reason for being late or absent..."
                                className={state.errors?.reason ? 'border-red-500 focus-visible:ring-red-500' : ''}
                            />
                            {state.errors?.reason && (
                                <p className="text-sm text-red-500">{state.errors.reason[0]}</p>
                            )}
                        </div>
                    )}
                </CardContent>

                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Attendance'
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
