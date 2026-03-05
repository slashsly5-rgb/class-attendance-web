'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { createClass } from '@/lib/actions/classes'
import { ClassForm } from '@/components/features/classes/ClassForm'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// Dynamic import to prevent SSR (CRITICAL - Pitfall 2)
const LocationPicker = dynamic(
  () => import('@/components/features/classes/LocationPicker').then(mod => ({ default: mod.LocationPicker })),
  { ssr: false, loading: () => <p className="text-sm text-muted-foreground">Loading map...</p> }
)

export default function NewClassPage() {
  const [location, setLocation] = useState<{ lat: number | null, lng: number | null, radius: number }>({ lat: null, lng: null, radius: 50 })
  const handleLocationChange = (lat: number, lng: number, radius: number) => {
    setLocation({ lat, lng, radius })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/lecturer">
          <Button variant="outline" className="mb-4">← Back to Dashboard</Button>
        </Link>
        <h1 className="text-3xl font-bold">Create New Class</h1>
        <p className="text-muted-foreground mt-1">Add a new class with enrollment code and location settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Class Details</CardTitle>
            <CardDescription>Enter the basic information for your class</CardDescription>
          </CardHeader>
          <CardContent>
            <ClassForm
              action={createClass}
              defaultValues={{
                semester: 'Semester 2 2025/2026',
                location_lat: location.lat,
                location_lng: location.lng,
                location_radius: location.radius
              }}
              submitLabel="Create Class"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Class Location</CardTitle>
            <CardDescription>Set the geographic area where students can mark attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <LocationPicker
              initialLat={location.lat || 0}
              initialLng={location.lng || 0}
              initialRadius={location.radius}
              onLocationChange={handleLocationChange}
            />
            <p className="text-xs text-muted-foreground mt-4">
              Tip: Click on the map to set your classroom location. Students must be within the radius to submit attendance.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
