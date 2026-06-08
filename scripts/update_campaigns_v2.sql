-- Adicionando novas colunas na tabela campaigns para fixar
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;

-- Adicionando likes nos comentários
ALTER TABLE public.campaign_comments ADD COLUMN IF NOT EXISTS likes TEXT[] DEFAULT '{}';

-- Atualizando a tabela de vendas (campaign_sales)
ALTER TABLE public.campaign_sales ADD COLUMN IF NOT EXISTS sale_id TEXT;
ALTER TABLE public.campaign_sales ADD COLUMN IF NOT EXISTS cnpj TEXT;
ALTER TABLE public.campaign_sales ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;
