-- Script: 32_add_tis_crm_image_slide3.sql
-- Adiciona imagem e melhora texto do slide TIS CRM (índice 3 no carousel)
-- Curso: Sistemas TEC-B2 (id: 55555555-5555-5555-5555-555555555555)
-- Execute no Supabase SQL Editor.

UPDATE courses
SET modules = jsonb_set(
    jsonb_set(
        jsonb_set(
            modules,
            ARRAY['0', 'slides', '3', 'image'],
            '"/images/courses/sys_tis_crm.png"'
        ),
        ARRAY['0', 'slides', '3', 'title'],
        '"TIS CRM"'
    ),
    ARRAY['0', 'slides', '3', 'text'],
    '"Nosso sistema de gestão <strong>exclusivo TEC-B2</strong>. Gerenciamento de clientes, contratos e chamados de forma integrada.<br><br>📊 O <strong>funil de vendas deve estar sempre atualizado</strong> aqui!"'
)
WHERE id = '55555555-5555-5555-5555-555555555555';

-- Verificação
SELECT
    slide->>'title' AS slide_title,
    slide->>'image' AS image_src
FROM courses,
    jsonb_array_elements(modules->0->'slides') WITH ORDINALITY AS s(slide, slide_idx)
WHERE id = '55555555-5555-5555-5555-555555555555';
