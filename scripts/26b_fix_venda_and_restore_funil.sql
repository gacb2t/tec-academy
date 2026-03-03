-- Script: 26b_fix_venda_and_restore_funil.sql
-- PROBLEMA: o script anterior usou ILIKE '%Venda%' que também matchou
-- "1. Funil de Vendas e 2. Retornos" (vem antes no array).
-- SOLUÇÃO:
--   PASSO 1: Restaurar o módulo Funil de Vendas com seu conteúdo correto.
--   PASSO 2: Atualizar o módulo "Venda" usando match exato de título.
-- Execute no Supabase SQL Editor.

-- ================================================
-- PASSO 1: Restaurar o módulo "1. Funil de Vendas e 2. Retornos"
-- ================================================
WITH target_course AS (
    SELECT id FROM courses WHERE title ILIKE '%Planejamento%Tempo%Produtividade%' LIMIT 1
),
module_idx AS (
    SELECT (ordinality - 1) AS idx
    FROM courses,
        jsonb_array_elements(modules) WITH ORDINALITY AS t(module, ordinality)
    WHERE id = (SELECT id FROM target_course)
      AND module->>'title' ILIKE '%Funil%'
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

-- ================================================
-- PASSO 2: Atualizar o módulo "Venda" com match exato de título
-- ================================================
WITH target_course AS (
    SELECT id FROM courses WHERE title ILIKE '%Planejamento%Tempo%Produtividade%' LIMIT 1
),
module_idx AS (
    SELECT (ordinality - 1) AS idx
    FROM courses,
        jsonb_array_elements(modules) WITH ORDINALITY AS t(module, ordinality)
    WHERE id = (SELECT id FROM target_course)
      AND lower(module->>'title') = 'venda'
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

-- ================================================
-- VERIFICAÇÃO: listar todos os módulos e tipos
-- ================================================
SELECT
    (ordinality - 1) AS idx,
    module->>'title' AS title,
    module->'blocks'->0->>'type' AS first_block_type
FROM courses,
    jsonb_array_elements(modules) WITH ORDINALITY AS t(module, ordinality)
WHERE title ILIKE '%Planejamento%Tempo%Produtividade%'
ORDER BY ordinality;
