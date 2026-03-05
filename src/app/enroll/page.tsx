import { EnrollmentForm } from '@/components/features/students/EnrollmentForm'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function EnrollPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">Class Attendance System</h1>
                    <p className="text-muted-foreground mt-2">Student Portal</p>
                </div>

                <Card className="shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Enroll in a Class</CardTitle>
                        <CardDescription>
                            Enter the unique class code provided by your lecturer to join.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <EnrollmentForm />
                        <Link href="/student" className="block mt-3">
                            <Button variant="outline" className="w-full min-h-[44px]">
                                Back to Student Portal
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-muted-foreground mt-8">
                    By enrolling, you agree to allow your location to be verified during attendance sessions.
                </p>
            </div>
        </div>
    )
}
