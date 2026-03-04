-- Script: 40_promote_guilherme_admin.sql
-- Promove Guilherme de Albuquerque para administrador.
-- Execute no Supabase SQL Editor.

-- 1. Verificar o usuário
SELECT id, email, role, department FROM users
WHERE email = 'guilherme@tecb2.com.br';

-- 2. Promover para admin
UPDATE users
SET role = 'admin'
WHERE email = 'guilherme@tecb2.com.br';

-- 3. Confirmar
SELECT id, email, role FROM users
WHERE email = 'guilherme@tecb2.com.br';
