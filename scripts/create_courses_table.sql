-- ==========================================
-- TEC-B2 Academy: Create Courses Table
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Create the courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    icon TEXT,
    thumbnail TEXT,
    departments JSONB DEFAULT '["Todos"]'::jsonb,
    modules JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'Draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add Row Level Security (RLS) policies
-- Note: Replace with proper Auth later, but for now we'll allow public read/write 
-- since the user filtering will happen in the app. Or if you want stricter rules,
-- we'll rely on the Supabase Anon key for now.

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to SELECT (Read) courses
CREATE POLICY "Enable read access for all users" ON public.courses
    FOR SELECT USING (true);

-- For MVP, allow Insert/Update/Delete to all authenticated users (We'll protect the UI via Clerk Admin Email)
CREATE POLICY "Enable insert for authenticated users only" ON public.courses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON public.courses
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only" ON public.courses
    FOR DELETE USING (true);


-- 3. Initial Mock Data (Translating from coursesData.js)
-- Inserting "Introdução RH: Bem-vindo à TEC-B2"
INSERT INTO public.courses (id, title, description, duration, icon, departments, status, modules)
VALUES (
    '11111111-1111-1111-1111-111111111111', -- Valid dummy UUID
    'Introdução RH: Bem-vindo à TEC-B2',
    'Nossa Empresa, Banco de Horas, Benefícios, Ética e LGPD.',
    '40 min',
    '🏢',
    '["Todos"]'::jsonb,
    'Published',
    '[
        {
            "type": "carousel",
            "title": "Nossa Empresa e Visão",
            "slides": [
                {
                    "title": "Seja Bem-vindo!",
                    "text": "Somos a Tec-B2, um parceiro autorizado Vivo Empresas. Fazemos parte de uma das maiores empresas de telecomunicações do mundo.\n\nAo entrar em nosso universo, você descobrirá um mundo de soluções e inovações, oferecendo desde opções básicas como mobilidade e banda larga, até soluções robustas de TI e produtividade."
                },
                {
                    "title": "Nosso Propósito Juntos",
                    "text": "Agora que você chegou para somar ao nosso time e fazer parte de um mercado em constante crescimento, a Tec-B2, como parceiro estratégico da Vivo, quer seguir ao seu lado sendo referência em qualidade.\n\nJuntos, queremos fortalecer e crescer, acreditando que as pessoas são o motor do sucesso."
                }
            ]
        },
        {
            "type": "content",
            "title": "Manuais e Termos",
            "content": "Nossa empresa possui termos de ciência que devem ser assinados por todos os colaboradores, os quais abordam o uso adequado de ferramentas e equipamentos, além do Manual do Colaborador. Esses documentos têm como objetivo assegurar que todos estejam cientes das responsabilidades associadas ao uso dos recursos da empresa, das políticas internas e dos procedimentos de segurança."
        }
    ]'::jsonb
);

-- Inserting "Processo de Venda" mock
INSERT INTO public.courses (id, title, description, duration, icon, thumbnail, departments, status, modules)
VALUES (
    '22222222-2222-2222-2222-222222222222', -- Valid dummy UUID
    'Processo de Venda',
    'Treinamento Supremo de Vendas B2B: Atendimento Humanizado, Metodologia SPIN Selling, TIS, Processo de Sondagem e as 8 Etapas do Relacionamento.',
    '45 min',
    '🤝',
    'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=400',
    '["Todos"]'::jsonb,
    'Published',
    '[
        {
            "type": "content",
            "title": "O que é Atendimento Humanizado?",
            "html": true,
            "content": "O <b>atendimento humanizado</b> foca na empatia e na personalização, valorizando o cliente como indivíduo e não apenas como comprador. O objetivo é proporcionar uma experiência completa.<br/><br/>Ele é caracterizado por um diálogo atento e empático, focado em resolver problemas de forma acolhedora. Rompe com o tradicional modelo de telemarketing de roteiros rígidos, promovendo comunicação próxima e genuína."
        }
    ]'::jsonb
);
