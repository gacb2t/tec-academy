-- Script: 24b_fix_negociacoes_remove_pyramid_and_expand.sql
-- Dois ajustes na etapa "Negociações" do curso Planejamento de Tempo e Produtividade:
-- 1. REMOVE o módulo pirâmide (redundante com o TextImagePanel que criamos).
-- 2. ATUALIZA o TextImagePanel com o conteúdo completo do slide original.
-- Execute no Supabase SQL Editor.

-- ===========================
-- PASSO 1: Remover o módulo pirâmide (image_content) com título "Negociações"
-- (é o que ainda mostra o slide da pirâmide + texto igual abaixo)
-- ===========================
UPDATE courses
SET modules = (
    SELECT jsonb_agg(module ORDER BY ordinality)
    FROM jsonb_array_elements(modules) WITH ORDINALITY AS t(module, ordinality)
    WHERE NOT (
        module->>'title' ILIKE '%Negociações%'
        AND (module->'blocks'->0->>'type') = 'image_content'
    )
)
WHERE title ILIKE '%Planejamento%Tempo%Produtividade%';

-- ===========================
-- PASSO 2: Atualizar o TextImagePanel com o conteúdo COMPLETO do slide
-- ===========================
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
      AND module->>'title' ILIKE '%Negociações%'
      AND (module->'blocks'->0->>'type') = 'text_image_panel'
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
                "imageAlt": "Negociação win-win — construir soluções com valor",
                "content": "<h3>🤝 Negociações</h3><p>Lembre-se: uma boa negociação é aquela em que <strong>ambos os lados saem felizes</strong>. Para isso, é fundamental que os ciclos 1 a 6 tenham sido executados corretamente — somente assim você terá capacidade de construir uma <strong>negociação de valor</strong>.</p><p style=\"margin-top:0.75rem\">Tenha em mente o que caracteriza uma negociação. <strong>Negociar é construir soluções.</strong> A construção de uma negociação resulta em um ticket médio maior, enquanto apenas adicionar um produto não traz muitos recursos de receita adicional. Por isso, <strong>construa suas negociações com cuidado.</strong></p><ul style=\"margin-top:0.75rem\"><li>Participe ativamente das negociações e da <strong>construção de propostas</strong> — é a melhor forma de entender como estão sendo conduzidas</li><li>Esteja apto a <strong>intervir em casos de negativas</strong> ou dificuldades pontuais</li><li>Você verá o resultado quando o cliente <strong>começar a utilizar a solução</strong> — isso gera relacionamento de longo prazo</li></ul><p style=\"margin-top:0.75rem; font-style: italic; opacity: 0.85\">Você terá um comprador por muito tempo!</p>"
            }
        ]
    }'::jsonb
)
WHERE id = (SELECT id FROM target_course);

-- ===========================
-- VERIFICAÇÃO FINAL
-- ===========================
SELECT
    (ordinality - 1) AS module_index,
    module->>'title' AS title,
    jsonb_array_length(module->'blocks') AS blocks,
    module->'blocks'->0->>'type' AS first_block_type
FROM courses,
    jsonb_array_elements(modules) WITH ORDINALITY AS t(module, ordinality)
WHERE title ILIKE '%Planejamento%Tempo%Produtividade%'
ORDER BY ordinality;
