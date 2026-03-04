-- Script: 25_redesign_propostas_step.sql
-- Aplica o padrão TextImagePanel na etapa "Propostas" (8)
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
      AND module->>'title' ILIKE '%Proposta%'
    LIMIT 1
)
UPDATE courses
SET modules = jsonb_set(
    modules,
    ARRAY[(SELECT idx FROM module_idx)::text],
    '{
        "title": "Propostas",
        "blocks": [
            {
                "_id": "propostas_panel_1",
                "type": "text_image_panel",
                "imagePosition": "right",
                "imageSize": "md",
                "imageSrc": "/images/courses/prod_propostas.png",
                "imageAlt": "Propostas - agregar valor além do preço",
                "content": "<h3>📄 Propostas</h3><p>Confeccionar a proposta é muito mais do que enviar um orçamento. <strong>Este é o momento que definirá o sucesso da sua abordagem.</strong> Entender os pontos críticos e as possíveis melhorias é fundamental para uma proposta bem elaborada, gerando maior aceitação por parte do cliente.</p><ul style=\"margin-top:0.75rem\"><li>Lembre-se: <strong>preço e qualidade nem sempre estão alinhados</strong> — a proposta deve agregar valor</li><li>É possível encontrar margem em outras categorias de produtos, evitando <strong>desvalorizar sua renovação</strong></li><li>Certifique-se de que a proposta atende às necessidades do cliente, possui clareza e está <strong>alinhada com a abordagem realizada</strong></li><li>Acompanhe a comunicação pelo <strong>SIMPLESDESK</strong> e verifique se está de acordo com as expectativas</li></ul><p style=\"margin-top:0.75rem\">Após enviar suas propostas, <strong>atualize seu funil de vendas</strong>. Mantenha-o abastecido com informações relevantes sobre a conversa — assim você poderá acompanhar e contornar diversas situações.</p>"
            }
        ]
    }'::jsonb
)
WHERE id = (SELECT id FROM target_course);

-- 3. Confirmar
SELECT id, title FROM courses WHERE title ILIKE '%Planejamento%Tempo%Produtividade%';
