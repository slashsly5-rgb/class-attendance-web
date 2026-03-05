// Centralized attendance threshold configuration
// Single source of truth for attendance health indicators

export const ATTENDANCE_THRESHOLDS = {
  excellent: 85, // >= 85% attendance is excellent
  warning: 70,   // >= 70% attendance is warning, < 70% is critical
} as const

export const AT_RISK_ABSENCE_COUNT = 2 // Students with 2+ absences are flagged at risk

export type HealthStatus = 'excellent' | 'warning' | 'critical'

export type HealthColor = {
  border: string
  bg: string
  text: string
}

/**
 * Determines health status based on attendance percentage
 * @param percentage - Attendance percentage (0-100)
 * @returns Health status: 'excellent', 'warning', or 'critical'
 */
export function getHealthStatus(percentage: number | null | undefined): HealthStatus {
  // Handle edge cases: NaN, null, undefined
  if (percentage === null || percentage === undefined || isNaN(percentage)) {
    return 'critical'
  }

  if (percentage >= ATTENDANCE_THRESHOLDS.excellent) {
    return 'excellent'
  }

  if (percentage >= ATTENDANCE_THRESHOLDS.warning) {
    return 'warning'
  }

  return 'critical'
}

/**
 * Maps health status to Tailwind CSS color classes
 * @param status - Health status
 * @returns Object with border, bg, and text color classes
 */
export function getHealthColor(status: HealthStatus): HealthColor {
  switch (status) {
    case 'excellent':
      return {
        border: 'border-green-500',
        bg: 'bg-green-50',
        text: 'text-green-700',
      }
    case 'warning':
      return {
        border: 'border-yellow-500',
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
      }
    case 'critical':
      return {
        border: 'border-red-500',
        bg: 'bg-red-50',
        text: 'text-red-700',
      }
  }
}
