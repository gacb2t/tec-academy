-- Script: 09b_fix_course_answers_rls.sql
-- Desabilita RLS na tabela course_answers (dados internos administrativos)
-- e remove policies conflitantes que bloqueavam o insert com Clerk auth

ALTER TABLE course_answers DISABLE ROW LEVEL SECURITY;

-- Remove todas as policies para limpar o estado
DROP POLICY IF EXISTS "Users can insert own answers" ON course_answers;
DROP POLICY IF EXISTS "Users can view own answers" ON course_answers;
DROP POLICY IF EXISTS "Users can delete own answers" ON course_answers;
DROP POLICY IF EXISTS "Authenticated users can view all answers" ON course_answers;
DROP POLICY IF EXISTS "Service role can view all answers" ON course_answers;
