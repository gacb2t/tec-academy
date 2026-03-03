-- Script: 26d_update_venda_idx8.sql
-- Atualiza diretamente o módulo Venda no índice 8 (confirmado pelo SELECT anterior).
-- Execute no Supabase SQL Editor.

UPDATE courses
SET modules = jsonb_set(
    modules,
    ARRAY['8'],
    '{
        "title": "Venda",
        "blocks": [
            {
                "_id": "venda_panel_1",
                "type": "text_image_panel",
                "imagePosition": "right",
                "imageSize": "md",
                "imageSrc": "/images/courses/prod_venda.png",
                "imageAlt": "Venda - confiança e valor para o cliente",
                "content": "<h3>🏆 Venda</h3><p>Uma venda bem-sucedida <strong>não se resume ao fechamento do negócio</strong>, mas à construção de confiança e valor para o cliente.</p><ul style=\"margin-top:0.75rem\"><li>O fechamento é a consequência de um processo bem executado — <strong>do ciclo 1 ao 8</strong></li><li>Construa relações de <strong>confiança duradoura</strong>, não apenas transações pontuais</li><li>Entregue <strong>valor real</strong> — o cliente que percebe valor retorna e indica</li><li>Uma venda bem construída gera um <strong>comprador de longo prazo</strong></li></ul>"
            }
        ]
    }'::jsonb
)
WHERE title ILIKE '%Planejamento%Tempo%Produtividade%';
