'use client'

import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet default marker icon issue in Next.js (CRITICAL - Pitfall 1)
// Source: https://github.com/Leaflet/Leaflet/issues/4968
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface LocationPickerProps {
  initialLat?: number
  initialLng?: number
  initialRadius?: number
  onLocationChange: (lat: number, lng: number, radius: number) => void
}

function MapClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationChange(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export function LocationPicker({
  initialLat = 0,
  initialLng = 0,
  initialRadius = 50,
  onLocationChange,
}: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng])
  const [radius, setRadius] = useState(initialRadius)

  const handleMapClick = (lat: number, lng: number) => {
    setPosition([lat, lng])
    onLocationChange(lat, lng, radius)
  }

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius)
    onLocationChange(position[0], position[1], newRadius)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md overflow-hidden border border-border">
        <MapContainer
          center={position[0] !== 0 && position[1] !== 0 ? position : [51.505, -0.09]} // Default to London if no location set
          zoom={16}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationChange={handleMapClick} />
          {position[0] !== 0 && position[1] !== 0 && (
            <>
              <Marker position={position} />
              <Circle center={position} radius={radius} pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }} />
            </>
          )}
        </MapContainer>
      </div>

      <div className="space-y-2">
        <label htmlFor="radius-slider" className="text-sm font-medium">
          Attendance Radius: {radius} meters
        </label>
        <input
          id="radius-slider"
          type="range"
          min="10"
          max="500"
          step="10"
          value={radius}
          onChange={(e) => handleRadiusChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <p className="text-xs text-muted-foreground">
          Students must be within this radius to submit attendance
        </p>
      </div>

      {position[0] !== 0 && position[1] !== 0 && (
        <div className="text-sm text-muted-foreground">
          <p>Selected location: {position[0].toFixed(6)}, {position[1].toFixed(6)}</p>
        </div>
      )}
    </div>
  )
}
