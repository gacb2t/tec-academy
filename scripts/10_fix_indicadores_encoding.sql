-- Script: 10_fix_indicadores_encoding.sql
-- Corrige encoding nos cursos Indicadores, Processo de Venda e Onboarding RH
-- Usa replace() targetado (seguro, não falha como convert_from/LATIN1)
-- Execute no Supabase SQL Editor

-- PASSO 1: Função temporária com todos os pares de substituição
CREATE OR REPLACE FUNCTION _fix_br_enc(t text) RETURNS text
LANGUAGE sql IMMUTABLE AS $$
    SELECT
    replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
    replace(replace(replace(replace(replace(replace(replace(
        t,
        '├º', 'ç'),   -- ç
        '├ú', 'ã'),   -- ã
        '├Á', 'õ'),   -- õ
        '├│', 'ó'),   -- ó
        '├║', 'ú'),   -- ú
        '├¡', 'í'),   -- í
        '├®', 'é'),   -- é
        '├ó', 'â'),   -- â
        '├í', 'á'),   -- á
        '├¬', 'ê'),   -- ê
        '├á', 'à'),   -- à
        '├ü', 'Á'),   -- Á
        '├ô', 'Ó'),   -- Ó
        '├ç', 'Ç'),   -- Ç
        '├â', 'Ã'),   -- Ã
        '├ë', 'É'),   -- É
        '├ö', 'Â')    -- Â
$$;

-- PASSO 2: Aplicar correção nos cursos com encoding quebrado
UPDATE courses
SET
    title       = _fix_br_enc(title),
    description = _fix_br_enc(description),
    modules     = _fix_br_enc(modules::text)::jsonb
WHERE title ILIKE '%Indicadores%'
   OR title ILIKE '%Processo de Venda%'
   OR title ILIKE '%Onboarding%';

-- PASSO 3: Remover função temporária
DROP FUNCTION _fix_br_enc(text);

-- PASSO 4: Verificar resultado
SELECT id, title, left(description, 80) AS desc_preview FROM courses
WHERE title ILIKE '%Indicadores%'
   OR title ILIKE '%Processo%'
   OR title ILIKE '%Onboarding%';
