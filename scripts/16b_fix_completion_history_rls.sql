-- Script: 16b_fix_completion_history_rls.sql
-- Corrige as políticas RLS da tabela course_completion_history.
-- A tabela original foi criada com RLS restritiva, que bloqueava:
--   1. INSERTs do Result.jsx (quando user_id não bate com auth.uid())
--   2. SELECTs de outros usuários no RHDashboard (acesso admin)
-- Execute no Supabase SQL Editor APÓS o script 16.

-- Remover políticas restritivas
DROP POLICY IF EXISTS "Users can view own history"   ON course_completion_history;
DROP POLICY IF EXISTS "Users can insert own history" ON course_completion_history;

-- Desabilitar RLS (consistente com course_progress e course_answers neste projeto)
ALTER TABLE course_completion_history DISABLE ROW LEVEL SECURITY;

-- Confirmar que está correto
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'course_completion_history';
