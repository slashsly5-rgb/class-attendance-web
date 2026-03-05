-- supabase/migrations/20260306000200_add_delete_policies.sql
-- Adds missing RLS delete policies for lecturer management actions.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'classes' AND policyname = 'public_delete_classes'
  ) THEN
    CREATE POLICY "public_delete_classes" ON public.classes
      FOR DELETE TO anon, authenticated
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'enrollments' AND policyname = 'public_delete_enrollments'
  ) THEN
    CREATE POLICY "public_delete_enrollments" ON public.enrollments
      FOR DELETE TO anon, authenticated
      USING (true);
  END IF;
END $$;
