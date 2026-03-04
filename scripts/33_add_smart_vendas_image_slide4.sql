-- Script: 33_add_smart_vendas_image_slide4.sql
-- Adiciona imagem e melhora texto do slide Smart Vendas & Cockpit (índice 4 no carousel)
-- Curso: Sistemas TEC-B2 (id: 55555555-5555-5555-5555-555555555555)
-- Execute no Supabase SQL Editor.

UPDATE courses
SET modules = jsonb_set(
    jsonb_set(
        jsonb_set(
            modules,
            ARRAY['0', 'slides', '4', 'image'],
            '"/images/courses/sys_smart_vendas.png"'
        ),
        ARRAY['0', 'slides', '4', 'title'],
        '"Smart Vendas & Cockpit"'
    ),
    ARRAY['0', 'slides', '4', 'text'],
    '"Ferramenta <strong>Vivo</strong> para consultar viabilidade de fibra por CNPJ/CPF.<br><br>📡 Em algumas situações, permite <strong>consulta manual via Cockpit</strong> — atenção especial a cidades com <strong>CEP único</strong>!"'
)
WHERE id = '55555555-5555-5555-5555-555555555555';

-- Verificação
SELECT
    slide->>'title' AS slide_title,
    slide->>'image' AS image_src
FROM courses,
    jsonb_array_elements(modules->0->'slides') WITH ORDINALITY AS s(slide, slide_idx)
WHERE id = '55555555-5555-5555-5555-555555555555';
