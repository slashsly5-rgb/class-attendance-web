'use client'

import { useActionState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { studentLogin } from '@/lib/actions/auth'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export function StudentLoginForm() {
    const [state, action, isPending] = useActionState(studentLogin, {})

    return (
        <Card className="w-full max-w-md mx-auto mt-12 shadow-md">
            <CardHeader className="text-center space-y-2">
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    Student Portal
                </CardTitle>
                <CardDescription>
                    Enter your Student ID to access your dashboard and submit attendance.
                </CardDescription>
            </CardHeader>

            <form action={action}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="student_id">Student ID</Label>
                        <Input
                            id="student_id"
                            name="student_id"
                            placeholder="e.g. S12345"
                            required
                            disabled={isPending}
                            autoComplete="username"
                        />
                        {state.error && (
                            <p className="text-sm text-red-500 font-medium">{state.error}</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="w-full space-y-3">
                        <Button type="submit" className="w-full relative overflow-hidden group" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Access Dashboard
                                </span>
                            )}
                            <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-md" />
                        </Button>
                        <Link href="/enroll" className="block">
                            <Button type="button" variant="outline" className="w-full">
                                New student? Enroll first
                            </Button>
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    )
}
