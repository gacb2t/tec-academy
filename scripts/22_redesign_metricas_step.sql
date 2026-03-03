-- Script: 22_redesign_metricas_step.sql
-- Aplica o padrão TextImagePanel na etapa "Métricas" (5)
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
      AND module->>'title' ILIKE '%Métrica%'
    LIMIT 1
)
UPDATE courses
SET modules = jsonb_set(
    modules,
    ARRAY[(SELECT idx FROM module_idx)::text],
    '{
        "title": "Métricas",
        "blocks": [
            {
                "_id": "metricas_panel_1",
                "type": "text_image_panel",
                "imagePosition": "right",
                "imageSize": "md",
                "imageSrc": "/images/courses/prod_metricas.png",
                "imageAlt": "Métricas - KPIs e metas do dia",
                "content": "<h3>📊 Métricas do Dia</h3><p>Tenha <strong>objetivos bem definidos</strong>. É importante ter ao menos <strong>5 oportunidades quentes</strong> criadas durante sua jornada, buscando abrir negociações em todos os indicadores.</p><ul><li>Inicie o dia com, no mínimo, <strong>R$ 2.500,00 por consultor</strong> no funil</li><li>Mantenha atenção aos produtos necessários para a <strong>composição da meta</strong></li><li>Os contatos devem gerar oportunidades — <strong>não adianta contatar sem objetivo claro</strong></li><li>Seu dia não pode encerrar sem, ao menos, <strong>5 novas negociações</strong></li></ul>"
            }
        ]
    }'::jsonb
)
WHERE id = (SELECT id FROM target_course);

-- 3. Confirmar
SELECT id, title FROM courses WHERE title ILIKE '%Planejamento%Tempo%Produtividade%';
