-- Run this script in your Supabase SQL Editor to add the new contact columns to the candidates table
-- This allows you to store Email and Phone Number for each candidate.

ALTER TABLE public.candidates
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;
