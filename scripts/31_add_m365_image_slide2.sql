-- Script: 31_add_m365_image_slide2.sql
-- Adiciona imagem e melhora texto do slide Microsoft 365 (índice 2 no carousel)
-- Curso: Sistemas TEC-B2 (id: 55555555-5555-5555-5555-555555555555)
-- Execute no Supabase SQL Editor.

UPDATE courses
SET modules = jsonb_set(
    jsonb_set(
        jsonb_set(
            modules,
            ARRAY['0', 'slides', '2', 'image'],
            '"/images/courses/sys_m365.png"'
        ),
        ARRAY['0', 'slides', '2', 'title'],
        '"Microsoft 365"'
    ),
    ARRAY['0', 'slides', '2', 'text'],
    '"Acesso ao <strong>e-mail corporativo</strong>, Excel, Word e diversas outras ferramentas essenciais do dia a dia.<br><br>🔒 Segurança em primeiro lugar: <strong>nunca compartilhe sua senha</strong>!"'
)
WHERE id = '55555555-5555-5555-5555-555555555555';

-- Verificação
SELECT
    slide->>'title' AS slide_title,
    slide->>'image' AS image_src
FROM courses,
    jsonb_array_elements(modules->0->'slides') WITH ORDINALITY AS s(slide, slide_idx)
WHERE id = '55555555-5555-5555-5555-555555555555';
