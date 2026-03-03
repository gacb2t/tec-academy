-- Script: 23_redesign_pesquisa_abordagem_step.sql
-- Aplica o padrão TextImagePanel na etapa "Pesquisa/Abordagem" (6)
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
      AND (module->>'title' ILIKE '%Pesquisa%' OR module->>'title' ILIKE '%Abordagem%')
    LIMIT 1
)
UPDATE courses
SET modules = jsonb_set(
    modules,
    ARRAY[(SELECT idx FROM module_idx)::text],
    '{
        "title": "Pesquisa/Abordagem",
        "blocks": [
            {
                "_id": "abordagem_panel_1",
                "type": "text_image_panel",
                "imagePosition": "right",
                "imageSize": "md",
                "imageSrc": "/images/courses/prod_abordagem.png",
                "imageAlt": "Pesquisa e abordagem humanizada",
                "content": "<h3>🤝 Pesquisa e Abordagem</h3><p>Uma boa abordagem pode <strong>reduzir significativamente o caminho para a conquista</strong>. Buscar maneiras humanizadas e demonstrar conhecimento é fundamental para construir uma negociação sólida.</p><ul><li>Aplique seu conhecimento sobre os <strong>produtos</strong> e sobre as características do <strong>negócio do cliente</strong></li><li>Utilize <strong>prova social</strong>, referências de concorrentes e possíveis soluções</li><li>Crie um elo entre as soluções, o atendimento e as <strong>necessidades do cliente</strong></li><li>Entenda as <strong>principais dificuldades</strong> do cliente e traga analogias com nossos produtos</li><li>Deixe claro o motivo da escolha do produto e <strong>o quanto ele contribui para o sucesso do negócio</strong></li></ul>"
            }
        ]
    }'::jsonb
)
WHERE id = (SELECT id FROM target_course);

-- 3. Confirmar
SELECT id, title FROM courses WHERE title ILIKE '%Planejamento%Tempo%Produtividade%';
