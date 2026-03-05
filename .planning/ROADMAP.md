# Project Roadmap: Class Attendance System

## Overview
This roadmap breaks down the development of the Class Attendance System into manageable phases, from initial setup through deployment and refinement.

---

## Phase 1: Project Setup & Infrastructure
**Goal**: Establish development environment, hosting, and database foundation.

**Requirements:** NFR-4, NFR-5, NFR-7, FR-10

**Plans:** 5 plans

Plans:
- [ ] 01-01-PLAN.md — Initialize Next.js project with TypeScript, Tailwind, and shadcn/ui
- [ ] 01-02-PLAN.md — Create Supabase project and obtain API credentials
- [ ] 01-03-PLAN.md — Create database schema with migrations and configure Supabase clients
- [ ] 01-04-PLAN.md — Set up GitHub repository and Vercel deployment pipeline
- [ ] 01-05-PLAN.md — Verify end-to-end deployment and database connectivity


### Tasks
1. Initialize Next.js project with TypeScript
2. Set up GitHub repository
3. Configure Vercel deployment with automatic CI/CD
4. Create Supabase project and obtain API keys
5. Set up environment variables (local and Vercel)
6. Install and configure UI component library (shadcn/ui recommended)
7. Configure Tailwind CSS for responsive design
8. Set up basic project structure (folders: components, pages/app, lib, types)
9. Create initial database schema in Supabase:
   - Classes table
   - Students table
   - AttendanceSessions table
   - AttendanceRecords table
   - RetroactiveAccess table
10. Set up Supabase client utilities
11. Test deployment pipeline (GitHub → Vercel)

**Success Criteria**:
- Application deploys successfully to Vercel
- Database schema created in Supabase
- Can query database from application
- Environment variables working in production

**Dependencies**: None

**Estimated Duration**: 1-2 days

---

## Phase 2: Class Management & Initial Setup
**Goal**: Enable lecturer to create and manage classes with enrollment codes.

**Requirements:** FR-10

**Plans:** 3 plans

Plans:
- [ ] 02-01-PLAN.md — Install dependencies and create validation foundation with Zod schemas and seed data
- [ ] 02-02-PLAN.md — Implement Server Actions for CRUD operations and LocationPicker map component
- [ ] 02-03-PLAN.md — Build lecturer UI (dashboard, create, detail, edit pages)

### Tasks
1. Create Class model and database operations (CRUD)
2. Build lecturer class creation page
   - Form: Class name, degree level, semester
   - Generate unique class code (6-8 characters)
3. Create class list/dashboard view for lecturer
4. Implement class detail page (empty state for now)
5. Add ability to edit class details
6. Implement location setting for each class:
   - Map interface to set lat/lng coordinates
   - Set radius (default 50 meters)
7. Seed database with 6 initial classes:
   - Management Information Systems (Bachelor)
   - E-Commerce (Bachelor)
   - Management Information Systems (Master)
   - Operation Management (Master)
   - Integrated Project (Master)
   - Computer Aided Design (Bachelor)
8. Create simple navigation between lecturer views

**Success Criteria**:
- Lecturer can create new class
- Unique codes generated automatically
- 6 initial classes visible in dashboard
- Can edit class details
- Location coordinates set for each class

**Dependencies**: Phase 1

**Estimated Duration**: 2-3 days

---

## Phase 3: Student Enrollment
**Goal**: Students can self-enroll in classes using class codes.

### Tasks
1. Create Student model and database operations
2. Build student enrollment landing page
3. Create enrollment form:
   - Class code input
   - Full name input
   - Student ID input
4. Implement class code validation
5. Prevent duplicate enrollment (same Student ID per class)
6. Create student success/confirmation page showing enrolled classes
7. Add enrolled student list to lecturer class detail page
8. Handle edge cases:
   - Invalid class code
   - Already enrolled
   - Empty/invalid inputs

**Success Criteria**:
- Student can enroll with valid class code
- Duplicate prevention works
- Enrolled students appear in lecturer class view
- Clear error messages for invalid inputs

**Dependencies**: Phase 2

**Estimated Duration**: 2 days

