-- Script: 27_redesign_finalizacao_idx9.sql
-- Atualiza diretamente o módulo Finalização no índice 9 (confirmado pelo SELECT).
-- Execute no Supabase SQL Editor.

UPDATE courses
SET modules = jsonb_set(
    modules,
    ARRAY['9'],
    '{
        "title": "9. Finalização",
        "blocks": [
            {
                "_id": "finalizacao_panel_1",
                "type": "text_image_panel",
                "imagePosition": "left",
                "imageSize": "md",
                "imageSrc": "/images/courses/prod_finalizacao.png",
                "imageAlt": "Finalização - relacionamento de longo prazo",
                "content": "<h3>🎉 Finalização</h3><p>Uma boa negociação é aquela em que <strong>ambos os lados saem felizes</strong>. Para isso, é fundamental que os ciclos 1 a 6 tenham sido executados de forma correta — somente assim você terá capacidade de construir uma <strong>negociação de valor</strong>.</p><ul style=\"margin-top:0.75rem\"><li>Negociar é <strong>construir soluções</strong>, não apenas fechar contratos</li><li>Uma negociação bem construída resulta em <strong>ticket médio maior</strong></li><li>Participe da construção de propostas e <strong>intervenha em casos de negativas</strong></li><li>Quando o cliente começar a utilizar a solução, você verá o resultado — isso gera um <strong>relacionamento de longo prazo</strong></li></ul><p style=\"margin-top:0.75rem; font-style:italic; opacity:0.85\">Você terá um comprador por muito tempo! 🤝</p>"
            }
        ]
    }'::jsonb
)
WHERE title ILIKE '%Planejamento%Tempo%Produtividade%';

-- Verificação
SELECT
    (ordinality - 1) AS idx,
    module->>'title' AS title,
    module->'blocks'->0->>'type' AS first_block_type
FROM courses,
    jsonb_array_elements(modules) WITH ORDINALITY AS t(module, ordinality)
WHERE title ILIKE '%Planejamento%Tempo%Produtividade%'
ORDER BY ordinality;
