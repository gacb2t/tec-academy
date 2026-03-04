-- Script: 38_add_tecb2_logo_rh_intro.sql
-- Adiciona o logo TEC-B2 ao slide de boas-vindas do curso Introdução RH
-- Curso: Introdução RH: Bem-vindo à TEC-B2 (id: 11111111-1111-1111-1111-111111111111)
-- Módulo 0 > blocks[0] (carousel) > slides[0] (Seja Bem-vindo!)
-- Execute no Supabase SQL Editor.

-- PASSO 1: Preview - ver o slide atual
SELECT
    (modules->0->'blocks'->0->'slides'->0)->>'title' AS slide_title,
    (modules->0->'blocks'->0->'slides'->0)->>'image' AS current_image
FROM courses
WHERE id = '11111111-1111-1111-1111-111111111111';

-- PASSO 2: Adicionar a logo ao slide
UPDATE courses
SET modules = jsonb_set(
    modules,
    ARRAY['0', 'blocks', '0', 'slides', '0', 'image'],
    '"/images/courses/rh_tecb2_logo.png"'
)
WHERE id = '11111111-1111-1111-1111-111111111111';

-- PASSO 3: Verificar
SELECT
    (modules->0->'blocks'->0->'slides'->0)->>'title' AS slide_title,
    (modules->0->'blocks'->0->'slides'->0)->>'image' AS image_src
FROM courses
WHERE id = '11111111-1111-1111-1111-111111111111';