---

## Phase 4: Attendance Session Management
**Goal**: Lecturer can create and activate attendance sessions.

### Tasks
1. Create AttendanceSession model and database operations
2. Build "Create Attendance" form in class detail page:
   - Select date (past, present, or future)
   - Select time
   - Mark as retroactive if needed
3. Display list of all sessions for a class (chronological)
4. Implement "Activate Attendance" button for each session
5. Add real-time status indicator (Active/Inactive)
6. Implement "Close Attendance" button for active sessions
7. Store activation and closure timestamps
8. Make interface mobile-friendly with large touch targets
9. Add visual differentiation for active sessions
10. Implement session filtering (active, past, upcoming)

**Success Criteria**:
- Lecturer can create sessions for any date
- Can activate/deactivate sessions
- Active sessions clearly visible
- Interface works smoothly on mobile
- Sessions persist in database

**Dependencies**: Phase 3

**Estimated Duration**: 3 days

---

## Phase 5: Location-Based Verification
**Goal**: Implement geolocation verification for attendance submission.

### Tasks
1. Create geolocation utility functions:
   - Request browser permission
   - Get current coordinates
   - Calculate distance between two points (Haversine formula)
2. Implement location verification logic:
   - Compare student location to class location
   - Check if within acceptable radius
3. Build location permission request UI
4. Create error handling for:
   - Permission denied
   - Location unavailable
   - Out of range
5. Add lecturer override option (emergency bypass)
6. Test location accuracy on different devices
7. Add fallback messaging if geolocation not supported

**Success Criteria**:
- System requests location permission appropriately
- Accurately calculates distance
- Blocks submission if outside radius
- Clear error messages
- Lecturer can override if needed

**Dependencies**: Phase 4

**Estimated Duration**: 2-3 days

---

## Phase 6: Student Attendance Submission
**Goal**: Students can submit attendance when sessions are active.

### Tasks
1. Create AttendanceRecord model and database operations
2. Build student dashboard showing enrolled classes
3. Display active attendance sessions for student's classes
4. Create attendance submission form:
   - Radio buttons: Attend, Not Attend, Late
   - Conditional reason text field (for Not Attend/Late)
5. Integrate location verification before submission
6. Implement submission logic:
   - Validate session is active
   - Validate student enrolled in class
   - Prevent duplicate submission
   - Store attendance record with timestamp
7. Show confirmation message after submission
8. Display past attendance history for student (optional feature)
9. Handle edge cases:
   - Session closed during submission
   - Network errors
   - Invalid data

**Success Criteria**:
- Students see only active sessions for their classes
- Can submit with all three status options
- Reason field required for Not Attend/Late
- Location verified before acceptance
- Cannot submit twice for same session
- Clear confirmation after submission

**Dependencies**: Phase 5

**Estimated Duration**: 3-4 days

---

## Phase 7: Retroactive Attendance & Special Cases
**Goal**: Lecturer can grant access to past sessions for specific students.

### Tasks
1. Create RetroactiveAccess model and database operations
2. Add "Grant Retroactive Access" interface in session detail:
   - Select session
   - Select student(s)
   - Grant access button
3. Modify student view to show retroactively accessible sessions
4. Mark retroactive submissions in database (flag)
5. Add audit trail showing who granted access and when
6. Display retroactive attendance differently in reports
7. Implement access expiration (optional: time-limited access)

**Success Criteria**:
- Lecturer can grant access to specific students for past sessions
- Selected students can submit for those sessions
- Other students cannot access closed sessions
- Retroactive submissions clearly marked
- Audit trail maintained

**Dependencies**: Phase 6

**Estimated Duration**: 2 days

---

## Phase 8: Lecturer Dashboard & Analytics
**Goal**: Comprehensive dashboard showing attendance across all classes.

**Requirements:** FR-7, FR-8

**Plans:** 3 plans

Plans:
- [x] 08-01-PLAN.md — Create analytics Server Actions with optimized queries and threshold utilities
- [ ] 08-02-PLAN.md — Build analytics-enhanced dashboard with color-coded class cards
- [ ] 08-03-PLAN.md — Create detailed class analytics page with sortable student roster

