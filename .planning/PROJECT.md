# Class Attendance System

## Vision
A centralized web-based attendance management system for a lecturer managing 6 classes across Bachelor and Master degree programs in Semester 2 2025/2026. The system enables real-time attendance tracking with manual lecturer control, location verification, and comprehensive reporting.

## Problem Statement
Currently managing attendance across 6 different classes manually is time-consuming and error-prone. There's no centralized system to:
- Activate attendance sessions on-demand during class
- Track student attendance with reasons for absences/lateness
- Monitor attendance patterns across multiple classes
- Allow retroactive attendance for justified cases
- Generate downloadable attendance reports per class

## Target Users

### Primary User: Lecturer (You)
- Manages 6 classes (4 Bachelor, 2 Master level)
- Needs mobile-friendly interface for in-class activation
- Requires dashboard overview of all classes
- Needs ability to download attendance reports
- Monitors student attendance patterns

### Secondary Users: Students
- Enroll in classes via class codes (no login required)
- Access system directly through web browser
- Submit attendance when activated by lecturer
- Provide reasons for absences or lateness
- Can take retroactive attendance if approved

## Core Requirements

### For Lecturer
1. **Attendance Activation Control**
   - Manually activate/deactivate attendance sessions
   - Create attendance sessions for any past/future date
   - Enable retroactive attendance for specific students with justification
   - Location-based verification to ensure students are in classroom

2. **Dashboard & Reporting**
   - Overview dashboard showing all 6 classes
   - Summary of attendance per class
   - Drill-down to see individual student attendance records
   - Visual indicators for students with 2+ absences
   - Download attendance records per class (likely Excel/CSV format)

3. **Class Management**
   - Manage 6 classes:
     1. Management Information Systems (Bachelor)
     2. E-Commerce (Bachelor)
     3. Management Information Systems (Master)
     4. Operation Management (Master)
     5. Integrated Project (Master)
     6. Computer Aided Design (Bachelor)
   - Generate unique class codes for student enrollment

### For Students
1. **Self-Enrollment**
   - Join classes using class code
   - No authentication required
   - Enter basic info (name, student ID)

2. **Attendance Submission**
   - Submit attendance only when session is active
   - Three options:
     - **Attend**: Simple confirmation
     - **Not Attend**: With reason field
     - **Late**: With reason field
   - Location verification check
   - Access to retroactive attendance if enabled by lecturer

## Technical Stack

### Frontend
- Modern JavaScript framework (React/Next.js recommended for beautiful UI)
- Mobile-first responsive design
- Component library for polished UI (shadcn/ui, Material-UI, or similar)

### Backend
- Node.js with Express or Next.js API routes
- RESTful API design

### Database
- Supabase (PostgreSQL-based)
- Real-time subscriptions for live attendance updates

### Hosting & Deployment
- GitHub for version control
- Vercel for hosting (seamless integration with GitHub)
- Automatic deployments on push

### Key Features
- Location-based verification (Geolocation API)
- Real-time updates when attendance is activated
- CSV/Excel export functionality
- Responsive mobile-friendly interface

## Success Metrics
- Successfully manage attendance for all 6 classes in one system
- Reduce time spent on attendance tracking by 70%
- Enable quick identification of students at risk (2+ absences)
- 100% mobile usability for in-class activation
- Easy retroactive attendance handling for justified cases

## Constraints & Assumptions
- Single lecturer account (expandable later)
- No complex authentication for students initially
- Semester-specific (2025/2026 Semester 2)
- Location verification assumes GPS-enabled devices
- Students have reliable internet access during class
- Long-term data storage required

## Out of Scope (For Now)
- Multi-lecturer support with role-based access
- Student authentication/login system
- Email/push notifications
- Mobile native apps (web-only)
- Integration with institutional systems
- Automated attendance alerts (manual monitoring via dashboard)
- Grade calculation or course management features

## Future Considerations
- Student login system for better security
- Email notifications for attendance activation
- Multi-semester support with archiving
- Integration with university LMS
- Automated attendance policies (e.g., auto-fail after X absences)
- QR code-based attendance as alternative to location
