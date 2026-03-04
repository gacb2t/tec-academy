-- Script: 29_redesign_sistemas_simpledesk.sql
-- Adiciona imagem TextImagePanel na etapa "Simpledesk" (step 1/5)
-- do curso "Sistemas TEC-B2".
-- Cores do item: verde WhatsApp (#25D366) — não segue paleta da empresa.
-- Execute no Supabase SQL Editor.

-- 1. Preview: confirmar o índice do módulo
SELECT
    (ordinality - 1) AS module_index,
    module->>'title' AS module_title,
    module->'blocks'->0->>'type' AS first_block_type
FROM courses,
    jsonb_array_elements(modules) WITH ORDINALITY AS t(module, ordinality)
WHERE title ILIKE '%Sistemas%TEC%'
ORDER BY ordinality;

-- 2. UPDATE com TextImagePanel para Simpledesk
UPDATE courses
SET modules = jsonb_set(
    modules,
    ARRAY[m.idx::text],
    '{
        "title": "Simpledesk",
        "blocks": [
            {
                "_id": "simpledesk_panel_1",
                "type": "text_image_panel",
                "imagePosition": "right",
                "imageSize": "md",
                "imageSrc": "/images/courses/sys_simpledesk.png",
                "imageAlt": "Simpledesk - central de comunicação WhatsApp",
                "content": "<h3 style=\"color:#25D366\">💬 Simpledesk</h3><p>Nossa ferramenta oficial para <strong>comunicação com nossos clientes</strong>. Com ela, centralizamos todas as conversas do WhatsApp em uma única plataforma, facilitando o dia a dia.</p><p style=\"margin-top:0.75rem\">É de <strong>uso exclusivo para relacionamento com clientes</strong>!</p>"
            }
        ]
    }'::jsonb
)
FROM (
    SELECT (ordinality - 1) AS idx
    FROM courses,
        jsonb_array_elements(modules) WITH ORDINALITY AS t(module, ordinality)
    WHERE title ILIKE '%Sistemas%TEC%'
      AND module->>'title' ILIKE '%Simpledesk%'
    LIMIT 1
) AS m
WHERE title ILIKE '%Sistemas%TEC%';

-- 3. Confirmar
SELECT id, title FROM courses WHERE title ILIKE '%Sistemas%TEC%';