### Tasks
1. Build main lecturer dashboard with overview cards for all 6 classes
2. Calculate and display per class:
   - Total sessions conducted
   - Total enrolled students
   - Average attendance rate
   - Number of students with 2+ absences
3. Implement visual indicators:
   - Color coding for attendance health (green/yellow/red)
   - Badges for students at risk
4. Create drill-down navigation to class details
5. Build detailed class view showing:
   - Student roster with attendance summary
   - Per-student metrics (total sessions, absences, late, percentage)
   - Session history
6. Add filtering and sorting:
   - Sort by name, attendance rate, absences
   - Filter by attendance status
7. Implement search functionality for students
8. Add visual charts (optional):
   - Attendance trends over time
   - Class comparison

**Success Criteria**:
- Dashboard loads quickly with all class summaries
- Accurate calculations for all metrics
- Students with 2+ absences highlighted
- Can drill into individual class details
- Filtering and sorting work correctly
- Mobile-friendly layout

**Dependencies**: Phase 7

**Estimated Duration**: 3-4 days

---

## Phase 9: Download & Export Functionality
**Goal**: Lecturer can download attendance reports per class.

### Tasks
1. Implement CSV export functionality:
   - Install csv-writer or similar library
   - Create export function for class attendance
2. Structure export data:
   - Headers: Student ID, Name, Session Dates (columns), Total Present, Total Absent, Total Late, Percentage
   - Rows: One per student
   - Cells: Status for each session + reasons
3. Add "Download Report" button to class detail page
4. Generate filename with class name and current date
5. Implement Excel export (optional, using xlsx library)
6. Add export options modal:
   - Choose format (CSV/Excel)
   - Date range filter
   - Include reasons toggle
7. Test download on mobile and desktop browsers
8. Handle large datasets (100+ students)

**Success Criteria**:
- CSV export downloads correctly
- All attendance data included accurately
- File named appropriately
- Works on mobile and desktop
- Handles large classes without performance issues

**Dependencies**: Phase 8

**Estimated Duration**: 2 days

---

## Phase 10: UI/UX Polish & Mobile Optimization
**Goal**: Beautiful, intuitive interface that works flawlessly on mobile.

### Tasks
1. Implement consistent design system:
   - Color palette
   - Typography scale
   - Spacing system
   - Component variants
2. Add loading states for all async operations
3. Implement error boundaries and error pages
4. Add skeleton loaders for data fetching
5. Optimize mobile layouts:
   - Touch-friendly buttons (min 44x44px)
   - Readable text sizes
   - Proper spacing for thumbs
   - Bottom navigation for students
6. Add micro-interactions and animations
7. Implement responsive tables (stack on mobile)
8. Add empty states with helpful messages
9. Optimize images and assets
10. Test on various devices (iOS, Android, tablets)
11. Add dark mode support (optional enhancement)

**Success Criteria**:
- Consistent visual design across all pages
- Smooth interactions and transitions
- Fully responsive on all screen sizes
- Fast loading times
- No layout shifts or jank
- Passes mobile usability tests

**Dependencies**: Phase 9

**Estimated Duration**: 3 days

---

## Phase 11: Testing & Bug Fixes
**Goal**: Ensure system works reliably under real-world conditions.

### Tasks
1. Write unit tests for critical functions:
   - Distance calculation
   - Attendance validation
   - Data exports
2. Perform integration testing:
   - Full enrollment flow
   - Full attendance submission flow
   - Retroactive access flow
3. Test edge cases:
   - Concurrent submissions
   - Network interruptions
   - Browser permission denials
   - Invalid data inputs
4. Test on multiple browsers (Chrome, Safari, Firefox, Edge)
5. Test on various devices (different phones, tablets)
6. Perform load testing with simulated users
7. Fix identified bugs
8. Validate data integrity in database
9. Test deployment and rollback procedures

**Success Criteria**:
- All critical paths tested
- No major bugs in production
- System handles edge cases gracefully
- Works on all supported browsers
- Handles 50+ concurrent users

**Dependencies**: Phase 10

