'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { activateSession, closeSession } from '@/lib/actions/attendance'
import Link from 'next/link'

interface Session {
    id: string
    class_id: string
    session_date: string
    session_time: string
    is_active: boolean
    is_retroactive: boolean
    activated_at: string | null
    closed_at: string | null
}

interface SessionListProps {
    sessions: Session[]
    classId: string
}

export function SessionList({ sessions, classId }: SessionListProps) {
    const [isUpdating, setIsUpdating] = useState<string | null>(null)

    const handleActivate = async (sessionId: string) => {
        setIsUpdating(sessionId)
        await activateSession(sessionId, classId)
        setIsUpdating(null)
    }

    const handleClose = async (sessionId: string) => {
        setIsUpdating(sessionId)
        await closeSession(sessionId, classId)
        setIsUpdating(null)
    }

    if (sessions.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6 text-center text-muted-foreground p-12">
                    No attendance sessions have been created for this class yet.
                    Use the form above to schedule one.
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {sessions.map((session) => {
                // Simple formatting
                const date = new Date(session.session_date).toLocaleDateString()
                const time = session.session_time.substring(0, 5) // "HH:MM"

                return (
                    <Card key={session.id} className={`overflow-hidden transition-colors ${session.is_active ? 'border-green-500 shadow-md ring-1 ring-green-500/20' : ''}`}>
                        <CardHeader className="pb-3 border-b bg-muted/20">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        {date} at {time}
                                        {session.is_active && (
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 animate-pulse">
                                                Active Now
                                            </span>
                                        )}
                                        {session.closed_at && !session.is_active && (
                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                                Closed
                                            </span>
                                        )}
                                    </CardTitle>
                                </div>
                                {session.is_active ? (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleClose(session.id)}
                                        disabled={isUpdating === session.id}
                                    >
                                        {isUpdating === session.id ? 'Closing...' : 'Close Session'}
                                    </Button>
                                ) : (
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleActivate(session.id)}
                                        disabled={isUpdating === session.id || !!session.closed_at} // Don't easily allow re-activating a closed session for now
                                    >
                                        {isUpdating === session.id ? 'Activating...' : 'Activate'}
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 text-sm text-muted-foreground">
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <div>
                                    <span className="font-medium text-foreground">Retroactive Allowed:</span>{' '}
                                    {session.is_retroactive ? 'Yes' : 'No'}
                                </div>
                                {session.activated_at && (
                                    <div>
                                        <span className="font-medium text-foreground">Activated:</span>{' '}
                                        {new Date(session.activated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end pt-2 border-t mt-2">
                                <Link href={`/lecturer/classes/${classId}/sessions/${session.id}`}>
                                    <Button variant="outline" size="sm">Manage Session</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
