-- Script: 29d_fix_simplesdesk_title_and_text.sql
-- Corrige o nome para "Simplesdesk" (estava "Simpledesk")
-- Adiciona badge Meta verificado ao título
-- Melhora a formatação do texto
-- Curso: Sistemas TEC-B2 (id: 55555555-5555-5555-5555-555555555555)
-- Execute no Supabase SQL Editor.

UPDATE courses
SET modules = jsonb_set(
    -- 1. Corrigir o título com badge Meta
    jsonb_set(
        modules,
        ARRAY['0', 'slides', '0', 'title'],
        '"Simplesdesk <span class=\"meta-badge\">✓</span>"'
    ),
    -- 2. Melhorar o texto com formatação HTML
    ARRAY['0', 'slides', '0', 'text'],
    '"Nossa ferramenta oficial para <strong>comunicação com nossos clientes</strong>. Com ela, centralizamos todas as conversas do WhatsApp em uma única plataforma, facilitando o dia a dia.<br><br>É de <strong>uso exclusivo para relacionamento com clientes</strong>!"'
)
WHERE id = '55555555-5555-5555-5555-555555555555';

-- Verificação
SELECT
    slide->>'title' AS slide_title,
    slide->>'text' AS slide_text,
    slide->>'image' AS image_src
FROM courses,
    jsonb_array_elements(modules->0->'slides') WITH ORDINALITY AS s(slide, slide_idx)
WHERE id = '55555555-5555-5555-5555-555555555555'
  AND (slide_idx - 1) = 0;
