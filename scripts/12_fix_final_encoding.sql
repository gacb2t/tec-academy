-- Script: 12_fix_final_encoding.sql
-- Fix definitivo: caracteres restantes (ô, Ú) + rename do curso para plural
-- Execute no Supabase SQL Editor

-- PASSO 1: Função com TODOS os pares de substituição restantes
CREATE OR REPLACE FUNCTION _fix_remaining(t text) RETURNS text
LANGUAGE sql IMMUTABLE AS $$
    SELECT
    replace(replace(replace(replace(replace(replace(replace(
        t,
        '├┤', 'ô'),   -- ô (ex: robôs, revanche, ônibus)
        '├Ü', 'Ú'),   -- Ú (ex: ÚNICA, ÚLTIMO)
        '├å', 'å'),   -- rare Scandinavian fallback
        '├¼', 'ü'),   -- ü (ex: süd)
        '├Â', 'Ê'),   -- Ê maiúsculo
        '├©', 'é'),   -- backup é (outro padrão)
        '├ú', 'ã')    -- ã backup se sobrou algum
$$;

-- PASSO 2: Aplicar nos cursos
UPDATE courses
SET
    title       = _fix_remaining(title),
    description = _fix_remaining(description),
    modules     = _fix_remaining(modules::text)::jsonb
WHERE title ILIKE '%Processo%'
   OR title ILIKE '%Indicadores%'
   OR title ILIKE '%Onboarding%';

-- PASSO 3: Renomear "Processo de Venda" → "Processos de Vendas"
UPDATE courses
SET title = 'Processos de Vendas'
WHERE title = 'Processo de Venda';

-- PASSO 4: Remover função
DROP FUNCTION _fix_remaining(text);

-- PASSO 5: Verificar resultado final
SELECT title, left(description, 60) FROM courses
WHERE title ILIKE '%Processo%'
   OR title ILIKE '%Indicadores%'
   OR title ILIKE '%Onboarding%';
