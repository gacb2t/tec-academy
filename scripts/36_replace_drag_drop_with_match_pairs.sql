-- Script: 36_replace_drag_drop_with_match_pairs.sql
-- Substitui o módulo drag_drop_sort (resposta embutida) por match_pairs (matching real)
-- Módulo 3 (idx=3): "Organizando a Ferramenta Pelo Objetivo"
-- Curso: Sistemas TEC-B2 (id: 55555555-5555-5555-5555-555555555555)
-- Execute no Supabase SQL Editor.

UPDATE courses
SET modules = jsonb_set(
    modules,
    ARRAY['3'],
    '{
        "type": "match_pairs",
        "title": "Combine a Ferramenta com o Propósito",
        "instruction": "Clique em um propósito à esquerda, depois clique na ferramenta correspondente à direita.",
        "pairs": [
            { "left": "WhatsApp c/ Cliente", "right": "Simplesdesk" },
            { "left": "Chat Interno & Notícias", "right": "Microsoft Teams" },
            { "left": "Visualizar Funil & Contratos", "right": "TIS CRM" },
            { "left": "Consulta Viabilidade de Fibra", "right": "Smart Vendas" }
        ]
    }'::jsonb
)
WHERE id = '55555555-5555-5555-5555-555555555555';

-- Verificação
SELECT
    (ordinality - 1) AS idx,
    module->>'title' AS title,
    module->>'type' AS type
FROM courses,
    jsonb_array_elements(modules) WITH ORDINALITY AS t(module, ordinality)
WHERE id = '55555555-5555-5555-5555-555555555555'
ORDER BY ordinality;
