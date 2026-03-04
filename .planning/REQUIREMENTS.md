# Requirements: Class Attendance System

## Functional Requirements

### FR-1: Student Self-Enrollment
**Priority**: HIGH
**Description**: Students can join classes without authentication using class codes.

**Acceptance Criteria**:
- Student enters class code on enrollment page
- System validates class code exists
- Student provides: Full Name, Student ID
- Student is enrolled in class immediately
- System prevents duplicate enrollment (same Student ID per class)
- Student receives confirmation of enrollment

---

### FR-2: Lecturer Attendance Session Activation
**Priority**: HIGH
**Description**: Lecturer can manually activate attendance sessions for active classes.

**Acceptance Criteria**:
- Lecturer dashboard shows all 6 classes
- "Activate Attendance" button for each class
- When activated, attendance becomes available to enrolled students
- System records activation timestamp
- Visual indicator shows which sessions are currently active
- Lecturer can manually close active session
- Mobile-friendly interface for in-class use

---

### FR-3: Student Attendance Submission
**Priority**: HIGH
**Description**: Students submit attendance when session is active.

**Acceptance Criteria**:
- Students see only active attendance sessions for their enrolled classes
- Three status options available:
  - **Attend**: No additional input required
  - **Not Attend**: Text field for reason (required)
  - **Late**: Text field for reason (required)
- Location verification check before submission
- System captures: Student ID, timestamp, status, reason (if applicable), location coordinates
- Confirmation message after successful submission
- Cannot submit if session is not active
- Cannot submit twice for same session

---

### FR-4: Location-Based Verification
**Priority**: HIGH
**Description**: System verifies student location during attendance submission.

**Acceptance Criteria**:
- System requests geolocation permission from student browser
- Lecturer sets acceptable location coordinates and radius per class
- System validates student location is within acceptable radius
- Attendance submission blocked if location check fails
- Clear error message if outside allowed area
- Fallback option for lecturer to override location requirement

---

### FR-5: Create Attendance Session for Any Date
**Priority**: HIGH
**Description**: Lecturer can create attendance sessions for past or future dates.

**Acceptance Criteria**:
- "Create Attendance" function in lecturer interface
- Lecturer selects: Class, Date, Time
- Can create sessions for dates in the past or future
- Specific use case: retroactive attendance for justified absences
- Created session appears in class attendance history
- Students can submit if session is activated

---

### FR-6: Retroactive Attendance Enablement
**Priority**: MEDIUM
**Description**: Lecturer can enable specific students to submit attendance for past sessions.

**Acceptance Criteria**:
- Lecturer views past attendance sessions
- Lecturer selects specific session
- Lecturer selects specific student(s) to grant access
- Selected students can see and submit for that past session
- System records this was retroactive with timestamp
- Other students cannot access closed sessions

---

### FR-7: Attendance Dashboard Overview
**Priority**: HIGH
**Description**: Lecturer dashboard shows attendance summary across all classes.

**Acceptance Criteria**:
- Dashboard displays all 6 classes with summary cards
- Each class card shows:
  - Class name
  - Total sessions conducted
  - Average attendance rate
  - Number of students enrolled
  - Number of students with 2+ absences (highlighted)
- Visual indicators (color-coded) for attendance health
- Clickable cards to drill into class details

---

### FR-8: Class Detail View
**Priority**: HIGH
**Description**: Detailed attendance view for individual classes.

**Acceptance Criteria**:
- List of all attendance sessions for the class (date, time, status)
- Student roster with attendance summary per student
- For each student shows:
  - Name, Student ID
  - Total sessions attended
  - Number of absences
  - Number of late attendances
  - Attendance percentage
- Filter/sort options: by name, by attendance rate, by absences
- Visual flag for students with 2+ absences

---

### FR-9: Download Attendance Reports
**Priority**: HIGH
**Description**: Lecturer can download attendance data per class.

**Acceptance Criteria**:
- "Download Report" button in class detail view
- Export formats: CSV and/or Excel
- Report includes:
  - Student Name, Student ID
  - Each session date with status (Attend/Absent/Late)
  - Reasons for absences/lateness
  - Summary totals per student
  - Overall class statistics
- File named with class name and date
- Download completes successfully on desktop and mobile

---

### FR-10: Class Management
**Priority**: HIGH
**Description**: Lecturer can create and manage classes with unique codes.

**Acceptance Criteria**:
- Lecturer can create new class with:
  - Class name
  - Degree level (Bachelor/Master)
  - Semester (default: Semester 2 2025/2026)
- System generates unique 6-8 character class code
- Lecturer can view/copy class code
- Lecturer can edit class details
- Lecturer can view enrolled students per class
- Initial setup includes 6 predefined classes:
  1. Management Information Systems (Bachelor)
  2. E-Commerce (Bachelor)
  3. Management Information Systems (Master)
  4. Operation Management (Master)
  5. Integrated Project (Master)
  6. Computer Aided Design (Bachelor)

---

## Non-Functional Requirements

### NFR-1: Performance
- Page load time < 2 seconds on 4G mobile connection
- Attendance submission response < 1 second
- Dashboard loads with all class data in < 3 seconds
- Support 50+ concurrent students submitting attendance

