-- Script: 18_clear_gabriel_history.sql
-- Limpa TODOS os registros de progresso e histórico do Gabriel (gac.b2t@gmail.com)
-- Mantém dados dos outros usuários intactos.
-- Execute no Supabase SQL Editor

DO $$
DECLARE gabriel_id text;
BEGIN
    SELECT user_id INTO gabriel_id
    FROM user_profiles
    WHERE email = 'gac.b2t@gmail.com'
    LIMIT 1;

    IF gabriel_id IS NULL THEN
        RAISE EXCEPTION 'Usuário gac.b2t@gmail.com não encontrado em user_profiles';
    END IF;

    -- 1. Deletar respostas (FK para course_progress)
    DELETE FROM course_answers
    WHERE progress_id IN (
        SELECT id FROM course_progress WHERE user_id = gabriel_id
    );

    -- 2. Deletar histórico de conclusões
    DELETE FROM course_completion_history
    WHERE user_id = gabriel_id;

    -- 3. Deletar progresso de cursos
    DELETE FROM course_progress
    WHERE user_id = gabriel_id;

    RAISE NOTICE 'Dados do usuário % (gabriel_id: %) deletados com sucesso.', 'gac.b2t@gmail.com', gabriel_id;
END $$;

-- Verificar que outros usuários não foram afetados
SELECT COUNT(*) AS total_outros_usuarios FROM course_progress
WHERE user_id NOT IN (
    SELECT user_id FROM user_profiles WHERE email = 'gac.b2t@gmail.com'
);
