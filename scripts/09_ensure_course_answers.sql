-- Script: 09_ensure_course_answers.sql
-- Garante que a tabela course_answers existe e tem as políticas corretas

-- Cria a tabela se não existir
CREATE TABLE IF NOT EXISTS course_answers (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    progress_id uuid REFERENCES course_progress(id) ON DELETE CASCADE,
    question_text text,
    answer_text   text,
    is_correct    boolean DEFAULT false,
    attempts      integer DEFAULT 1,
    created_at    timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE course_answers ENABLE ROW LEVEL SECURITY;

-- Policy: usuário pode inserir suas próprias respostas
DROP POLICY IF EXISTS "Users can insert own answers" ON course_answers;
CREATE POLICY "Users can insert own answers" ON course_answers
    FOR INSERT WITH CHECK (
        progress_id IN (
            SELECT id FROM course_progress WHERE user_id = auth.uid()::text
        )
    );

-- Policy: usuário pode ver suas próprias respostas
DROP POLICY IF EXISTS "Users can view own answers" ON course_answers;
CREATE POLICY "Users can view own answers" ON course_answers
    FOR SELECT USING (
        progress_id IN (
            SELECT id FROM course_progress WHERE user_id = auth.uid()::text
        )
    );

-- Policy: usuário pode deletar suas próprias respostas (para retake)
DROP POLICY IF EXISTS "Users can delete own answers" ON course_answers;
CREATE POLICY "Users can delete own answers" ON course_answers
    FOR DELETE USING (
        progress_id IN (
            SELECT id FROM course_progress WHERE user_id = auth.uid()::text
        )
    );

-- Policy: qualquer usuário autenticado pode ver todas as respostas (necessário para RHDashboard)
DROP POLICY IF EXISTS "Authenticated users can view all answers" ON course_answers;
CREATE POLICY "Authenticated users can view all answers" ON course_answers
    FOR SELECT USING (auth.role() = 'authenticated');
