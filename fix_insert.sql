-- Rode APENAS este comando no SQL Editor para corrigir o erro de Acesso Negado
CREATE POLICY "Insercao de perfil pelo dono" 
ON public.user_profiles FOR INSERT 
WITH CHECK (requesting_user_id() = user_id);
