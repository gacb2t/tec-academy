-- Script: 29c_add_images_to_carousel_slides.sql
-- Adiciona campo "image" nas ferramentas do carousel "O Ecossistema de Ferramentas"
-- Curso: Sistemas TEC-B2 (id: 55555555-5555-5555-5555-555555555555)
-- Cada slide recebe uma imagem com cores relacionadas à plataforma descrita.
-- Execute no Supabase SQL Editor.

-- PASSO 1: Verificar estrutura atual dos slides
SELECT
    slide->>'title' AS slide_title,
    slide->>'image' AS current_image,
    slide_idx - 1 AS slide_index
FROM courses,
    jsonb_array_elements(modules->0->'slides') WITH ORDINALITY AS s(slide, slide_idx)
WHERE id = '55555555-5555-5555-5555-555555555555';

-- PASSO 2: Adicionar imagem ao slide 0 - Simpledesk (verde WhatsApp)
UPDATE courses
SET modules = jsonb_set(modules, ARRAY['0', 'slides', '0', 'image'], '"/images/courses/sys_simpledesk.png"')
WHERE id = '55555555-5555-5555-5555-555555555555';

-- VERIFICAR: confirmar que a imagem foi inserida
SELECT
    slide->>'title' AS slide_title,
    slide->>'image' AS image_src
FROM courses,
    jsonb_array_elements(modules->0->'slides') WITH ORDINALITY AS s(slide, slide_idx)
WHERE id = '55555555-5555-5555-5555-555555555555';
