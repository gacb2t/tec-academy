-- ATENÇÃO: ESTE SCRIPT IRÁ DELETAR AS TABELAS E SEUS DADOS PERMANENTEMENTE.
-- Execute no Editor SQL do painel do Supabase.

DROP TABLE IF EXISTS "candidates" CASCADE;
DROP TABLE IF EXISTS "course_answers" CASCADE;
DROP TABLE IF EXISTS "course_completion_history" CASCADE;
DROP TABLE IF EXISTS "course_evaluations" CASCADE;
DROP TABLE IF EXISTS "course_progress" CASCADE;
DROP TABLE IF EXISTS "courses" CASCADE;

-- Exibe uma mensagem de sucesso
DO $$ BEGIN RAISE NOTICE 'Tabelas excluídas com sucesso. Apenas user_profiles foi mantida.'; END $$;
