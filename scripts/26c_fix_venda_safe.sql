-- Script: 26c_fix_venda_safe.sql
-- Fix seguro: usa FROM + JOIN ao invés de subquery no ARRAY para evitar null.
-- Distingue os dois módulos com "Venda" no título pelo tipo do primeiro bloco.
-- Execute no Supabase SQL Editor.

-- ================================================
-- VERIFICAR estado atual (rode isso PRIMEIRO para entender a situação)
-- ================================================
SELECT
    (ordinality - 1) AS idx,
    module->>'title' AS title,
    module->'blocks'->0->>'type' AS first_block_type,
    module->'blocks'->0->>'imageSrc' AS first_image_src
FROM courses,
    jsonb_array_elements(modules) WITH ORDINALITY AS t(module, ordinality)
WHERE title ILIKE '%Planejamento%Tempo%Produtividade%'
ORDER BY ordinality;

-- ================================================
-- PASSO 1: Restaurar módulo que foi sobrescrito acidentalmente
-- (tem título "Venda" mas primeiro bloco é text_image_panel com prod_venda.png)
-- → Restauramos para "1. Funil de Vendas e 2. Retornos"
-- ================================================
UPDATE courses
SET modules = jsonb_set(
    modules,
    ARRAY[m.idx::text],
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
FROM (
    SELECT (ordinality - 1) AS idx
    FROM courses,
        jsonb_array_elements(modules) WITH ORDINALITY AS t(module, ordinality)
    WHERE title ILIKE '%Planejamento%Tempo%Produtividade%'
      AND (module->'blocks'->0->>'imageSrc') LIKE '%prod_venda%'
    LIMIT 1
) AS m
WHERE title ILIKE '%Planejamento%Tempo%Produtividade%';

-- ================================================
-- PASSO 2: Atualizar o módulo Venda REAL (pirâmide: primeiro bloco = image_content)
-- ================================================
UPDATE courses
SET modules = jsonb_set(
    modules,
    ARRAY[m.idx::text],
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
FROM (
    SELECT (ordinality - 1) AS idx
    FROM courses,
        jsonb_array_elements(modules) WITH ORDINALITY AS t(module, ordinality)
    WHERE title ILIKE '%Planejamento%Tempo%Produtividade%'
      AND (module->'blocks'->0->>'type') = 'image_content'
      AND module->>'title' ILIKE '%enda%'
    LIMIT 1
) AS m
WHERE title ILIKE '%Planejamento%Tempo%Produtividade%';

-- ================================================
-- VERIFICAÇÃO FINAL
-- ================================================
SELECT
    (ordinality - 1) AS idx,
    module->>'title' AS title,
    module->'blocks'->0->>'type' AS first_block_type
FROM courses,
    jsonb_array_elements(modules) WITH ORDINALITY AS t(module, ordinality)
WHERE title ILIKE '%Planejamento%Tempo%Produtividade%'
ORDER BY ordinality;
