-- Rode este script no SQL Editor do seu Supabase Dashboard para corrigir as permissões

-- Remove as políticas antigas (se existirem)
DROP POLICY IF EXISTS "Permitir inserções anônimas para webhooks" ON public.job_applications;
DROP POLICY IF EXISTS "Permitir leitura para usuários autenticados" ON public.job_applications;
DROP POLICY IF EXISTS "Permitir atualização para usuários autenticados" ON public.job_applications;
DROP POLICY IF EXISTS "Permitir deleção para usuários autenticados" ON public.job_applications;

-- Cria a tabela caso não exista (não afeta se já existir)
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    stage TEXT NOT NULL DEFAULT 'Inscrição realizada',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilita RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Como o sistema usa o Clerk para autenticação no frontend (e não o Supabase Auth), 
-- o frontend se conecta ao Supabase como usuário anônimo.
-- Portanto, precisamos liberar as políticas para 'true' para o sistema funcionar corretamente.

CREATE POLICY "Permitir inserção global" 
ON public.job_applications FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura global" 
ON public.job_applications FOR SELECT USING (true);

CREATE POLICY "Permitir atualizacao global" 
ON public.job_applications FOR UPDATE USING (true);

CREATE POLICY "Permitir delecao global" 
ON public.job_applications FOR DELETE USING (true);