### NFR-2: Mobile Responsiveness
- Fully functional on mobile devices (iOS & Android)
- Touch-friendly buttons (minimum 44x44px)
- Readable text without zooming
- Optimized for portrait orientation
- Works on tablets and desktop browsers

### NFR-3: Browser Compatibility
- Chrome (latest 2 versions)
- Safari (latest 2 versions)
- Firefox (latest 2 versions)
- Edge (latest 2 versions)

### NFR-4: Data Persistence
- All attendance data stored long-term in Supabase
- No data loss during session transitions
- Automatic backups via Supabase

### NFR-5: Security
- HTTPS only (enforced by Vercel)
- Input validation on all forms
- SQL injection prevention
- XSS protection
- Rate limiting on API endpoints

### NFR-6: Usability
- Intuitive interface requiring no training
- Clear error messages
- Consistent design language
- Maximum 3 clicks to any function
- Beautiful, modern UI design

### NFR-7: Deployment
- Hosted on Vercel with automatic deployments
- Source code on GitHub
- Zero-downtime deployments
- Environment variables for sensitive config

### NFR-8: Geolocation
- Use browser Geolocation API
- Graceful degradation if GPS unavailable
- Clear permission requests
- Accuracy within 50 meters

---

## Data Models

### Class
- id (UUID)
- name (string)
- code (string, unique)
- degree_level (enum: Bachelor, Master)
- semester (string)
- location_lat (decimal)
- location_lng (decimal)
- location_radius (integer, meters)
- created_at (timestamp)

### Student
- id (UUID)
- student_id (string)
- full_name (string)
- enrolled_classes (array of class_ids)
- created_at (timestamp)

### AttendanceSession
- id (UUID)
- class_id (UUID, FK)
- session_date (date)
- session_time (time)
- activated_at (timestamp, nullable)
- closed_at (timestamp, nullable)
- is_active (boolean)
- is_retroactive (boolean)
- created_by (string, "lecturer")
- created_at (timestamp)

### AttendanceRecord
- id (UUID)
- session_id (UUID, FK)
- student_id (UUID, FK)
- status (enum: Attend, Not Attend, Late)
- reason (text, nullable)
- location_lat (decimal)
- location_lng (decimal)
- submitted_at (timestamp)
- is_retroactive (boolean)

### RetroactiveAccess
- id (UUID)
- session_id (UUID, FK)
- student_id (UUID, FK)
- granted_by (string, "lecturer")
- granted_at (timestamp)
- used (boolean)

---

## User Flows

### Flow 1: Student Enrolls in Class
1. Student opens application URL
2. Clicks "Enroll in Class"
3. Enters class code
4. Enters Full Name and Student ID
5. Clicks "Enroll"
6. System validates and enrolls student
7. Student sees enrolled classes page

### Flow 2: Lecturer Activates Attendance
1. Lecturer opens dashboard (mobile or desktop)
2. Views list of 6 classes
3. Clicks "Activate Attendance" on desired class
4. Attendance session becomes active
5. Students enrolled in that class can now submit
6. Lecturer manually closes session when class ends

### Flow 3: Student Submits Attendance
1. Student opens application
2. Sees notification that attendance is active for their class
3. Clicks on active session
4. Browser requests location permission
5. Student selects status: Attend/Not Attend/Late
6. If Not Attend or Late, enters reason
7. System verifies location
8. Student submits
9. Receives confirmation

### Flow 4: Lecturer Creates Retroactive Attendance
1. Lecturer goes to class detail page
2. Clicks "Create Attendance Session"
3. Selects past date (e.g., last week)
4. Creates session
5. Selects specific student who missed class
6. Clicks "Grant Access"
7. Student can now submit for that past session

### Flow 5: Lecturer Downloads Report
1. Lecturer opens class detail page
2. Reviews attendance summary
3. Clicks "Download Report"
4. Selects CSV format
5. File downloads with all attendance data

---

## Technical Constraints

1. **Supabase Database**: PostgreSQL-based, must design schema accordingly
2. **Vercel Hosting**: Serverless functions with execution time limits
3. **GitHub Repository**: Public or private repo for source code
4. **No Authentication Initially**: Trade-off for simplicity vs. security
5. **Geolocation Dependency**: Requires student devices with GPS
6. **Browser APIs**: Dependent on modern browser support

---

## Assumptions

1. Students have smartphones or laptops with internet access during class
2. Classroom has reliable internet connectivity
3. Students will provide accurate Student ID and Name during enrollment
4. Lecturer has reliable mobile internet for in-class activation
5. One lecturer managing all classes (no multi-user access needed initially)
6. Classes have fixed physical locations with known coordinates

---

## Future Enhancements (Out of Scope for MVP)

- Student authentication with email/password
- Email notifications when attendance is activated
- QR code-based attendance as alternative
- Multi-lecturer support with role-based access
- Automated attendance policies and grade calculations
- Mobile native apps (iOS/Android)
- Integration with university LMS systems
- Multi-semester archiving and historical data analysis
- Student self-service to view their own attendance history
