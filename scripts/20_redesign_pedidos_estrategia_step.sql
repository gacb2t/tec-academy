-- Script: 20_redesign_pedidos_estrategia_step.sql
-- Aplica o padrão TextImagePanel na etapa "3. Pedidos e 4. Estratégia"
-- do curso "Planejamento de Tempo e Produtividade".
-- Imagem à DIREITA no Pedidos, à ESQUERDA na Estratégia — layout alternado.
-- Execute no Supabase SQL Editor.

-- 1. Preview: confirmar o índice do módulo
SELECT
    (ordinality - 1) AS module_index,
    module->>'title' AS module_title
FROM courses,
    jsonb_array_elements(modules) WITH ORDINALITY AS t(module, ordinality)
WHERE title ILIKE '%Planejamento%Tempo%Produtividade%'
ORDER BY ordinality;

-- 2. UPDATE com layout text_image_panel alternado
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
      AND module->>'title' ILIKE '%Pedidos%'
    LIMIT 1
)
UPDATE courses
SET modules = jsonb_set(
    modules,
    ARRAY[(SELECT idx FROM module_idx)::text],
    '{
        "title": "3. Pedidos e 4. Estratégia",
        "blocks": [
            {
                "_id": "pedidos_panel_1",
                "type": "text_image_panel",
                "imagePosition": "right",
                "imageSize": "md",
                "imageSrc": "/images/courses/prod_pedidos.png",
                "imageAlt": "Pedidos - controle de status",
                "content": "<h3>📋 3. Pedidos</h3><p>Verifique seus pedidos e fique atento aos status <strong>AG, ACEITE e SOLUÇÃO CONSULTOR</strong>. Trate as demandas e siga para o próximo passo.</p><ul><li><strong>Gerencie os pedidos reprovados por crédito</strong> com atenção</li><li>Tornar sua produtividade eficiente significa tratar cada pedido com cuidado</li><li>Aproveite este momento para <strong>debater soluções para cada caso</strong></li></ul>"
            },
            {
                "_id": "estrategia_panel_1",
                "type": "text_image_panel",
                "imagePosition": "left",
                "imageSize": "md",
                "imageSrc": "/images/courses/prod_estrategia.png",
                "imageAlt": "Estratégia - planejamento do dia",
                "content": "<h3>🚀 4. Estratégia</h3><p>Chegou o momento de <strong>planejar seu dia</strong>: entender qual perfil de cliente você irá abordar e definir suas metas de prospecção.</p><p>Fique atento às oportunidades que sua lista de clientes pode gerar. <strong>Garantir que a proposta de trabalho foi executada é um grande trunfo</strong> para o sucesso da estratégia.</p>"
            }
        ]
    }'::jsonb
)
WHERE id = (SELECT id FROM target_course);

-- 3. Confirmar
SELECT id, title FROM courses WHERE title ILIKE '%Planejamento%Tempo%Produtividade%';
