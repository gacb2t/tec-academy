-- Script: 14_fix_broken_courses_modules.sql
-- Corrige os cursos "Sistemas TEC-B2" e "Planejamento de Tempo e Produtividade"
-- cujo campo `modules` continha apenas um número inteiro.
-- Execute no Supabase SQL Editor

-- ============================================================
-- CURSO 1: Sistemas TEC-B2
-- ID: 55555555-5555-5555-5555-555555555555
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
    "type": "myth_truth",
    "question": "A ferramenta Smart Vendas é utilizada unicamente para faturamento, não tendo utilidade de pesquisa prévia.",
    "defaultIsTruth": false,
    "defaultExplanation": "Mito! O Smart Vendas é focado exatamente em consultar VIABILIDADE de fibra e de produtos Vivo via CPF/CNPJ."
  },
  {
    "type": "myth_truth",
    "question": "Se no Smart Vendas der \"Sem Viabilidade\" para um CEP único, não posso fazer mais nada e perco a venda.",
    "defaultIsTruth": false,
    "defaultExplanation": "Falso! Você pode realizar a consulta manual pelo Cockpit e abrir um chamado de análise de cadastro para tentar aprovar a viabilidade."
  },
  {
    "type": "myth_truth",
    "question": "É possível realizar uma negociação de renovação (margens e planos) sem consultar a ferramenta Simplifique.",
    "defaultIsTruth": false,
    "defaultExplanation": "Mito gigantesco! O Simplifique é indispensável e estruturante: sem ele, não tem como calcular multas nem ver ofertas e margens para bater o martelo."
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
-- CURSO 2: Planejamento de Tempo e Produtividade
-- ID: 66666666-6666-6666-6666-666666666666
-- ============================================================
UPDATE courses
SET modules = '[
  {
    "type": "image_content",
    "title": "A Pirâmide de Produtividade",
    "imageSrc": "/images/courses/prod_slide_1.png",
    "content": "<p><strong>Dicas para planejar seu tempo</strong><br>O sucesso das suas vendas começa na base da nossa pirâmide: <strong>O Planejamento</strong>.</p>"
  },
  {
    "type": "image_content",
    "title": "1. Funil de Vendas e 2. Retornos",
    "imageSrc": "/images/courses/prod_slide_2.png",
    "content": "<p><strong>1 FUNIL DE VENDAS</strong><br>Comece o seu dia analisando o funil de vendas, organize seus retornos e avalie sua capacidade de fechamento. Você precisa entender a capacidade de produção para o dia. Gerar previsibilidade lhe ajudará a atingir os indicadores. Participe das negociações mais importantes.</p><p><strong>2 RETORNOS</strong><br>Agora, vamos organizar seus retornos do dia. Seguir a base de retornos lhe ajudará a manter sua carteira em dia. Este é um ponto importante na sua jornada de gestão: gerenciar os retornos é essencial para gerar oportunidades.</p>"
  },
  {
    "type": "image_content",
    "title": "3. Pedidos e 4. Estratégia",
    "imageSrc": "/images/courses/prod_slide_3.png",
    "content": "<p><strong>3 PEDIDOS</strong><br>Verifique seus pedidos e fique atento aos status AG, ACEITE e SOLUÇÃO CONSULTOR. Trate as demandas e siga para o próximo passo. Gerencie os pedidos reprovados por crédito. Tornar sua produtividade eficiente significa tratar seus pedidos com atenção. Aproveite este momento para debater soluções para cada caso.</p><p><strong>4 ESTRATÉGIA</strong><br>Chegou o momento de planejar seu dia: entender qual perfil de cliente você irá abordar e definir suas metas de prospecção. Sua participação aqui é fundamental para tornar o dia produtivo. Fique atento às oportunidades que sua lista de clientes pode gerar. Garantir que a proposta de trabalho foi executada é um grande trunfo para o sucesso da estratégia.</p>"
  },
  {
    "type": "image_content",
    "title": "Prospecção",
    "imageSrc": "/images/courses/prod_slide_4.png",
    "content": "<p><strong>Prospecção:</strong> Execute suas tarefas com foco e dedicação para alcançar os melhores resultados.</p>"
  },
  {
    "type": "image_content",
    "title": "5. Métricas",
    "imageSrc": "/images/courses/prod_slide_5.png",
    "content": "<p><strong>5 MÉTRICAS</strong><br>Tenha objetivos bem definidos, é importante ter ao menos 5 oportunidades quentes, criadas durante sua jornada, buscando abrir negociações em todos os seus indicadores.</p><p>Tenha metas claras e objetivas de prospecção. Pouco adianta apenas contatar o cliente sem um processo de abordagem bem definido. Entender o perfil do cliente é essencial para planejar seu dia. Devemos iniciar o dia de trabalho com, no mínimo, R$ 2.500,00 (por consultor) no funil, mantendo atenção aos produtos necessários para a composição da meta. Em resumo, os contatos devem gerar oportunidades. Não adianta contatar sem um objetivo claro e definido!</p><p><strong>Seu dia não pode encerrar sem, ao menos, 5 novas negociações. Esse será o ponto de partida para o sucesso dos seus resultados.</strong></p>"
  },
  {
    "type": "image_content",
    "title": "6. Pesquisa e Abordagem",
    "imageSrc": "/images/courses/prod_slide_6.png",
    "content": "<p><strong>6 PESQUISA/ABORDAGEM</strong><br>Uma boa abordagem pode reduzir significativamente o caminho para a conquista. Buscar maneiras humanizadas e demonstrar conhecimento é fundamental para construir uma negociação sólida. Aplique todo o seu conhecimento sobre os produtos e, principalmente, sobre as características do negócio do cliente.</p><p>Certifique-se que o processo de abordagem e pesquisa está sendo executado, entenda se o consultor está utilizando PROMPT de forma adequada e se o mesmo está utilizando e/ou realizando os processos adequadamente.</p><p>O prompt é um excelente recurso para conhecer melhor o seu cliente. Utilize prova social, referências de concorrentes e possíveis soluções. Crie um elo entre as soluções, o atendimento e as necessidades do cliente. Deixe claro o motivo da escolha do produto, seus valores e, principalmente, o quanto ele pode contribuir para o sucesso do negócio.</p><p>Não se esqueça de entender as principais necessidades do cliente e suas maiores dificuldades, trazendo analogias entre nossos produtos e as soluções que podem ser aplicadas.</p>"
  },
  {
    "type": "image_content",
    "title": "Negociações",
    "imageSrc": "/images/courses/prod_slide_7.png",
    "content": "<p><strong>Negociações:</strong> Uma negociação eficaz exige ouvir atentamente, compreender as necessidades do cliente e oferecer soluções que agreguem valor para ambos os lados.</p>"
  },
  {
    "type": "image_content",
    "title": "7. Negociação",
    "imageSrc": "/images/courses/prod_slide_8.png",
    "content": "<p><strong>7 NEGOCIAÇÃO</strong><br>Lembrar que uma boa negociação é aquela que ambos os lados saem feliz, para isso ocorrer é fundamental que os ciclos 1 a 6 tenham sido executados de forma correta, somente desta forma você terá capacidade de construir uma negociação de valor.</p><p>Participe ativamente das negociações e da construção de propostas. Esta é a melhor forma de entender como as negociações estão sendo conduzidas e como seu time está direcionando o processo, estando apto a intervir em casos de negativas ou dificuldades em negociações pontuais.</p><p>Tenha em mente o que caracteriza uma negociação ou um acréscimo de serviço. Negociar é construir soluções. Geralmente, a construção de uma negociação resulta em um ticket médio maior, enquanto adicionar um produto não trará muitos recursos de receita adicional. Por isso, construa suas negociações com cuidado.</p>"
  },
  {
    "type": "image_content",
    "title": "8. Propostas",
    "imageSrc": "/images/courses/prod_slide_9.png",
    "content": "<p><strong>8 PROPOSTAS</strong><br>Aqui iniciamos uma etapa importante: confeccionar a proposta é muito mais do que enviar um orçamento. Este é o momento que definirá o sucesso da sua abordagem. Entender os pontos críticos e as possíveis melhorias é fundamental para uma proposta bem elaborada, gerando maior aceitação por parte do cliente.</p><p>Participe da elaboração e do envio da proposta, certificando-se de que ela atende às necessidades do cliente, possui clareza e está alinhada com a abordagem realizada. Acompanhe a comunicação através do SIMPLES DESK e verifique se está de acordo com as expectativas do cliente.</p><p>Lembre-se de que preço e qualidade nem sempre estão alinhados. A proposta deve agregar valor. É possível encontrar margem em outras categorias de produtos, assim você evita desvalorizar sua renovação, entregando tanto qualidade quanto preço.</p>"
  },
  {
    "type": "image_content",
    "title": "Venda",
    "imageSrc": "/images/courses/prod_slide_10.png",
    "content": "<p><strong>Venda:</strong> Uma venda bem-sucedida não se resume ao fechamento do negócio, mas à construção de confiança e valor para o cliente.</p>"
  },
  {
    "type": "image_content",
    "title": "9. Finalização",
    "imageSrc": "/images/courses/prod_slide_11.png",
    "content": "<p><strong>9 FINALIZAÇÃO</strong><br>Lembrar que uma boa negociação é aquela que ambos os lados saem feliz, para isso ocorrer é fundamental que os ciclos 1 a 6 tenham sido executados de forma correta, somente desta forma você terá capacidade de construir uma negociação de valor.</p><p>Participe ativamente das negociações e da construção de propostas. Esta é a melhor forma de entender como as negociações estão sendo conduzidas e como seu time está direcionando o processo, estando apto a intervir em casos de negativas ou dificuldades em negociações pontuais.</p>"
  },
  {
    "type": "drag_drop_sort",
    "title": "A Ordem da Produtividade Matinal",
    "instruction": "Arraste os itens para colocá-los na ordem ideal de execução no início do seu dia (do Passo 1 ao Passo 5):",
    "steps": [
      "Analisar Funil de Vendas",
      "Organizar Retornos da Carteira",
      "Verificar Status de Pedidos Antigos",
      "Definir Estratégia e Perfil de Abordagem",
      "Buscar Bater as Métricas (5 Oportunidades Quentes)"
    ]
  },
  {
    "type": "scenario",
    "title": "Desafio Prático: A Rotina do Consultor",
    "context": "O consultor João chegou na empresa às 08:30. Ele imediatamente pegou o telefone e começou a ligar para clientes novos aleatórios da sua lista, sem olhar o TIS CRM, esperando \"dar sorte\" para bater os R$ 2.500 do dia.",
    "question": "Segundo a nossa Pirâmide e Passos de Produtividade, qual foi o erro de João e o que ele deveria ter feito primeiro?",
    "options": [
      { "text": "A) Ele errou em ligar para clientes novos. Ele deveria ligar apenas para os mesmos clientes que compraram no mês passado.", "isCorrect": false, "feedback": "Incorreto. A prospecção de novos clientes é importante." },
      { "text": "B) João não errou. Ligar o mais rápido possível garante que ele fale com mais pessoas.", "isCorrect": false, "feedback": "Incorreto. Agir sem planejamento gera esforço sem resultado previsível." },
      { "text": "C) Ele pulou a base da Pirâmide (Planejamento). Antes de prospectar, ele deveria ter olhado o Funil de Vendas para ver retornos e pedidos pendentes, e então traçar uma estratégia e os R$ 2.500 de meta.", "isCorrect": true, "feedback": "Exato! A Base da Pirâmide é o Planejamento. Olhar o funil, retornos e organizar a estratégia antes da ação é a chave do sucesso B2B." }
    ]
  }
]'::jsonb
WHERE id = '66666666-6666-6666-6666-666666666666';


-- ============================================================
-- VERIFICAR: confirmar que foram atualizados
-- ============================================================
SELECT id, title, jsonb_array_length(modules) AS total_modules
FROM courses
WHERE id IN (
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666'
);
