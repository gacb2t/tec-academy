-- Script: 08_remove_email_step_intro_rh.sql
-- Remove a etapa "Solicitação de E-mail Corporativo" (webhook_form) do curso intro-recursos-humanos

UPDATE courses
SET modules = (
  SELECT jsonb_agg(step ORDER BY (step->>'id'))
  FROM jsonb_array_elements(modules) AS step
  WHERE step->>'id' != 'step_intro_rh_7'
)
WHERE title ILIKE '%Bem-vindo%TEC-B2%'
   OR title ILIKE '%TEC-B2%Bem-vindo%'
   OR (title ILIKE '%RH%' AND title ILIKE '%Introdu%');
