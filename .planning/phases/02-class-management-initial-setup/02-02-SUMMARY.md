---
phase: 02-class-management-initial-setup
plan: 02
subsystem: server-actions
tags: [server-actions, leaflet, react-leaflet, zod, map, location-picker, crud]

# Dependency graph
requires:
  - phase: 02-class-management-initial-setup
    plan: 01
    provides: Zod validation schema, unique class code generator
provides:
  - Server Actions for class CRUD operations (create, update, fetch)
  - LocationPicker component with interactive Leaflet map for location selection
  - Retry logic for unique code collision handling
  - Cache revalidation for Next.js App Router
affects: [02-03-ui-components, class-management, lecturer-dashboard]

# Tech tracking
tech-stack:
  added: []
  patterns: [Server Actions with 'use server', Zod validation in actions, Leaflet marker icon fix, dynamic imports with ssr:false, cache revalidation]

key-files:
  created:
    - src/lib/actions/classes.ts
    - src/components/features/classes/LocationPicker.tsx
  modified: []

key-decisions:
  - "Implemented 3-attempt retry logic for unique code collision handling (Postgres error code 23505)"
  - "Applied Leaflet marker icon fix using CDN URLs to prevent 404 in production builds"
  - "Set default map center to London [51.505, -0.09] when no location provided"
  - "Radius slider range set to 10-500 meters with 10-meter steps for granular control"
  - "Called revalidatePath before redirect in Server Actions per Next.js best practices"

patterns-established:
  - "Server Action Pattern: 'use server' directive, FormData parsing, Zod validation, structured error returns"
  - "Map Component Pattern: Client-side only with Leaflet CSS import, marker icon override, click handler hook"
  - "Error Handling Pattern: Check Supabase error codes, return structured errors matching useActionState shape"

requirements-completed: [FR-10]

# Metrics
duration: 2min
completed: 2026-03-04
---

# Phase 02 Plan 02: Server Actions and LocationPicker Summary

**Server Actions for class CRUD with Zod validation and interactive Leaflet map component for geofenced attendance**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-04T13:59:55Z
- **Completed:** 2026-03-04T14:01:48Z
- **Tasks:** 2
- **Files created:** 2

## Accomplishments
- Created Server Actions for createClass, updateClass, getClasses, getClassById
- Implemented unique code collision handling with 3-attempt retry logic
- Applied Zod validation with structured error responses for forms
- Created LocationPicker component with Leaflet map integration
- Fixed Leaflet marker icons for Next.js production builds (CDN override)
- Added radius slider (10-500m) with visual circle indicator on map
- Implemented cache revalidation before redirects per Next.js best practices

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Server Actions for class CRUD operations** - `e1ebc71` (feat)
2. **Task 2: Create LocationPicker map component with Leaflet** - `988d0f4` (feat)

## Files Created/Modified
- `src/lib/actions/classes.ts` - Server Actions with 'use server', Zod validation, retry logic, cache revalidation (140 lines)
- `src/components/features/classes/LocationPicker.tsx` - Client component with Leaflet map, marker icon fix, radius slider (100 lines)

## Decisions Made
- **Unique Code Collision Retry:** Implemented 3-attempt retry loop checking Postgres error code 23505 (unique constraint violation) before failing
- **Leaflet Icon Fix:** Override default marker icons with CDN URLs to prevent 404 errors in Next.js production builds (Pitfall 1 from research)
- **Default Map Center:** Set to London [51.505, -0.09] when initialLat/initialLng are 0 (Open Question 1 resolution)
- **Radius Granularity:** 10-meter step for slider to allow precise geofence configuration (10-500m range)
- **Cache Revalidation:** Always call revalidatePath() before redirect() in Server Actions to ensure UI reflects updated data (Pitfall 3 fix)
- **Location Optional:** Support null location_lat/lng in validation to allow class creation without location (configurable later via UI)

## Deviations from Plan

None - plan executed exactly as written. All patterns from 02-RESEARCH.md successfully applied:
- Pattern 1: Server Actions with 'use server' directive
- Pattern 3: Zod validation with structured error objects
- Pattern 4: nanoid generateClassCode() with retry logic
- Pattern 6: React Leaflet with MapClickHandler hook
- Pattern 7: Supabase CRUD operations
- Pitfall fixes: Marker icon override (Pitfall 1), Leaflet CSS import (Pitfall 9), cache revalidation (Pitfall 3), error handling (Pitfall 7)

## Issues Encountered
None - TypeScript compilation passed on first attempt for both tasks. All dependencies from Plan 02-01 available and correctly typed.

## User Setup Required
None - components are ready for integration in UI pages (Plan 02-03).

**IMPORTANT:** LocationPicker must be dynamically imported with `ssr: false` in parent pages to avoid server-side rendering errors:
```typescript
const LocationPicker = dynamic(
  () => import('@/components/features/classes/LocationPicker').then(mod => ({ default: mod.LocationPicker })),
  { ssr: false, loading: () => <p>Loading map...</p> }
)
```

## Next Phase Readiness
- Server Actions ready for form integration in lecturer UI pages
- LocationPicker ready for class creation/edit forms
- All exports available: createClass, updateClass, getClasses, getClassById, LocationPicker
- Foundation complete for Plan 02-03 UI implementation

## Self-Check

Verifying all created files and commits exist:

**Files:**
- FOUND: src/lib/actions/classes.ts
- FOUND: src/components/features/classes/LocationPicker.tsx

**Commits:**
- FOUND: e1ebc71
- FOUND: 988d0f4

**TypeScript Compilation:** PASSED (npx tsc --noEmit)

**Exports Verified:**
- Server Actions: createClass, updateClass, getClasses, getClassById (all with 'use server')
- Component: LocationPicker (named export, client component)
- Validation: classSchema imported correctly
- Code Generator: generateClassCode imported correctly

**Self-Check: PASSED** - All files, commits, and exports verified successfully.

---
*Phase: 02-class-management-initial-setup*
*Completed: 2026-03-04*
