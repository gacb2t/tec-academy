-- Script: 19b_redesign_funil_text_image_panel.sql
-- Versão 2: usa o novo tipo de bloco "text_image_panel" que une texto + imagem
-- lado a lado (ao invés de blocos separados).
-- Imagem à DIREITA no Funil de Vendas, à ESQUERDA no Retornos — layout alternado.
-- Execute no Supabase SQL Editor.

-- 1. Preview: confirmar o índice do módulo
SELECT
    (ordinality - 1) AS module_index,
    module->>'title' AS module_title
FROM courses,
    jsonb_array_elements(modules) WITH ORDINALITY AS t(module, ordinality)
WHERE title ILIKE '%Planejamento%Tempo%Produtividade%'
ORDER BY ordinality;

-- 2. UPDATE com novo layout text_image_panel
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
      AND module->>'title' ILIKE '%Funil de Vendas%'
    LIMIT 1
)
UPDATE courses
SET modules = jsonb_set(
    modules,
    ARRAY[(SELECT idx FROM module_idx)::text],
    '{
        "title": "1. Funil de Vendas e 2. Retornos",
        "blocks": [
            {
                "_id": "funil_panel_1",
                "type": "text_image_panel",
                "imagePosition": "right",
                "imageSize": "md",
                "imageSrc": "/images/courses/prod_funil_vendas.png",
                "imageAlt": "Funil de Vendas - análise diária",
                "content": "<h3>🔍 1. Funil de Vendas</h3><p><strong>Comece o seu dia analisando o funil de vendas</strong>, organize seus retornos e avalie sua capacidade de fechamento.</p><ul><li>Entenda a <strong>capacidade de produção</strong> para o dia</li><li>Gere previsibilidade para atingir os <strong>indicadores</strong></li><li>Participe das <strong>negociações mais importantes</strong></li></ul>"
            },
            {
                "_id": "retornos_panel_1",
                "type": "text_image_panel",
                "imagePosition": "left",
                "imageSize": "md",
                "imageSrc": "/images/courses/prod_retornos.png",
                "imageAlt": "Retornos - gestão de carteira",
                "content": "<h3>💼 2. Retornos</h3><p><strong>Organize seus retornos do dia.</strong> Seguir a base de retornos lhe ajudará a manter sua carteira em dia.</p><p>Este é um ponto importante na sua jornada de gestão: <strong>gerenciar os retornos é essencial para gerar oportunidades.</strong></p>"
            }
        ]
    }'::jsonb
)
WHERE id = (SELECT id FROM target_course);

-- 3. Confirmar
SELECT id, title FROM courses WHERE title ILIKE '%Planejamento%Tempo%Produtividade%';
