'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { getClassById, updateClass } from '@/lib/actions/classes'
import { ClassForm } from '@/components/features/classes/ClassForm'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { use } from 'react'

const LocationPicker = dynamic(
  () => import('@/components/features/classes/LocationPicker').then(mod => ({ default: mod.LocationPicker })),
  { ssr: false, loading: () => <p className="text-sm text-muted-foreground">Loading map...</p> }
)

export default function EditClassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [classData, setClassData] = useState<any>(null)
  const [location, setLocation] = useState({ lat: 0, lng: 0, radius: 50 })

  useEffect(() => {
    getClassById(id).then(data => {
      setClassData(data)
      setLocation({
        lat: data.location_lat || 0,
        lng: data.location_lng || 0,
        radius: data.location_radius || 50
      })
    })
  }, [id])

  const handleLocationChange = (lat: number, lng: number, radius: number) => {
    setLocation({ lat, lng, radius })
    const latInput = document.getElementById('location_lat') as HTMLInputElement
    const lngInput = document.getElementById('location_lng') as HTMLInputElement
    const radiusInput = document.getElementById('location_radius') as HTMLInputElement
    if (latInput) latInput.value = lat.toString()
    if (lngInput) lngInput.value = lng.toString()
    if (radiusInput) radiusInput.value = radius.toString()
  }

  if (!classData) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href={`/lecturer/classes/${id}`}>
          <Button variant="outline" className="mb-4">← Back to Class</Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Class</h1>
        <p className="text-muted-foreground mt-1">Update class details and location settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Class Details</CardTitle>
            <CardDescription>
              Class Code: <span className="font-mono font-bold">{classData.code}</span> (cannot be changed)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClassForm
              action={updateClass.bind(null, id)}
              defaultValues={{
                name: classData.name,
                degree_level: classData.degree_level,
                semester: classData.semester,
                location_lat: classData.location_lat,
                location_lng: classData.location_lng,
                location_radius: classData.location_radius
              }}
              submitLabel="Update Class"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Class Location</CardTitle>
            <CardDescription>Update the geographic attendance area</CardDescription>
          </CardHeader>
          <CardContent>
            <LocationPicker
              initialLat={location.lat}
              initialLng={location.lng}
              initialRadius={location.radius}
              onLocationChange={handleLocationChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
