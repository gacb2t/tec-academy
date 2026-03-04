-- Run this in Supabase SQL editor to create the necessary columns for tracking checkout and attempts.
ALTER TABLE IF EXISTS course_progress ADD COLUMN IF NOT EXISTS current_step INTEGER DEFAULT 0;
ALTER TABLE IF EXISTS course_answers ADD COLUMN IF NOT EXISTS attempts INTEGER DEFAULT 1;
