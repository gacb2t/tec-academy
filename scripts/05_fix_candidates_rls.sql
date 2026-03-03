-- Run this in Supabase SQL editor to fix the 401 error
-- This disables RLS temporarily so the app can insert/read candidates freely,
-- or sets up the correct public policies if you prefer RLS enabled.

ALTER TABLE public.candidates DISABLE ROW LEVEL SECURITY;

-- If you prefer keeping it enabled instead of disabled, run this instead:
-- ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "public_read_candidates" ON public.candidates;
-- DROP POLICY IF EXISTS "public_insert_candidates" ON public.candidates;
-- DROP POLICY IF EXISTS "public_update_candidates" ON public.candidates;
-- DROP POLICY IF EXISTS "public_delete_candidates" ON public.candidates;
-- CREATE POLICY "public_read_candidates" ON public.candidates FOR SELECT USING (true);
-- CREATE POLICY "public_insert_candidates" ON public.candidates FOR INSERT WITH CHECK (true);
-- CREATE POLICY "public_update_candidates" ON public.candidates FOR UPDATE USING (true) WITH CHECK (true);
-- CREATE POLICY "public_delete_candidates" ON public.candidates FOR DELETE USING (true);
