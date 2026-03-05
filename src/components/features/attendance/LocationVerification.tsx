'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { calculateDistance, useGeolocation, type Coordinates } from '@/lib/utils/geolocation'
import { AlertCircle, CheckCircle2, MapPin, MapPinOff, KeyRound } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface LocationVerificationProps {
    classLat: number | null
    classLng: number | null
    classRadius: number
    onVerified: (isValid: boolean, distance: number | null) => void
    children: React.ReactNode
}

export function LocationVerification({
    classLat,
    classLng,
    classRadius,
    onVerified,
    children
}: LocationVerificationProps) {
    const { coordinates, error, isLoading, requestPermission } = useGeolocation()
    const [distance, setDistance] = useState<number | null>(null)
    const [isVerified, setIsVerified] = useState<boolean>(false)

    // Override state
    const [showOverride, setShowOverride] = useState(false)
    const [overrideCode, setOverrideCode] = useState('')
    const [overrideError, setOverrideError] = useState(false)

    const handleOverrideSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Simple hardcoded override for MVP. 
        if (overrideCode === 'EMERGENCY123') {
            setIsVerified(true)
            onVerified(true, null)
            setOverrideError(false)
        } else {
            setOverrideError(true)
        }
    }

    // If the class has no location set, skip verification
    const isLocationRequired = classLat !== null && classLng !== null

    useEffect(() => {
        if (!isLocationRequired) {
            setIsVerified(true)
            onVerified(true, null)
            return
        }

        if (coordinates && classLat !== null && classLng !== null && !isVerified) {
            const dist = calculateDistance(
                coordinates.lat,
                coordinates.lng,
                classLat,
                classLng
            )

            setDistance(Math.round(dist))

            const isWithinRadius = dist <= classRadius
            setIsVerified(isWithinRadius)
            onVerified(isWithinRadius, dist)
        }
    }, [coordinates, classLat, classLng, classRadius, isLocationRequired, onVerified])

    if (!isLocationRequired || isVerified) {
        return (
            <div className="space-y-4">
                {isVerified && isLocationRequired && (
                    <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                            <p className="font-medium text-sm">Location Verified</p>
                            <p className="text-xs text-green-700">
                                {distance !== null ? `You are ${distance} meters from the classroom center.` : 'Verified via Instructor Override.'}
                            </p>
                        </div>
                    </div>
                )}
                {children}
            </div>
        )
    }

    // Pre-verification states
    if (!coordinates && !error && !isLoading) {
        return (
            <Card className="border-blue-200 bg-blue-50/50">
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                        <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-1">Location Verification Required</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mb-4">
                            To submit attendance for this class, you must be physically present within {classRadius} meters of the classroom.
                        </p>
                        <Button onClick={requestPermission} className="w-full sm:w-auto">
                            Verify My Location
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (isLoading) {
        return (
            <Card className="border-blue-200 bg-blue-50/50">
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full animate-pulse">
                        <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-1">Acquiring GPS Signal...</h3>
                        <p className="text-sm text-muted-foreground">Please wait while we determine your location.</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        let errorMessage = "Unable to determine your location."
        if (error === 'PERMISSION_DENIED') {
            errorMessage = "You denied browser location permissions. Please enable them in your browser settings to submit attendance."
        } else if (error === 'POSITION_UNAVAILABLE') {
            errorMessage = "GPS signal is currently unavailable. Ensure your device's location services are turned on."
        } else if (error === 'TIMEOUT') {
            errorMessage = "The location request timed out. Please try again."
        } else if (error === 'NOT_SUPPORTED') {
            errorMessage = "Your browser does not support Geolocation."
        }

        return (
            <Card className="border-red-200 bg-red-50/50">
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-red-100 text-red-600 rounded-full">
                        <MapPinOff className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-1 text-red-800">Location Error</h3>
                        <p className="text-sm text-red-600/90 max-w-sm mb-4">
                            {errorMessage}
                        </p>
                        <Button variant="outline" onClick={requestPermission} className="w-full sm:w-auto">
                            Retry Verification
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Post verification - Out of bounds
    if (coordinates && distance !== null && distance > classRadius) {
        return (
            <Card className="border-amber-200 bg-amber-50/50">
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-1 text-amber-800">You are too far away</h3>
                        <p className="text-sm text-amber-700/90 max-w-sm mb-4">
                            You are currently <strong>{distance} meters</strong> from the classroom. You must be within {classRadius} meters to submit attendance.
                        </p>
                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                            <Button onClick={requestPermission}>Check Location Again</Button>
                            <p className="text-xs text-amber-600">If you are in the classroom, try moving closer to a window or refreshing the page.</p>
                        </div>
                    </div>

                    <div className="w-full mt-6 pt-4 border-t border-amber-200/50">
                        {!showOverride ? (
                            <Button variant="ghost" size="sm" onClick={() => setShowOverride(true)} className="text-amber-700 hover:text-amber-800 hover:bg-amber-100">
                                <KeyRound className="h-4 w-4 mr-2" />
                                Instructor Override
                            </Button>
                        ) : (
                            <form onSubmit={handleOverrideSubmit} className="flex flex-col items-center gap-2 max-w-xs mx-auto">
                                <div className="w-full">
                                    <Input
                                        placeholder="Enter override code"
                                        value={overrideCode}
                                        onChange={(e) => setOverrideCode(e.target.value)}
                                        className={`bg-white ${overrideError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                    />
                                    {overrideError && <p className="text-xs text-red-500 mt-1 text-left">Invalid override code</p>}
                                </div>
                                <div className="flex gap-2 w-full">
                                    <Button type="submit" size="sm" className="flex-1">Verify Code</Button>
                                    <Button type="button" variant="outline" size="sm" onClick={() => setShowOverride(false)}>Cancel</Button>
                                </div>
                            </form>
                        )}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return null
}
