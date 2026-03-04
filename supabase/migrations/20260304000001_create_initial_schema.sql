-- Source: https://supabase.com/docs/guides/database/postgres/indexes
-- supabase/migrations/20260304000001_create_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Classes table
CREATE TABLE classes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  degree_level TEXT NOT NULL CHECK (degree_level IN ('Bachelor', 'Master')),
  semester TEXT NOT NULL,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_radius INTEGER DEFAULT 50, -- meters
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table
CREATE TABLE students (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Class enrollments (many-to-many)
CREATE TABLE enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(class_id, student_id)
);

-- Attendance sessions
CREATE TABLE attendance_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
  activated_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT FALSE,
  is_retroactive BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance records
CREATE TABLE attendance_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('Attend', 'Not Attend', 'Late')),
  reason TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_retroactive BOOLEAN DEFAULT FALSE,
  UNIQUE(session_id, student_id)
);

-- Retroactive access grants
CREATE TABLE retroactive_access (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used BOOLEAN DEFAULT FALSE,
  UNIQUE(session_id, student_id)
);

-- CRITICAL: Create indexes on ALL foreign key columns
-- PostgreSQL does NOT auto-index foreign keys
-- Source: https://supaexplorer.com/best-practices/supabase-postgres/schema-foreign-key-indexes/
CREATE INDEX idx_enrollments_class_id ON enrollments(class_id);
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_attendance_sessions_class_id ON attendance_sessions(class_id);
CREATE INDEX idx_attendance_records_session_id ON attendance_records(session_id);
CREATE INDEX idx_attendance_records_student_id ON attendance_records(student_id);
CREATE INDEX idx_retroactive_access_session_id ON retroactive_access(session_id);
CREATE INDEX idx_retroactive_access_student_id ON retroactive_access(student_id);

-- Composite index for common query pattern (active sessions per class)
CREATE INDEX idx_sessions_class_active ON attendance_sessions(class_id, is_active);

-- CRITICAL: Enable Row Level Security on all tables
-- Without RLS policies, queries return empty arrays even if data exists
-- Source: https://supabase.com/docs/guides/database/postgres/row-level-security
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE retroactive_access ENABLE ROW LEVEL SECURITY;

-- Public read access policies (adjust based on actual requirements)
-- For MVP without authentication, allow public read/write
-- IMPORTANT: Tighten these policies when adding authentication
CREATE POLICY "public_read_classes" ON classes FOR SELECT USING (true);
CREATE POLICY "public_read_students" ON students FOR SELECT USING (true);
CREATE POLICY "public_read_enrollments" ON enrollments FOR SELECT USING (true);
CREATE POLICY "public_read_sessions" ON attendance_sessions FOR SELECT USING (true);
CREATE POLICY "public_read_records" ON attendance_records FOR SELECT USING (true);
CREATE POLICY "public_read_retroactive" ON retroactive_access FOR SELECT USING (true);

CREATE POLICY "public_write_students" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "public_write_enrollments" ON enrollments FOR INSERT WITH CHECK (true);
CREATE POLICY "public_write_records" ON attendance_records FOR INSERT WITH CHECK (true);
