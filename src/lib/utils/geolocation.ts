'use client'

import { useState, useCallback } from 'react'

export interface Coordinates {
    lat: number
    lng: number
    accuracy: number
}

export type GeolocationError =
    | 'PERMISSION_DENIED'
    | 'POSITION_UNAVAILABLE'
    | 'TIMEOUT'
    | 'NOT_SUPPORTED'
    | null

/**
 * Calculates the great-circle distance between two points on the Earth's surface
 * using the Haversine formula.
 * 
 * @param lat1 Latitude of point 1 in decimal degrees
 * @param lon1 Longitude of point 1 in decimal degrees
 * @param lat2 Latitude of point 2 in decimal degrees
 * @param lon2 Longitude of point 2 in decimal degrees
 * @returns Distance in meters
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180 // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    const d = R * c // in meters
    return d
}

/**
 * A custom React hook for managing the browser's Geolocation API.
 */
export function useGeolocation() {
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
    const [error, setError] = useState<GeolocationError>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const requestPermission = useCallback(() => {
        if (!('geolocation' in navigator)) {
            setError('NOT_SUPPORTED')
            return
        }

        setIsLoading(true)
        setError(null)
        setCoordinates(null)

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setIsLoading(false)
                setCoordinates({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    // Extract accuracy radius in meters
                    accuracy: position.coords.accuracy,
                })
            },
            (err) => {
                setIsLoading(false)
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError('PERMISSION_DENIED')
                        break
                    case err.POSITION_UNAVAILABLE:
                        setError('POSITION_UNAVAILABLE')
                        break
                    case err.TIMEOUT:
                        setError('TIMEOUT')
                        break
                    default:
                        setError('POSITION_UNAVAILABLE')
                }
            },
            {
                enableHighAccuracy: true, // Request best possible accuracy for attendance checking
                timeout: 10000, // 10 second timeout
                maximumAge: 0, // Force a fresh location reading
            }
        )
    }, [])

    return { coordinates, error, requestPermission, isLoading }
}
