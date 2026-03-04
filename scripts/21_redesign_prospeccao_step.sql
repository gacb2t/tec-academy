-- Script: 21_redesign_prospeccao_step.sql
-- Aplica o padrão TextImagePanel na etapa "Prospecção"
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
      AND module->>'title' ILIKE '%Prospec%'
    LIMIT 1
)
UPDATE courses
SET modules = jsonb_set(
    modules,
    ARRAY[(SELECT idx FROM module_idx)::text],
    '{
        "title": "Prospecção",
        "blocks": [
            {
                "_id": "prospeccao_panel_1",
                "type": "text_image_panel",
                "imagePosition": "right",
                "imageSize": "md",
                "imageSrc": "/images/courses/prod_prospeccao.png",
                "imageAlt": "Prospecção - encontre seus clientes",
                "content": "<h3>🎯 Prospecção</h3><p><strong>Execute suas tarefas com foco e dedicação</strong> para alcançar os melhores resultados.</p><ul><li>Identifique o <strong>perfil de cliente</strong> ideal para a abordagem do dia</li><li>Utilize sua lista de contatos para mapear <strong>novas oportunidades</strong></li><li>Mantenha consistência nas ações para gerar <strong>previsibilidade</strong> nos resultados</li></ul>"
            }
        ]
    }'::jsonb
)
WHERE id = (SELECT id FROM target_course);

-- 3. Confirmar
SELECT id, title FROM courses WHERE title ILIKE '%Planejamento%Tempo%Produtividade%';
