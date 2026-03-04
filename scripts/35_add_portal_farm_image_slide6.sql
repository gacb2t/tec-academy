-- Script: 35_add_portal_farm_image_slide6.sql
-- Adiciona imagem e melhora texto do slide Portal (FARM) (índice 6 no carousel)
-- Curso: Sistemas TEC-B2 (id: 55555555-5555-5555-5555-555555555555)
-- Execute no Supabase SQL Editor.

UPDATE courses
SET modules = jsonb_set(
    jsonb_set(
        jsonb_set(
            modules,
            ARRAY['0', 'slides', '6', 'image'],
            '"/images/courses/sys_portal_farm.png"'
        ),
        ARRAY['0', 'slides', '6', 'title'],
        '"Portal (FARM)"'
    ),
    ARRAY['0', 'slides', '6', 'text'],
    '"Portal Vivo para consultar informações de clientes: <strong>planta, faturamentos, perfil contratado e consumo</strong>.<br><br>🌱 Auxilia especialmente os <strong>consultores da equipe FARM</strong> na análise e gestão da carteira de clientes."'
)
WHERE id = '55555555-5555-5555-5555-555555555555';

-- Verificação final: todos os slides com imagem
SELECT
    (slide_idx - 1) AS slide_index,
    slide->>'title' AS slide_title,
    CASE WHEN slide->>'image' IS NOT NULL THEN '✅' ELSE '❌' END AS has_image
FROM courses,
    jsonb_array_elements(modules->0->'slides') WITH ORDINALITY AS s(slide, slide_idx)
WHERE id = '55555555-5555-5555-5555-555555555555'
ORDER BY slide_idx;
