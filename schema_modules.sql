-- Migração para Módulos e Materiais (Fase 2)

CREATE TABLE IF NOT EXISTS public.modules (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    icon TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.materials (
    id TEXT PRIMARY KEY,
    module_id TEXT NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    embed_src TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'presentation',
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configurando RLS (Row Level Security) para permitir leitura pública e escrita autenticada/admin
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura para todos" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Permitir leitura para todos" ON public.materials FOR SELECT USING (true);

-- (Nota: Para inserção, usaremos a SERVICE_ROLE_KEY no script de seed, que ignora o RLS).
