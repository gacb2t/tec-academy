-- Script: 34_add_simplifique_image_slide5.sql
-- Adiciona imagem e melhora texto do slide Simplifique (índice 5 no carousel)
-- Curso: Sistemas TEC-B2 (id: 55555555-5555-5555-5555-555555555555)
-- Execute no Supabase SQL Editor.

UPDATE courses
SET modules = jsonb_set(
    jsonb_set(
        jsonb_set(
            modules,
            ARRAY['0', 'slides', '5', 'image'],
            '"/images/courses/sys_simplifique.png"'
        ),
        ARRAY['0', 'slides', '5', 'title'],
        '"Simplifique (Estruturante)"'
    ),
    ARRAY['0', 'slides', '5', 'text'],
    '"Permite consultar clientes, identificar oportunidades, verificar <strong>faturas em aberto</strong> e calcular multas.<br><br>💡 Indispensável para visualizar <strong>ofertas de renovação</strong> (margens e planos). Sem ele, <strong>não há negociação</strong>!"'
)
WHERE id = '55555555-5555-5555-5555-555555555555';

-- Verificação
SELECT
    slide->>'title' AS slide_title,
    slide->>'image' AS image_src
FROM courses,
    jsonb_array_elements(modules->0->'slides') WITH ORDINALITY AS s(slide, slide_idx)
WHERE id = '55555555-5555-5555-5555-555555555555';
