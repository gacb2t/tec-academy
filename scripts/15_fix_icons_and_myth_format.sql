-- Script: 15_fix_icons_and_myth_format.sql
-- 1. Corrige ícones ausentes nos cursos Sistemas TEC-B2 e Planejamento
-- 2. Converte os 3 blocos myth_truth em 1 bloco swipecards (padrão dos outros cursos)
-- Execute no Supabase SQL Editor

-- ============================================================
-- FIX 1: Ícones (campo 'icon' estava vazio, o emoji estava no 'thumbnail')
-- ============================================================
UPDATE courses SET icon = '💻' WHERE id = '55555555-5555-5555-5555-555555555555';
UPDATE courses SET icon = '⏳' WHERE id = '66666666-6666-6666-6666-666666666666';


-- ============================================================
-- FIX 2: Sistemas TEC-B2 — Substituir os 3 myth_truth individuais
--         por 1 bloco swipecards (padrão "Deslize" dos outros cursos)
-- Estrutura atual: [carousel, swipecards, myth1, myth2, myth3, drag_drop, scenario]
-- Estrutura nova:  [carousel, swipecards, swipecards_mito, drag_drop, scenario]
-- ============================================================
UPDATE courses
SET modules = '[
  {
    "type": "carousel",
    "title": "O Ecossistema de Ferramentas",
    "slides": [
      { "title": "Simpledesk", "text": "Nossa ferramenta oficial para comunicação com nossos clientes. Com ela, centralizamos todas as conversas do WhatsApp em uma única plataforma, facilitando o dia a dia. É de uso exclusivo para relacionamento com clientes!" },
      { "title": "Teams", "text": "Ferramenta oficial de comunicação interna. Conecta colaboradores, celebra conquistas e compartilha conhecimento. Uso restrito ao horário de expediente." },
      { "title": "Microsoft 365", "text": "Acesso ao e-mail corporativo, Excel, Word e diversas outras ferramentas essenciais. Segurança e foco: nunca compartilhe sua senha!" },
      { "title": "TIS CRM", "text": "Nosso sistema de gestão exclusivo. Gerenciamento de clientes, contratos e chamados de forma integrada. O funil de vendas deve estar sempre atualizado aqui!" },
      { "title": "Smart Vendas & Cockpit", "text": "Ferramenta Vivo para consultar viabilidade de fibra (por CNPJ/CPF). Em algumas situações, permite consulta manual via Cockpit (atenção especial a cidades com CEP único!)." },
      { "title": "Simplifique (Estruturante)", "text": "Permite consultar clientes, identificar oportunidades, verificar faturas em aberto e calcular multas. Indispensável para visualizar ofertas de renovação (margens e planos). Sem ele, não há negociação!" },
      { "title": "Portal (FARM)", "text": "Consultar informações de clientes para analisar a planta, faturamentos, perfil contratado e consumo. Auxilia especialmente os consultores da equipe FARM." }
    ]
  },
  {
    "type": "swipecards",
    "title": "Boas Práticas: Qual sistema usar?",
    "instruction": "Deslize para a Esquerda (❌ Falso) ou para a Direita (✅ Verdadeiro). Qual é a ferramenta certa para cada situação?",
    "cards": [
      { "id": "sc_sist_1", "text": "Para falar de forma descontraída com um cliente da Vivo, devo adicioná-lo no meu WhatsApp particular e não no Simpledesk.", "correctIsRight": false, "explanation": "Falso! Toda comunicação externa com o cliente deve ser feita via Simpledesk (para segurança e histórico centralizado)." },
      { "id": "sc_sist_2", "text": "Para conversar com o setor de Qualidade Interna e Analistas da TEC-B2, devo chamá-los no Microsoft Teams.", "correctIsRight": true, "explanation": "Verdadeiro! O Teams é a nossa via oficial para comunicação interna diária." },
      { "id": "sc_sist_3", "text": "O TIS CRM é onde atualizamos as etapas do funil de relacionamento e os chamados abertos da nossa carteira.", "correctIsRight": true, "explanation": "Perfeito! O TIS consolida o relacionamento diário do vendedor com os clientes, garantindo que o pipeline fique atualizado." },
      { "id": "sc_sist_4", "text": "Senhas do ecossistema Microsoft podem ser compartilhadas com atendentes temporários.", "correctIsRight": false, "explanation": "Jamais! A instrução é clara: segurança em primeiro lugar, nunca compartilhe credenciais." }
    ]
  },
  {
    "type": "swipecards",
    "title": "Mito ou Verdade: Identificação Técnica",
    "instruction": "Deslize para a direita (✅ Verdadeiro) ou esquerda (❌ Mito/Falso) nas afirmações sobre os sistemas da TEC-B2.",
    "cards": [
      { "id": "mv_sist_1", "text": "A ferramenta Smart Vendas é utilizada unicamente para faturamento, não tendo utilidade de pesquisa prévia.", "correctIsRight": false, "explanation": "Mito! O Smart Vendas é focado exatamente em consultar VIABILIDADE de fibra e de produtos Vivo via CPF/CNPJ." },
      { "id": "mv_sist_2", "text": "Se no Smart Vendas der \"Sem Viabilidade\" para um CEP único, não posso fazer mais nada e perco a venda.", "correctIsRight": false, "explanation": "Falso! Você pode realizar a consulta manual pelo Cockpit e abrir um chamado de análise de cadastro para tentar aprovar a viabilidade." },
      { "id": "mv_sist_3", "text": "É possível realizar uma negociação de renovação (margens e planos) sem consultar a ferramenta Simplifique.", "correctIsRight": false, "explanation": "Mito gigantesco! O Simplifique é indispensável e estruturante: sem ele, não tem como calcular multas nem ver ofertas e margens para bater o martelo." }
    ]
  },
  {
    "type": "drag_drop_sort",
    "title": "Organizando a Ferramenta Pelo Objetivo",
    "instruction": "Combine a ferramenta exata com o seu propósito de uso na rotina TEC-B2:",
    "steps": [
      "WhatsApp c/ Cliente: Simpledesk",
      "Chat Interno & Notícias: Microsoft Teams",
      "Visualizar Funil & Contratos: TIS CRM",
      "Consulta Viabilidade de Fibra: Smart Vendas (e Cockpit para manuais)"
    ]
  },
  {
    "type": "scenario",
    "title": "Desafio FARM: Analisando o Cliente",
    "context": "A consultora Maria da equipe FARM assumiu uma carteira de 150 clientes recentemente. Um deles, a Padaria Pão Quente, está reclamando do alto valor no faturamento dos dados móveis devido a estouro de pacote todos os meses, e ameaçou ir para a concorrência.",
    "question": "Qual é a jogada de Mestre utilizando os Sistemas da TEC-B2 para virar o jogo?",
    "options": [
      { "text": "A) Atualizar os dados do TIS e aguardar que ele entre em contato pedindo o cancelamento de fato para depois ofertar desconto.", "isCorrect": false, "feedback": "Incorreto. Ações passivas na retenção não ajudam e a concorrência agirá primeiro." },
      { "text": "B) Abrir o Portal para analisar o relatório completo de consumo/perfil e, munida dessas informações, abrir o Simplifique para validar cálculo de multa e encaixar um Upgrade de pacote que abaixe o custo do GB e prenda ele na Vivo.", "isCorrect": true, "feedback": "Fantástico! Usou o Portal (FARM) para mapear consumo + Simplifique (Renovação) para achar margem e blindar o cliente com um Upgrade Win-Win." },
      { "text": "C) Consultar o Cockpit para tentar aprovar uma viabilidade de Fibra que resolva o uso do pacote de dados da rua.", "isCorrect": false, "feedback": "Incorreto. Fibra é fixa; dados móveis de rua não são convertidos para Fibra em um cenário de mobilidade." }
    ]
  }
]'::jsonb
WHERE id = '55555555-5555-5555-5555-555555555555';


-- ============================================================
-- VERIFICAR
-- ============================================================
SELECT id, title, icon, jsonb_array_length(modules) AS total_modules
FROM courses
WHERE id IN (
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666'
);
