-- Script: 24_redesign_negociacoes_step.sql
-- Aplica o padrão TextImagePanel na etapa "Negociações"
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
      AND module->>'title' ILIKE '%Negociação%'
    LIMIT 1
)
UPDATE courses
SET modules = jsonb_set(
    modules,
    ARRAY[(SELECT idx FROM module_idx)::text],
    '{
        "title": "Negociações",
        "blocks": [
            {
                "_id": "negociacoes_panel_1",
                "type": "text_image_panel",
                "imagePosition": "left",
                "imageSize": "md",
                "imageSrc": "/images/courses/prod_negociacoes.png",
                "imageAlt": "Negociação win-win - ouvir e gerar valor",
                "content": "<h3>🤜🤛 Negociações</h3><p>Uma negociação eficaz exige <strong>ouvir atentamente</strong>, compreender as necessidades do cliente e oferecer soluções que <strong>agreguem valor para ambos os lados</strong>.</p><ul><li>Demonstre <strong>empatia genuína</strong> — entenda antes de propor</li><li>Apresente soluções conectadas às <strong>dores específicas</strong> do cliente</li><li>Crie acordos onde <strong>ambos saem ganhando</strong> — sustentabilidade na relação</li><li>Use os <strong>argumentos de valor</strong> do produto para superar objeções</li></ul>"
            }
        ]
    }'::jsonb
)
WHERE id = (SELECT id FROM target_course);

-- 3. Confirmar
SELECT id, title FROM courses WHERE title ILIKE '%Planejamento%Tempo%Produtividade%';
