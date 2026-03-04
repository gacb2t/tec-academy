-- Script: 37_diagnostico_intro_rh_course.sql
-- Verificar estrutura do curso Introdução RH para saber como adicionar a logo
-- Execute no Supabase SQL Editor.

-- 1. Encontrar o curso e seu ID
SELECT id, title, jsonb_array_length(modules) AS module_count
FROM courses
WHERE title ILIKE '%Introdu%RH%' OR title ILIKE '%Bem-vindo%' OR title ILIKE '%RH%'
ORDER BY title;

-- 2. Ver o primeiro módulo (idx=0) em detalhe
SELECT
    id,
    title AS course_title,
    (modules->0)->>'title' AS first_module_title,
    (modules->0)->>'type' AS first_module_type,
    (modules->0)->'blocks'->0->>'type' AS first_block_type,
    jsonb_array_length((modules->0)->'blocks') AS block_count
FROM courses
WHERE title ILIKE '%Introdu%RH%' OR title ILIKE '%Bem-vindo%' OR title ILIKE '%RH%';
