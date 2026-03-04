-- Script: 19_redesign_funil_retornos_step.sql
-- Reestrutura a etapa "1. Funil de Vendas e 2. Retornos" do curso
-- "Planejamento de Tempo e Produtividade".
-- ANTES: imagem grande (slide redundante) + bloco de texto corrido.
-- DEPOIS: texto → imagem funil → texto → imagem retornos (layout intercalado).
-- Execute no Supabase SQL Editor.

-- 1. Verificar o módulo atual (rodar este SELECT primeiro para confirmar)
SELECT
    id,
    title,
    idx - 1 AS module_index,
    module->>'title' AS module_title,
    jsonb_array_length(module->'blocks') AS block_count
FROM courses,
    jsonb_array_elements(modules) WITH ORDINALITY AS t(module, idx)
WHERE title ILIKE '%Planejamento%Tempo%Produtividade%'
ORDER BY idx;

-- 2. Após confirmar o índice correto (esperado: índice 1 para "Funil de Vendas"),
--    executar o UPDATE abaixo.
--    SE O ÍNDICE FOR DIFERENTE, ajuste o ARRAY[...] no jsonb_set.

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
                "_id": "funil_text_1",
                "type": "content",
                "content": "<h3 style=\"font-size:1.25rem;margin-bottom:0.75rem;color:var(--primary-light)\">🔍 1. Funil de Vendas</h3><p><strong>Comece o seu dia analisando o funil de vendas</strong>, organize seus retornos e avalie sua capacidade de fechamento.</p><ul style=\"margin-top:0.75rem;padding-left:1.5rem;line-height:2\"><li>Entenda a <strong>capacidade de produção</strong> para o dia</li><li>Gere previsibilidade para atingir os <strong>indicadores</strong></li><li>Participe das <strong>negociações mais importantes</strong></li></ul>"
            },
            {
                "_id": "funil_image_1",
                "type": "image_content",
                "title": "",
                "imageSrc": "/images/courses/prod_funil_vendas.png",
                "content": ""
            },
            {
                "_id": "retornos_text_1",
                "type": "content",
                "content": "<h3 style=\"font-size:1.25rem;margin-bottom:0.75rem;color:var(--primary-light)\">💼 2. Retornos</h3><p><strong>Organize seus retornos do dia.</strong> Seguir a base de retornos lhe ajudará a manter sua carteira em dia.</p><p style=\"margin-top:0.75rem\">Este é um ponto importante na sua jornada de gestão: <strong>gerenciar os retornos é essencial para gerar oportunidades.</strong></p>"
            },
            {
                "_id": "retornos_image_1",
                "type": "image_content",
                "title": "",
                "imageSrc": "/images/courses/prod_retornos.png",
                "content": ""
            }
        ]
    }'::jsonb
)
WHERE id = (SELECT id FROM target_course);

-- 3. Confirmar a atualização
SELECT id, title FROM courses WHERE title ILIKE '%Planejamento%Tempo%Produtividade%';