**Estimated Duration**: 3-4 days

---

## Phase 12: Documentation & Deployment
**Goal**: Document system and deploy to production with user guides.

### Tasks
1. Write README.md with:
   - Project overview
   - Setup instructions
   - Environment variables
   - Deployment guide
2. Create lecturer user guide:
   - How to set up classes
   - How to activate attendance
   - How to grant retroactive access
   - How to download reports
3. Create student user guide:
   - How to enroll
   - How to submit attendance
4. Document database schema
5. Add code comments for complex logic
6. Create troubleshooting guide
7. Set up production environment on Vercel
8. Configure custom domain (optional)
9. Enable Vercel analytics
10. Perform final production deployment
11. Share class codes with students
12. Monitor initial usage for issues

**Success Criteria**:
- Complete documentation available
- Production deployment successful
- Class codes distributed
- Users can follow guides successfully
- Monitoring in place

**Dependencies**: Phase 11

**Estimated Duration**: 2 days

---

## Phase 13: Initial Launch & Refinement
**Goal**: Launch to real users and iterate based on feedback.

### Tasks
1. Soft launch with one class first
2. Monitor system performance and errors
3. Gather feedback from students and self-reflection
4. Identify pain points and usability issues
5. Make quick fixes for critical issues
6. Roll out to remaining 5 classes
7. Monitor attendance submission patterns
8. Optimize based on real usage data
9. Add quality-of-life improvements
10. Create backup and data export procedures

**Success Criteria**:
- System used successfully in all 6 classes
- No critical issues blocking usage
- Positive user feedback
- Attendance tracking achieves time savings goal
- Data accurately reflects class attendance

**Dependencies**: Phase 12

**Estimated Duration**: Ongoing (first 2 weeks)

---

## Timeline Summary

| Phase | Duration | Cumulative |
|-------|----------|------------|
| 1. Project Setup & Infrastructure | 1-2 days | 2 days |
| 2. Class Management | 2-3 days | 5 days |
| 3. Student Enrollment | 2 days | 7 days |
| 4. Attendance Session Management | 3 days | 10 days |
| 5. Location Verification | 2-3 days | 13 days |
| 6. Student Attendance Submission | 3-4 days | 17 days |
| 7. Retroactive Attendance | 2 days | 19 days |
| 8. Dashboard & Analytics | 3-4 days | 23 days |
| 9. Download & Export | 2 days | 25 days |
| 10. UI/UX Polish | 3 days | 28 days |
| 11. Testing & Bug Fixes | 3-4 days | 32 days |
| 12. Documentation & Deployment | 2 days | 34 days |
| 13. Launch & Refinement | Ongoing | - |

**Total Estimated Time**: ~5-6 weeks for full development

**Minimum Viable Product (MVP)**: Phases 1-6, 8-9 (core functionality) = ~3-4 weeks

---

## Risk Mitigation

### Risk: Geolocation inaccuracy
- **Mitigation**: Allow lecturer override, set reasonable radius (50m+), add manual verification option

### Risk: No student authentication creates data integrity issues
- **Mitigation**: Use Student ID as unique identifier, implement duplicate prevention, plan for auth in v2

### Risk: Concurrent session activations causing confusion
- **Mitigation**: Clear visual indicators, limit to one active session per class at a time

### Risk: Vercel serverless function timeouts for large exports
- **Mitigation**: Implement pagination for exports, optimize queries, use streaming if needed

### Risk: Database costs with Supabase
- **Mitigation**: Start with free tier, monitor usage, optimize queries, implement data archiving

---

## Success Metrics

After launch, track:
- Time saved vs. manual attendance (target: 70% reduction)
- Student submission completion rate (target: >95%)
- System uptime (target: 99%+)
- Average response time (target: <2 seconds)
- User satisfaction (self-assessment + student informal feedback)

---

## Next Steps

After completing the roadmap:
1. Run `/gsd:plan-phase 1` to create detailed implementation plan for Phase 1
2. Execute each phase sequentially
3. Test thoroughly after each phase
4. Iterate based on real-world usage
5. Plan v2 features (authentication, notifications, multi-semester support)
