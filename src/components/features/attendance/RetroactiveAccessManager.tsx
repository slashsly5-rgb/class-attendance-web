'use client'

import { useState, useActionState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { grantRetroactiveAccess } from '@/lib/actions/retroactive'
import { Loader2, PlusCircle, CheckCircle } from 'lucide-react'

interface Student {
    id: string
    full_name: string
    student_id: string
}

interface RetroactiveAccessManagerProps {
    classId: string
    sessionId: string
    eligibleStudents: Student[]
    existingPasses: any[]
}

export function RetroactiveAccessManager({ classId, sessionId, eligibleStudents, existingPasses }: RetroactiveAccessManagerProps) {
    const grantWithIds = grantRetroactiveAccess.bind(null, classId)
    const [state, action, isPending] = useActionState(grantWithIds, {})

    // Controlled checkboxes state
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())

    const handleCheckboxToggle = (studentId: string) => {
        const newSet = new Set(selectedStudents)
        if (newSet.has(studentId)) {
            newSet.delete(studentId)
        } else {
            newSet.add(studentId)
        }
        setSelectedStudents(newSet)
    }

    const selectAll = () => {
        if (selectedStudents.size === eligibleStudents.length) {
            setSelectedStudents(new Set())
        } else {
            setSelectedStudents(new Set(eligibleStudents.map(s => s.id)))
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <PlusCircle className="h-5 w-5 text-indigo-500" />
                        Grant Retroactive Access
                    </CardTitle>
                    <CardDescription>
                        Select students who missed the attendance window to grant them a single-use pass to submit attendance retroactively.
                    </CardDescription>
                </CardHeader>
                <form action={action}>
                    <input type="hidden" name="sessionId" value={sessionId} />
                    {Array.from(selectedStudents).map(id => (
                        <input key={id} type="hidden" name="studentIds" value={id} />
                    ))}

                    <CardContent>
                        {state.message && (
                            <div className={`p-3 rounded-md text-sm font-medium mb-4 ${state.errors ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200 flex items-center gap-2'
                                }`}>
                                {state.message === 'Access granted successfully!' && <CheckCircle className="h-4 w-4" />}
                                {state.message}
                            </div>
                        )}

                        {eligibleStudents.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground border rounded-md bg-slate-50 border-dashed">
                                All enrolled students have already submitted attendance for this session!
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-between flex-wrap gap-2 items-center bg-slate-50 p-2 rounded-md">
                                    <Label className="text-sm font-medium text-slate-700">Eligible Students ({eligibleStudents.length})</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={selectAll}>
                                        {selectedStudents.size === eligibleStudents.length ? 'Deselect All' : 'Select All'}
                                    </Button>
                                </div>
                                <div className="border rounded-md divide-y max-h-[300px] overflow-y-auto">
                                    {eligibleStudents.map(student => (
                                        <div key={student.id} className="flex flex-row items-center space-x-3 p-3 hover:bg-slate-50 cursor-pointer" onClick={() => handleCheckboxToggle(student.id)}>
                                            <Checkbox
                                                id={`student-${student.id}`}
                                                checked={selectedStudents.has(student.id)}
                                                onCheckedChange={() => handleCheckboxToggle(student.id)}
                                                onClick={(e) => e.stopPropagation()} // Prevent double trigger
                                            />
                                            <div className="grid leading-none gap-1">
                                                <Label htmlFor={`student-${student.id}`} className="font-medium cursor-pointer">
                                                    {student.full_name}
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    ID: {student.student_id}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {state.errors?.studentIds && (
                                    <p className="text-sm text-red-500">{state.errors.studentIds[0]}</p>
                                )}
                            </div>
                        )}
                    </CardContent>
                    {eligibleStudents.length > 0 && (
                        <CardFooter className="border-t pt-4 bg-slate-50 rounded-b-lg">
                            <Button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700"
                                disabled={isPending || selectedStudents.size === 0}
                            >
                                {isPending ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> granting...</>
                                ) : (
                                    `Grant Access to ${selectedStudents.size} Student${selectedStudents.size === 1 ? '' : 's'}`
                                )}
                            </Button>
                        </CardFooter>
                    )}
                </form>
            </Card>

            {existingPasses.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Issued Passes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-md divide-y">
                            {existingPasses.map((pass: any) => (
                                <div key={pass.id} className="flex justify-between items-center p-3 text-sm">
                                    <div>
                                        <span className="font-medium">{pass.students.full_name}</span>
                                        <span className="text-muted-foreground ml-2">({pass.students.student_id})</span>
                                    </div>
                                    <div>
                                        {pass.used ? (
                                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                Used
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
