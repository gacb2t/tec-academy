-- ====================================================================================
-- GO-LIVE DE SEGURANÇA: INTEGRAÇÃO CLERK + SUPABASE
-- ====================================================================================

-- PASSO 1: CONFIGURAR O JWT TEMPLATE NO CLERK
-- ====================================================================================
-- 1. Acesse o painel do Clerk (clerk.com) do seu projeto.
-- 2. No menu lateral, vá em "JWT Templates".
-- 3. Clique no botão "New Template" e escolha a opção "Supabase".
-- 4. Digite "supabase" no campo Name (exatamente assim, minúsculo).
-- 5. Role a página e clique em "Apply changes".
-- 
-- PRONTO! O código que eu fiz no React agora vai automaticamente pegar esse token
-- e mandar para o Supabase em toda requisição, provando quem é o usuário.

-- PASSO 2: EXECUTAR ESTE SCRIPT NO SQL EDITOR DO SUPABASE
-- ====================================================================================

-- 2.1 Criar a função que extrai o ID do usuário (do Clerk) de dentro do Token seguro
CREATE OR REPLACE FUNCTION requesting_user_id()
RETURNS text
LANGUAGE sql STABLE
AS $$
  select nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
$$;

-- 2.2 DELETAR AS REGRAS "TRUE" (Abertas) antigas
-- (Isso vai "trancar" o seu banco de dados para acessos sem token)
DROP POLICY IF EXISTS "Permitir leitura global" ON public.job_applications;
DROP POLICY IF EXISTS "Permitir atualizacao global" ON public.job_applications;
DROP POLICY IF EXISTS "Permitir delecao global" ON public.job_applications;
-- Nota: A política de "Inserção anônima para webhooks" da job_applications
-- não deve ser apagada, pois ferramentas externas não têm o token do Clerk.

-- (Opcional - mas recomendado se a user_profiles estiver aberta)
-- Caso você tenha criado uma policy com nome genérico antes, adicione o DROP aqui.

-- 2.3 CRIAR AS NOVAS REGRAS SEGURAS (RLS)
-- As tabelas agora só vão responder se quem estiver pedindo for alguém
-- que o "requesting_user_id()" conseguir identificar (ou seja, logado no Clerk).

-- Tabela: job_applications (Candidatos)
CREATE POLICY "Leitura de candidatos protegida por token Clerk" 
ON public.job_applications FOR SELECT 
USING (requesting_user_id() IS NOT NULL);

CREATE POLICY "Atualizacao de candidatos protegida por token Clerk" 
ON public.job_applications FOR UPDATE 
USING (requesting_user_id() IS NOT NULL);

CREATE POLICY "Delecao de candidatos protegida por token Clerk" 
ON public.job_applications FOR DELETE 
USING (requesting_user_id() IS NOT NULL);

-- Tabela: user_profiles (Perfis)
-- Todo usuário autenticado no sistema pode ler perfis
CREATE POLICY "Leitura de perfis protegida por token" 
ON public.user_profiles FOR SELECT 
USING (requesting_user_id() IS NOT NULL);

-- Apenas o próprio dono pode atualizar o próprio perfil (ou administradores, mas 
-- como a interface admin é blindada no React, para o MVP essa política é excelente)
CREATE POLICY "Edicao de perfil pelo dono" 
ON public.user_profiles FOR UPDATE 
USING (requesting_user_id() = user_id);

-- Para TODAS as outras tabelas (audits, campaigns, etc) do sistema, você pode rodar
-- políticas parecidas com essa para garantir que apenas quem passou pelo Clerk veja os dados.
