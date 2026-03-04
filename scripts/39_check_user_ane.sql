-- Script: 39_check_user_ane.sql
-- Verificar usuários com 'ane' no email e promover como admin se encontrado.
-- Execute no Supabase SQL Editor.

-- 1. Verificar se existe usuário com 'ane' no email
SELECT id, email, role, department, created_at
FROM users
WHERE email ILIKE '%ane%'
ORDER BY created_at;

-- 2. Se encontrado, promover para admin (descomente e ajuste o email):
-- UPDATE users
-- SET role = 'admin'
-- WHERE email ILIKE '%ane%';
