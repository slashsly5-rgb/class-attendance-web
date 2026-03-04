---
phase: 02-class-management-initial-setup
plan: 01
subsystem: validation
tags: [zod, nanoid, react-leaflet, leaflet, validation, code-generation, seeding]

# Dependency graph
requires:
  - phase: 01-project-setup-infrastructure
    provides: Next.js framework, TypeScript configuration, Supabase integration
provides:
  - Zod validation schema for class form data with TypeScript types
  - Unique class code generator using nanoid with custom alphabet
  - Database seed file for 6 initial classes (3 Bachelor, 3 Master)
affects: [02-02-server-actions, 02-03-ui-components, class-management, database]

# Tech tracking
tech-stack:
  added: [zod@4.3.6, nanoid@5.1.6, react-leaflet@5.0.0, leaflet@1.9.4, @types/leaflet@1.9.21]
  patterns: [Zod validation schemas, nanoid code generation, database seeding]

key-files:
  created:
    - src/lib/validations/class.ts
    - src/lib/utils/code-generator.ts
    - supabase/seed.sql
  modified:
    - package.json
    - package-lock.json

key-decisions:
  - "Used Zod v4 API with direct message parameter instead of errorMap for enum validation"
  - "Implemented 8-character class codes with custom alphabet excluding ambiguous characters (0/O, 1/I)"
  - "Set all location fields to NULL in seed data for lecturer configuration via UI"
  - "Used ON CONFLICT DO NOTHING in seed.sql to prevent duplicate insertions"

patterns-established:
  - "Validation Pattern: Zod schemas in src/lib/validations/ with exported TypeScript types"
  - "Utility Pattern: Reusable utilities in src/lib/utils/ with single-purpose functions"
  - "Seeding Pattern: supabase/seed.sql for development data with conflict handling"

requirements-completed: [FR-10]

# Metrics
duration: 5min
completed: 2026-03-04
---

# Phase 02 Plan 01: Class Management Foundation Summary

**Type-safe Zod validation with class code generation using nanoid and database seeding for 6 initial classes**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-04T13:49:34Z
- **Completed:** 2026-03-04T13:54:23Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments
- Installed validation and map dependencies (zod, nanoid, react-leaflet, leaflet)
- Created Zod schema for class form validation with ClassFormData type
- Implemented unique class code generator using nanoid with custom alphabet
- Created seed.sql with 6 classes matching FR-10 requirements

## Task Commits

Each task was committed atomically:

1. **Task 1: Install validation and map dependencies** - `8eecf7c` (chore)
2. **Task 2: Create validation schemas and code generator utility** - `3fe1bf4` (feat)
3. **Task 3: Create seed.sql for 6 initial classes** - `b68ee35` (feat)

## Files Created/Modified
- `package.json` - Added zod, nanoid, react-leaflet, leaflet dependencies
- `package-lock.json` - Locked dependency versions
- `src/lib/validations/class.ts` - Zod schema for class validation with ClassFormData type
- `src/lib/utils/code-generator.ts` - generateClassCode function using nanoid
- `supabase/seed.sql` - Seed data for 6 initial classes (3 Bachelor, 3 Master)

## Decisions Made
- **Zod v4 API:** Used direct `message` parameter instead of `errorMap` for enum validation to match Zod v4 syntax
- **Custom Alphabet:** Excluded ambiguous characters (0/O, 1/I) from class code generation to improve readability
- **Nullable Locations:** Made location_lat/lng nullable to support optional location configuration during class creation
- **Default Radius:** Set location_radius default to 50 meters as reasonable initial geofence
- **Conflict Handling:** Added ON CONFLICT DO NOTHING to seed.sql to safely handle multiple seed runs

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Zod v4 enum syntax**
- **Found during:** Task 2 (Creating validation schema)
- **Issue:** Plan used Zod v3 syntax with `errorMap` function, but project has Zod v4 which uses direct `message` parameter
- **Fix:** Changed `errorMap: () => ({ message: '...' })` to `message: '...'` in degree_level enum
- **Files modified:** src/lib/validations/class.ts
- **Verification:** TypeScript compilation passed with no errors
- **Committed in:** 3fe1bf4 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Auto-fix necessary for TypeScript compilation. No scope creep.

## Issues Encountered
None - all tasks executed smoothly after fixing Zod v4 syntax

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Validation schemas ready for Server Actions to consume
- Code generator ready for unique class code creation
- Seed data ready for database initialization via `supabase db reset`
- Foundation complete for implementing class CRUD operations in Plan 02-02

## Self-Check

Verifying all created files and commits exist:

**Files:**
- FOUND: package.json
- FOUND: package-lock.json
- FOUND: src/lib/validations/class.ts
- FOUND: src/lib/utils/code-generator.ts
- FOUND: supabase/seed.sql

**Commits:**
- FOUND: 8eecf7c
- FOUND: 3fe1bf4
- FOUND: b68ee35

**Self-Check: PASSED** - All files and commits verified successfully.

---
*Phase: 02-class-management-initial-setup*
*Completed: 2026-03-04*
