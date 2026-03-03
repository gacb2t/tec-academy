-- Script: 16_add_completion_history.sql
-- Cria a tabela course_completion_history para preservar o histórico de conclusões,
-- mesmo quando o usuário refaz um curso.
-- Execute no Supabase SQL Editor

CREATE TABLE IF NOT EXISTS course_completion_history (
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     text NOT NULL,
    course_id   text NOT NULL,
    score       int  DEFAULT 0,
    total_questions int DEFAULT 0,
    percentage  int  DEFAULT 0,
    completed_at timestamptz DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_completion_history_user   ON course_completion_history (user_id);
CREATE INDEX IF NOT EXISTS idx_completion_history_course ON course_completion_history (user_id, course_id);

-- RLS: usuário só vê o próprio histórico; admins (service_role) vêem tudo
ALTER TABLE course_completion_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own history"
    ON course_completion_history FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can view own history"
    ON course_completion_history FOR SELECT
    USING (auth.uid()::text = user_id);

-- Verificar
SELECT COUNT(*) AS total_rows FROM course_completion_history;
