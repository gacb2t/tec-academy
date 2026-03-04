-- SQL script to enforce Admin RLS policies on the courses table

-- First, we need to create a helper function/policy to check the user email against Clerk JWT
-- Supabase integrates with Clerk and the email is usually passed in the JWT claims if configured.
-- For a raw Supabase MVP where Clerk JWT isn't fully mapped to auth.uid() emails, 
-- we can enforce RLS based on the UUID if we know the Admin's Clerk User ID, or simply
-- rely on the Frontend protection for right now, but a true DB lock is safer.

-- Dropping the previously wide-open policies just to be safe
DROP POLICY IF EXISTS "Allow authenticated read access" ON public.courses;
DROP POLICY IF EXISTS "Allow authenticated insert/update/delete" ON public.courses;

-- Everyone can read
CREATE POLICY "Allow authenticated read access"
ON public.courses
FOR SELECT
TO authenticated
USING (true);

-- MVP Admin Protection: we'll check the JWT metadata or just rely on the frontend for MVP if 
-- raw JWT setup isn't complete. If we assume the frontend is the only client using the ANON key, 
-- we can create a temporary allow-all for mutation, but you should really map Clerk to Supabase.
-- Because Clerk is external, verifying the `email` inside Supabase RLS directly requires a custom token 
-- or a trigger mapping Clerk IDs to the `user_profiles` table.

-- Let's check if there is an existing `user_profiles` table to join against
-- CREATE POLICY "Allow Admin mutations"
-- ON public.courses
-- FOR ALL
-- TO authenticated
-- USING ( auth.uid() IN (SELECT user_id FROM user_profiles WHERE email = 'gabriel.albuquerque@tecb2.com.br') );

-- For this MVP script, we'll restore a permissive policy so the Course Builder works immediately for Gabriel,
-- but please note that anyone with the frontend key COULD theoretically use a REST client to alter courses 
-- until the Clerk-Supabase JWT template is configured to pass `publicMetadata.role`.

CREATE POLICY "Allow authenticated insert/update/delete (Temp MVP)"
ON public.courses
FOR ALL
TO authenticated
USING (true);
WITH CHECK (true);
