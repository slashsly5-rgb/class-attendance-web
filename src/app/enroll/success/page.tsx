import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export default async function EnrollSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ className?: string; studentName?: string }>
}) {
    const { className, studentName } = await searchParams

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-lg border-primary/20">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full mb-4">
                            <CheckCircle2 className="w-10 h-10 text-primary" />
                        </div>
                        <CardTitle className="text-2xl text-primary">Enrollment Successful!</CardTitle>
                        <CardDescription className="text-lg">
                            You are now enrolled in the class.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        <div className="bg-muted p-4 rounded-lg space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Class:</span>
                                <span className="font-medium text-right">{className || 'Unknown Class'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Student:</span>
                                <span className="font-medium text-right">{studentName || 'Student'}</span>
                            </div>
                        </div>

                        <div className="space-y-4 text-center">
                            <p className="text-sm text-balance text-muted-foreground">
                                There are no active attendance sessions right now. Wait for your lecturer to activate attendance during class, then return here to submit.
                            </p>
                        </div>

                        <Link href="/student" className="block w-full">
                            <Button className="w-full min-h-[44px]">
                                Go to Student Portal
                            </Button>
                        </Link>

                        <Link href="/enroll" className="block w-full">
                            <Button variant="outline" className="w-full min-h-[44px]">
                                Enroll in Another Class
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
