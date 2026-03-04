-- Script: 26_redesign_venda_step.sql
-- Aplica o padrão TextImagePanel na etapa "Venda"
-- do curso "Planejamento de Tempo e Produtividade".
-- Execute no Supabase SQL Editor.

-- 1. Preview: confirmar o índice do módulo
SELECT
    (ordinality - 1) AS module_index,
    module->>'title' AS module_title
FROM courses,
    jsonb_array_elements(modules) WITH ORDINALITY AS t(module, ordinality)
WHERE title ILIKE '%Planejamento%Tempo%Produtividade%'
ORDER BY ordinality;

-- 2. UPDATE com layout text_image_panel
WITH target_course AS (
    SELECT id
    FROM courses
    WHERE title ILIKE '%Planejamento%Tempo%Produtividade%'
    LIMIT 1
),
module_idx AS (
    SELECT (ordinality - 1) AS idx
    FROM courses,
        jsonb_array_elements(modules) WITH ORDINALITY AS t(module, ordinality)
    WHERE id = (SELECT id FROM target_course)
      AND module->>'title' ILIKE '%Venda%'
    LIMIT 1
)
UPDATE courses
SET modules = jsonb_set(
    modules,
    ARRAY[(SELECT idx FROM module_idx)::text],
    '{
        "title": "Venda",
        "blocks": [
            {
                "_id": "venda_panel_1",
                "type": "text_image_panel",
                "imagePosition": "right",
                "imageSize": "md",
                "imageSrc": "/images/courses/prod_venda.png",
                "imageAlt": "Venda - confiança e valor para o cliente",
                "content": "<h3>🏆 Venda</h3><p>Uma venda bem-sucedida <strong>não se resume ao fechamento do negócio</strong>, mas à construção de confiança e valor para o cliente.</p><ul style=\"margin-top:0.75rem\"><li>O fechamento é a consequência de um processo bem executado — <strong>do ciclo 1 ao 8</strong></li><li>Construa relações de <strong>confiança duradoura</strong>, não apenas transações pontuais</li><li>Entregue <strong>valor real</strong> — o cliente que percebe valor retorna e indica</li><li>Uma venda bem construída gera um <strong>comprador de longo prazo</strong></li></ul>"
            }
        ]
    }'::jsonb
)
WHERE id = (SELECT id FROM target_course);

-- 3. Confirmar
SELECT id, title FROM courses WHERE title ILIKE '%Planejamento%Tempo%Produtividade%';
