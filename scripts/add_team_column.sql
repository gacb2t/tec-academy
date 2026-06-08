-- Adiciona a coluna 'team' na tabela user_profiles caso ela ainda não exista
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS team text;
