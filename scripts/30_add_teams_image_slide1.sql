-- Script: 30_add_teams_image_slide1.sql
-- Adiciona imagem e melhora texto do slide Teams (índice 1 no carousel)
-- Curso: Sistemas TEC-B2 (id: 55555555-5555-5555-5555-555555555555)
-- Execute no Supabase SQL Editor.

UPDATE courses
SET modules = jsonb_set(
    -- 1. Adicionar imagem ao slide 1 (Teams)
    jsonb_set(
        -- 2. Melhorar texto com HTML
        jsonb_set(
            modules,
            ARRAY['0', 'slides', '1', 'image'],
            '"/images/courses/sys_teams.png"'
        ),
        ARRAY['0', 'slides', '1', 'title'],
        '"Teams"'
    ),
    ARRAY['0', 'slides', '1', 'text'],
    '"Ferramenta oficial de <strong>comunicação interna</strong>. Conecta colaboradores, celebra conquistas e compartilha conhecimento.<br><br>⚠️ Uso restrito ao <strong>horário de expediente</strong>."'
)
WHERE id = '55555555-5555-5555-5555-555555555555';

-- Verificação
SELECT
    slide->>'title' AS slide_title,
    slide->>'image' AS image_src
FROM courses,
    jsonb_array_elements(modules->0->'slides') WITH ORDINALITY AS s(slide, slide_idx)
WHERE id = '55555555-5555-5555-5555-555555555555';
