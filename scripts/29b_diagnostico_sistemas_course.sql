-- Script: 29b_diagnostico_sistemas_course.sql
-- Encontrar o ID e a estrutura real do curso Sistemas TEC-B2 no Supabase.
-- Execute no Supabase SQL Editor e copie o resultado.

-- 1. Listar todos os cursos publicados
SELECT id, title, jsonb_array_length(modules) AS module_count
FROM courses
ORDER BY title;

-- 2. Ver os módulos do curso que tem "Sistema" ou "TEC" no título
SELECT
    id,
    title,
    (ordinality - 1) AS module_idx,
    module->>'title' AS module_title,
    module->>'type' AS module_type,
    module->'blocks'->0->>'type' AS first_block_type,
    jsonb_array_length(module->'slides') AS slide_count
FROM courses,
    jsonb_array_elements(modules) WITH ORDINALITY AS t(module, ordinality)
WHERE title ILIKE '%Sistema%' OR title ILIKE '%TEC%B2%' OR title ILIKE '%B2%'
ORDER BY title, ordinality;
