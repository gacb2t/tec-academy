-- 1. Adicionar novas colunas na tabela de auditorias
ALTER TABLE public.audits 
ADD COLUMN IF NOT EXISTS collaborator_id TEXT,
ADD COLUMN IF NOT EXISTS collaborator_name TEXT,
ADD COLUMN IF NOT EXISTS call_date DATE,
ADD COLUMN IF NOT EXISTS client_phone TEXT,
ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- 2. Criar o Bucket 'audit_audios' no Supabase Storage
INSERT INTO storage.buckets (id, name, public) 
VALUES ('audit_audios', 'audit_audios', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Configurar Políticas de Segurança (RLS) para o Storage (Permitir tudo para simplificar no ambiente corporativo)
CREATE POLICY "Permitir upload para audit_audios" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'audit_audios');

CREATE POLICY "Permitir leitura publica de audit_audios" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'audit_audios');

CREATE POLICY "Permitir update em audit_audios" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'audit_audios');

CREATE POLICY "Permitir delete em audit_audios" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'audit_audios');

-- 4. Forçar o reload do schema para a API
NOTIFY pgrst, 'reload schema';
