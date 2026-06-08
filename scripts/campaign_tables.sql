-- =================================================================================
-- SCRIPT DE BANCO DE DADOS: CAMPANHAS E MARKETPLACE
-- =================================================================================

-- 1. Tabela de Campanhas
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    author_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    departments TEXT[] DEFAULT '{"Todos"}',
    criteria JSONB DEFAULT '[]', -- Lista de objetivos/recompensas
    super_goal_type TEXT, -- 'Global', 'Time', 'Individual'
    super_goal_value NUMERIC DEFAULT 0,
    super_goal_unit TEXT, -- 'R$', 'Pontos'
    progress_value NUMERIC DEFAULT 0, -- Somatório de vendas da campanha
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Interações (Curtidas/Palmas)
CREATE TABLE IF NOT EXISTS public.campaign_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    interaction_type TEXT NOT NULL, -- 'like', 'clap'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, user_id, interaction_type) -- O usuário só pode dar 1 like e 1 clap por post
);

-- 3. Tabela de Comentários
CREATE TABLE IF NOT EXISTS public.campaign_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de Vendas Registradas na Campanha
CREATE TABLE IF NOT EXISTS public.campaign_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    client_name TEXT NOT NULL,
    product_name TEXT NOT NULL,
    sale_value NUMERIC NOT NULL,
    proof_url TEXT, -- Link do comprovante (se houver)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela da Carteira de Pontos dos Usuários (Marketplace)
CREATE TABLE IF NOT EXISTS public.user_wallets (
    user_id TEXT PRIMARY KEY,
    balance NUMERIC DEFAULT 0, -- Quantidade de pontos
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabela de Itens do Marketplace
CREATE TABLE IF NOT EXISTS public.marketplace_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- 'Cupom', 'R$', 'Pontos', 'Produto'
    price NUMERIC NOT NULL, -- Custo em pontos
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabela de Resgates do Marketplace
CREATE TABLE IF NOT EXISTS public.marketplace_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    item_id UUID REFERENCES public.marketplace_items(id) ON DELETE CASCADE,
    price_paid NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'delivered'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================================================================================
-- STORAGE: BUCKETS
-- =================================================================================

-- Criar bucket para mídias de campanhas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('campaign_media', 'campaign_media', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acesso público para leitura do bucket
CREATE POLICY "Public Access for campaign_media" ON storage.objects
    FOR SELECT USING (bucket_id = 'campaign_media');

-- Políticas de acesso autenticado para upload no bucket
CREATE POLICY "Auth Upload for campaign_media" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'campaign_media' AND auth.role() = 'authenticated');
    
CREATE POLICY "Auth Update for campaign_media" ON storage.objects
    FOR UPDATE USING (bucket_id = 'campaign_media' AND auth.role() = 'authenticated');
    
CREATE POLICY "Auth Delete for campaign_media" ON storage.objects
    FOR DELETE USING (bucket_id = 'campaign_media' AND auth.role() = 'authenticated');
