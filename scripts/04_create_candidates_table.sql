-- Run this in Supabase SQL editor to create the candidates table
CREATE TABLE IF NOT EXISTS public.candidates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'Novo' NOT NULL, -- 'Novo', 'Contactado', 'Entrevista', 'Aprovado', 'Reprovado'
    curriculum_link TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Basic RLS setup (assuming admin-only access will be controlled at app level for now, or you can add policies)
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read candidates"
ON public.candidates FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert candidates"
ON public.candidates FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update candidates"
ON public.candidates FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete candidates"
ON public.candidates FOR DELETE
TO authenticated
USING (true);
