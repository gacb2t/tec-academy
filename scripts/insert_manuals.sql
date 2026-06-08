-- Script para inserir os 3 cursos de Manuais diretamente pelo SQL Editor do Supabase

INSERT INTO public.courses (id, title, description, icon, departments, status, category, estimated_duration, modules)
VALUES 
(
    gen_random_uuid(),
    'MANUAL - SERVIÇOS AVANÇADOS DADOS',
    'Acesso rápido ao manual de Serviços Avançados Dados.',
    '📘',
    ARRAY['Todos'],
    'Published',
    'Geral',
    10,
    '[
        {
            "title": "SERVIÇOS AVANÇADOS DADOS",
            "blocks": [
                {
                    "type": "content",
                    "html": true,
                    "content": "<div style=\"position: relative; width: 100%; height: 0; padding-top: 56.2500%; padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden; border-radius: 8px; will-change: transform;\"><iframe loading=\"lazy\" style=\"position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;\" src=\"https://www.canva.com/design/DAHJjxD52qA/nxen8DPvqy21caqBuQu5Tw/view?embed\" allowfullscreen=\"allowfullscreen\" allow=\"fullscreen\"></iframe></div>"
                }
            ]
        }
    ]'::jsonb
),
(
    gen_random_uuid(),
    'MANUAL - LICENÇAS DIGITAIS',
    'Acesso rápido ao manual de Licenças Digitais.',
    '📘',
    ARRAY['Todos'],
    'Published',
    'Geral',
    10,
    '[
        {
            "title": "LICENÇAS DIGITAIS",
            "blocks": [
                {
                    "type": "content",
                    "html": true,
                    "content": "<div style=\"position: relative; width: 100%; height: 0; padding-top: 56.2500%; padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden; border-radius: 8px; will-change: transform;\"><iframe loading=\"lazy\" style=\"position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;\" src=\"https://www.canva.com/design/DAHJeNnWg88/9f-azxxxuo85jZeiefDliw/view?embed\" allowfullscreen=\"allowfullscreen\" allow=\"fullscreen\"></iframe></div>"
                }
            ]
        }
    ]'::jsonb
),
(
    gen_random_uuid(),
    'MANUAL - 0800 E 0300',
    'Acesso rápido ao manual de 0800 e 0300.',
    '📘',
    ARRAY['Todos'],
    'Published',
    'Geral',
    10,
    '[
        {
            "title": "0800 E 0300",
            "blocks": [
                {
                    "type": "content",
                    "html": true,
                    "content": "<div style=\"position: relative; width: 100%; height: 0; padding-top: 56.2500%; padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden; border-radius: 8px; will-change: transform;\"><iframe loading=\"lazy\" style=\"position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;\" src=\"https://www.canva.com/design/DAHJwIbkyro/Zmyes03e87nZe130QxNjIw/view?embed\" allowfullscreen=\"allowfullscreen\" allow=\"fullscreen\"></iframe></div>"
                }
            ]
        }
    ]'::jsonb
);
