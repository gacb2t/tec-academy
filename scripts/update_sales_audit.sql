-- Adicionar status e motivo de rejeição na tabela de vendas
ALTER TABLE public.campaign_sales ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.campaign_sales ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Atualizar todas as vendas antigas para 'approved' para não afetar o placar retroativamente
UPDATE public.campaign_sales SET status = 'approved' WHERE status = 'pending' OR status IS NULL;
