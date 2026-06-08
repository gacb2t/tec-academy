-- Script de atualização FORÇADA do módulo de Auditorias no Supabase

-- 1. Excluir tabelas antigas para forçar a recriação com a nova estrutura
DROP TABLE IF EXISTS public.audits;
DROP TABLE IF EXISTS public.audit_folders;

-- 2. Recriar Tabela de Pastas de Auditoria com suporte a JSON
CREATE TABLE public.audit_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    collaborators JSONB NOT NULL DEFAULT '[]'::jsonb, -- Lista de usuários {id, name}
    managers JSONB NOT NULL DEFAULT '[]'::jsonb,     -- Lista de gestores {id, name}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Recriar Tabela de Auditorias
CREATE TABLE public.audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folder_id UUID NOT NULL REFERENCES public.audit_folders(id) ON DELETE CASCADE,
    qualification TEXT NOT NULL,
    audio_file_name TEXT,
    status TEXT NOT NULL DEFAULT 'pendente',
    result JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 4. Reaplicar Políticas RLS
ALTER TABLE public.audit_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo para todos em audit_folders" ON public.audit_folders FOR ALL USING (true);
CREATE POLICY "Permitir tudo para todos em audits" ON public.audits FOR ALL USING (true);

-- 5. Forçar a API do Supabase a limpar o cache e reconhecer as novas colunas
NOTIFY pgrst, 'reload schema';
