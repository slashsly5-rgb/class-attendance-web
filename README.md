# Dynamic Class Attendance MVP

A streamlined, Next.js-powered web application for Universities. It uniquely combines **Lecturer-controlled Passcodes** with **Mobile GPS Geofencing** (Haversine Distance) to ensure students are physically present in the auditorium when they submit their attendance.

## Features

### Role: Lecturer
* **Dashboard Analytics**: Real-time health indicators (Present, Late, Absent, At Risk) for all classes.
* **Session Management**: One-click generation of 6-digit session passcodes.
* **Retroactive Overrides**: Allow manual attendance overrides for students with valid excuses (e.g., Medical Leaves).
* **Rich Exports**: Download 1-click matrix CSV reports ready for Excel or University systems.

### Role: Student
* **Frictionless Enrollment**: Enter a class using just a `Class Code`, `Full Name`, and `Student ID`. No complex passwords needed.
* **Geofenced Check-ins**: Students must share their browser location, which calculates their distance to the origin coordinates set by the Lecturer.

---

## Tech Stack
* **Framework**: [Next.js 14 App Router](https://nextjs.org/)
* **Language**: TypeScript
* **Styling**: Tailwind CSS + `shadcn/ui` components
* **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + RLS Policies)
* **Testing**: Jest + React Testing Library

---

## Local Development Setup

To run this application locally on your machine, you must configure both the Next.js frontend and the Supabase backend.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Git](https://git-scm.com/)
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started) (for local database migrations)
- [Docker](https://www.docker.com/) (required to run the local Supabase studio and Postgres instance)

### 2. Clone the Repository
```bash
git clone https://github.com/yourusername/class-attendance.git
cd class-attendance
npm install
```

### 3. Start Local Supabase
Ensure Docker is running on your machine.
```bash
npx supabase start
```
*This command will spin up a local Postgres database, GoTrue auth server, and a Studio UI. It will also print out your API URLs and Keys.*

### 4. Database Migrations
Push the predefined schemas and Tables to your newly created local Postgres database:
```bash
npx supabase db push
```

### 5. Environment Variables
Create a `.env.local` file in the root directory and populate it with the keys provided from step 3:
```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 6. Run the Next.js App
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the application.

---

## Deployment (Vercel)

The easiest way to put this app in production is to deploy the Web layer to **Vercel** and the Database to a **Supabase Hosted** instance.

1. **Create a Supabase Project**: Go to [supabase.com](https://supabase.com) and create a new project.
2. **Push Migrations**: Link your CLI to your remote project and push schemas:
   ```bash
   npx supabase link --project-ref your-project-id
   npx supabase db push
   ```
3. **Deploy to Vercel**: 
   - Connect your GitHub repository to Vercel.
   - Add the remote `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the Vercel Environment Variables pane.
   - Click Deploy.

## User Guides
- 📚 **[Lecturer Guide](./docs/lecturer-guide.md)**: How to create classes, trigger sessions, and export reports.
- 👨‍🎓 **[Student Guide](./docs/student-guide.md)**: How to enroll and successfully configure devices for GPS check-ins.
