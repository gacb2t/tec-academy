-- Script para criação do módulo de Auditorias no Supabase

-- 1. Tabela de Configurações de Auditoria (ex: Qualificações)
CREATE TABLE IF NOT EXISTS public.audit_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Inserir configuração padrão de qualificações se não existir
INSERT INTO public.audit_settings (settings) 
SELECT '{"qualifications": ["Venda Fechada", "Acompanhamento (Follow-up)", "Suporte Comercial", "Retenção / Cancelamento"]}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.audit_settings);


-- 2. Tabela de Pastas de Auditoria
-- IMPORTANTE: Se a tabela audit_folders já existir, exclua-a antes de rodar este script (DROP TABLE public.audits; DROP TABLE public.audit_folders;)
CREATE TABLE IF NOT EXISTS public.audit_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    collaborators JSONB NOT NULL DEFAULT '[]'::jsonb, -- Lista de usuários {id, name}
    managers JSONB NOT NULL DEFAULT '[]'::jsonb,     -- Lista de gestores {id, name}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Tabela de Auditorias
CREATE TABLE IF NOT EXISTS public.audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folder_id UUID NOT NULL REFERENCES public.audit_folders(id) ON DELETE CASCADE,
    qualification TEXT NOT NULL,
    audio_file_name TEXT,
    status TEXT NOT NULL DEFAULT 'pendente', -- pendente, transcrevendo, analisando, concluido, erro
    result JSONB, -- O JSON estruturado retornado pela OpenAI
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Políticas RLS genéricas (Neste projeto as políticas são permissivas para simplificar, mas podem ser restritas depois)
ALTER TABLE public.audit_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo para todos em audit_settings" ON public.audit_settings FOR ALL USING (true);
CREATE POLICY "Permitir tudo para todos em audit_folders" ON public.audit_folders FOR ALL USING (true);
CREATE POLICY "Permitir tudo para todos em audits" ON public.audits FOR ALL USING (true);
