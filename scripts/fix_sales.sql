-- 1. Adicionar a coluna criteria_id
ALTER TABLE public.campaign_sales ADD COLUMN IF NOT EXISTS criteria_id TEXT;

-- 2. Atualizar a venda que estava com erro de digitação
UPDATE public.campaign_sales 
SET product_name = 'FTTH' 
WHERE product_name = 'FTTG';
