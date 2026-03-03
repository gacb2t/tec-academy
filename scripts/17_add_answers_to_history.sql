-- Script: 17_add_answers_to_history.sql
-- Adiciona coluna 'answers' (jsonb) na course_completion_history
-- para armazenar as respostas de cada execução individualmente.
-- Execute no Supabase SQL Editor

ALTER TABLE course_completion_history
    ADD COLUMN IF NOT EXISTS answers jsonb DEFAULT '[]'::jsonb;

-- Verificar
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'course_completion_history';
