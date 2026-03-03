-- Script: 28_redesign_piramide_idx0.sql
-- Atualiza a primeira etapa "A Pirâmide de Produtividade" (idx = 0).
-- Substitui o slide original (prod_slide_1.png) por uma imagem nova e mais limpa
-- mostrando a pirâmide com os 4 níveis rotulados, sem o texto das dicas.
-- O texto "Dicas para planejar seu tempo" permanece no bloco de texto abaixo.
-- Execute no Supabase SQL Editor.

UPDATE courses
SET modules = jsonb_set(
    modules,
    ARRAY['0'],
    '{
        "title": "A Pirâmide de Produtividade",
        "blocks": [
            {
                "_id": "piramide_img_1",
                "type": "image_content",
                "title": "",
                "imageSrc": "/images/courses/prod_piramide.png",
                "content": ""
            },
            {
                "_id": "piramide_text_1",
                "type": "content",
                "content": "<p><strong>Dicas para planejar seu tempo</strong></p><p>O sucesso das suas vendas começa na base da nossa pirâmide: <strong>O Planejamento</strong>. Cada nível representa uma etapa essencial no seu processo, e dominá-los em ordem garante resultados consistentes e previsíveis.</p>"
            }
        ]
    }'::jsonb
)
WHERE title ILIKE '%Planejamento%Tempo%Produtividade%';

-- Verificação
SELECT
    (ordinality - 1) AS idx,
    module->>'title' AS title,
    module->'blocks'->0->>'type' AS first_block_type,
    module->'blocks'->0->>'imageSrc' AS image_src
FROM courses,
    jsonb_array_elements(modules) WITH ORDINALITY AS t(module, ordinality)
WHERE title ILIKE '%Planejamento%Tempo%Produtividade%'
  AND (ordinality - 1) = 0;
