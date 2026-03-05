-- supabase/migrations/20260306000100_fix_missing_write_policies.sql
-- Adds missing RLS write/update policies required by lecturer workflows.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'classes' AND policyname = 'public_write_classes'
  ) THEN
    CREATE POLICY "public_write_classes" ON public.classes
      FOR INSERT TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'classes' AND policyname = 'public_update_classes'
  ) THEN
    CREATE POLICY "public_update_classes" ON public.classes
      FOR UPDATE TO anon, authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'attendance_sessions' AND policyname = 'public_write_sessions'
  ) THEN
    CREATE POLICY "public_write_sessions" ON public.attendance_sessions
      FOR INSERT TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'attendance_sessions' AND policyname = 'public_update_sessions'
  ) THEN
    CREATE POLICY "public_update_sessions" ON public.attendance_sessions
      FOR UPDATE TO anon, authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'retroactive_access' AND policyname = 'public_write_retroactive'
  ) THEN
    CREATE POLICY "public_write_retroactive" ON public.retroactive_access
      FOR INSERT TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'retroactive_access' AND policyname = 'public_update_retroactive'
  ) THEN
    CREATE POLICY "public_update_retroactive" ON public.retroactive_access
      FOR UPDATE TO anon, authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
