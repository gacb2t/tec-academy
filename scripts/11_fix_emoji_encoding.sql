-- Script: 11_fix_emoji_encoding.sql
-- Corrige emojis quebrados nas slides e ícones dos cursos
-- Execute no Supabase SQL Editor

-- PASSO 1: Função de correção de emojis quebrados
CREATE OR REPLACE FUNCTION _fix_emoji(t text) RETURNS text
LANGUAGE sql IMMUTABLE AS $$
    SELECT
    replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
        t,
        E'\u00AD\u0192\u00F4\u2592',  '📱'),   -- ­ƒô▒ → 📱  (ALTA MÓVEL)
        E'\u00AD\u0192\u00EE\u00C9',  '🌐'),   -- ­ƒîÉ → 🌐  (FTTH)
        E'\u00AD\u0192\u00F9\u00FA\u00B4\u00A9\u00C5', '☁️'), -- ­ƒùú´©Å → ☁️ (VVN)
        E'\u00AD\u0192\u00C6\u2557',  '💻'),   -- ­ƒÆ╗ → 💻  (DIGITAL)
        E'\u00AD\u0192\u00DC\u00C7',  '⚡'),   -- ­ƒÜÇ → ⚡  (AVANÇADA)
        E'\u00AD\u0192\u00F6\u00E4',  '🔄'),   -- ­ƒöä → 🔄  (RENOVAÇÃO)
        E'\u00AD\u0192\u00F8\u00C6',  '📦'),   -- ­ƒøÆ → 📦  (EQUIPAMENTOS)
        E'\u00AD\u0192\u00E6\u00D1',  '🤝'),   -- ­ƒæÑ → 🤝  (Onboarding RH)
        E'\u00AD\u0192\u00F4\u00EA',  '📊'),   -- ­ƒôê → 📊  (Indicadores)
        E'\u00AD\u0192\u00F1\u00D8',  '💼')   -- ­ƒñØ → 💼  (Processo de Venda)
$$;

-- PASSO 2: Atualizar modules (slides) e icon nos cursos afetados
UPDATE courses
SET
    icon    = _fix_emoji(icon),
    modules = _fix_emoji(modules::text)::jsonb
WHERE title ILIKE '%Indicadores%'
   OR title ILIKE '%Processo de Venda%'
   OR title ILIKE '%Onboarding%';

-- PASSO 3: Remover função temporária
DROP FUNCTION _fix_emoji(text);

-- PASSO 4: Verificar ícones após a correção
SELECT title, icon FROM courses
WHERE title ILIKE '%Indicadores%'
   OR title ILIKE '%Processo%'
   OR title ILIKE '%Onboarding%';
