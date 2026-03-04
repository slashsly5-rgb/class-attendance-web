-- supabase/seed.sql
-- Seed 6 initial classes as per requirements FR-10
-- This file runs automatically on: supabase db reset
-- DO NOT run this in production (use separate migration for production seeding)

-- Insert 6 predefined classes with generated codes
INSERT INTO classes (name, code, degree_level, semester, location_lat, location_lng, location_radius)
VALUES
  ('Management Information Systems', 'MIS2026B', 'Bachelor', 'Semester 2 2025/2026', NULL, NULL, 50),
  ('E-Commerce', 'ECOM2026', 'Bachelor', 'Semester 2 2025/2026', NULL, NULL, 50),
  ('Computer Aided Design', 'CAD2026B', 'Bachelor', 'Semester 2 2025/2026', NULL, NULL, 50),
  ('Management Information Systems', 'MIS2026M', 'Master', 'Semester 2 2025/2026', NULL, NULL, 50),
  ('Operation Management', 'OPMAN26M', 'Master', 'Semester 2 2025/2026', NULL, NULL, 50),
  ('Integrated Project', 'INTPRJ2M', 'Master', 'Semester 2 2025/2026', NULL, NULL, 50)
ON CONFLICT (code) DO NOTHING; -- Prevent duplicates if seed runs multiple times

-- Verify seeded data
SELECT name, code, degree_level FROM classes ORDER BY name;
