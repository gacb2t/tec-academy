-- Script: 13_fix_disney_video_delay.sql
-- Adiciona delay de 15min (900s) ao vídeo da Disney no curso Processos de Vendas
-- A estrutura do step é PLANA (type: "video" diretamente no objeto do módulo)
-- Execute no Supabase SQL Editor

UPDATE courses
SET modules = (
    SELECT jsonb_agg(
        CASE
            WHEN step->>'title' = 'A Magia da Disney e a Empatia'
            THEN jsonb_set(step, '{requireDelay}', '900'::jsonb)
            ELSE step
        END
    )
    FROM jsonb_array_elements(modules) AS step
)
WHERE title ILIKE '%Processo%' OR title ILIKE '%Processos%';

-- Verificar: deve mostrar requireDelay = 900
SELECT
    title,
    m->>'title'        AS step_title,
    (m->>'requireDelay') AS require_delay
FROM courses,
     jsonb_array_elements(modules) AS m
WHERE title ILIKE '%Processo%'
  AND m->>'title' = 'A Magia da Disney e a Empatia';
