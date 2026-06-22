-- Migração para Webhooks (Fase 3)

CREATE TABLE IF NOT EXISTS public.webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    event TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configurando RLS (Row Level Security) para segurança
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem ler/escrever webhooks, mas o backend (Service Role) ignora o RLS.
CREATE POLICY "Permitir leitura/escrita para admin" ON public.webhooks 
    FOR ALL USING (
        (SELECT role FROM public.user_profiles WHERE user_id = auth.uid()::text) = 'admin'
    );
