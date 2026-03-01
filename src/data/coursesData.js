export const coursesData = [
    {
        id: "intro-recursos-humanos",
        title: "Introdução RH: Bem-vindo à TEC-B2",
        description: "Nossa Empresa, Banco de Horas, Benefícios, Ética e LGPD.",
        duration: "40 min",
        icon: "🏢",
        departments: ["Todos"], // Libera para todos
        modules: [
            {
                type: 'carousel',
                title: 'Nossa Empresa e Visão',
                slides: [
                    {
                        title: 'Seja Bem-vindo!',
                        text: 'Somos a Tec-B2, um parceiro autorizado Vivo Empresas. Fazemos parte de uma das maiores empresas de telecomunicações do mundo.\n\nAo entrar em nosso universo, você descobrirá um mundo de soluções e inovações, oferecendo desde opções básicas como mobilidade e banda larga, até soluções robustas de TI e produtividade.'
                    },
                    {
                        title: 'Nosso Propósito Juntos',
                        text: 'Agora que você chegou para somar ao nosso time e fazer parte de um mercado em constante crescimento, a Tec-B2, como parceiro estratégico da Vivo, quer seguir ao seu lado sendo referência em qualidade.\n\nJuntos, queremos fortalecer e crescer, acreditando que as pessoas são o motor do sucesso.'
                    }
                ]
            },
            {
                type: 'content',
                title: 'Manuais e Termos',
                content: 'Nossa empresa possui termos de ciência que devem ser assinados por todos os colaboradores, os quais abordam o uso adequado de ferramentas e equipamentos, além do Manual do Colaborador. Esses documentos têm como objetivo assegurar que todos estejam cientes das responsabilidades associadas ao uso dos recursos da empresa, das políticas internas e dos procedimentos de segurança.'
            },
            {
                type: 'content',
                title: 'Identidade Visual e Canais',
                html: true,
                content: 'Nossa Identidade Visual reflete nossa marca e presença digital. Acompanhe nossos canais oficiais para ficar por dentro das novidades:\n\n<div style="display:flex; flex-direction:column; align-items:center; gap: 1rem; margin-top:2rem;"><div>🌐 <a href="http://TECB2.COM.BR" target="_blank" style="color:var(--primary-color);text-decoration:none;font-weight:bold;">TECB2.COM.BR</a></div><div>📸 <a href="https://instagram.com/TECB2B" target="_blank" style="color:var(--primary-color);text-decoration:none;font-weight:bold;">@TECB2B</a></div></div>'
            },
            {
                type: 'accordion',
                title: 'Regras de Ponto e Pagamentos',
                instruction: 'Clique nos itens para ler as regras fundamentais de ausências e recebimentos.',
                items: [
                    { icon: '⏳', title: 'Banco de Horas', content: 'Em casos de horas extras ou de saldo de horas deliberado pela empresa, os mesmos serão computados no banco de horas.' },
                    { icon: '📄', title: 'Falta Justificada', content: 'Em casos de falta justificada (conforme a lei de abono), o documento comprobatório deverá ser enviado ao RH em até 48 horas.' },
                    { icon: '⚠️', title: 'Falta Não Justificada', content: 'Ocorre quando um funcionário se ausenta sem apresentar motivo válido ou atestado. Gera descontos de: Vale Transporte, Vale Refeição, DSR e reflexos nas Férias.' },
                    { icon: '💰', title: 'Pagamento de Salário', content: 'Ocorre sempre no 5º DIA ÚTIL. A conta bancária da empresa é vinculada ao Itaú.' },
                    { icon: '🍽️', title: 'Benefícios (VR/VT)', content: 'Os créditos de Vale Refeição (Alelo) e Vale Transporte são depositados no DIA 10.' },
                    { icon: '🏆', title: 'Premiações', content: 'A apuração e pagamento das Premiações também ocorrem no DIA 10.' },
                    { icon: '💻', title: 'Equipamentos', content: 'É responsabilidade do colaborador zelar pelo cuidado e uso adequado dos equipamentos fornecidos.' }
                ]
            },
            {
                type: 'timeline',
                title: 'Cartão Ponto: A Jornada de Trabalho',
                instruction: 'Os quatro registros do cartão-ponto são fundamentais para garantir o controle eficiente da jornada (CLT). Acompanhe a ordem diária:',
                steps: [
                    {
                        title: '1. Entrada (Início da Jornada)',
                        description: 'Marca o início exato do seu expediente.',
                        imageUrl: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=400&q=80' // Office entry/morning
                    },
                    {
                        title: '2. Saída para Intervalo',
                        description: 'Indica o início da pausa para o seu almoço ou descanso.',
                        imageUrl: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&q=80' // Lunch break / relax
                    },
                    {
                        title: '3. Retorno do Intervalo',
                        description: 'Marca o fim do intervalo e o seu retorno efetivo ao trabalho.',
                        imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&q=80' // Back to desk
                    },
                    {
                        title: '4. Saída (Término da Jornada)',
                        description: 'Registra o fim do seu expediente diário e encerra as horas do dia.',
                        imageUrl: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=400&q=80' // Leaving office / sunset
                    }
                ]
            },
            {
                type: 'content',
                title: 'Ferramentas de Uso Diário',
                content: 'Em nosso dia a dia organizatório, você lidará diretamente com o Microsoft Teams, que é nossa plataforma mandatória para agilizar a comunicação diária, permitindo também o compartilhamento de informativos, alinhamentos e o registro de Feedbacks.\n\nAlém disso, você utilizará o CRM TIS, que é o sistema próprio da TEC-B2 (para o qual você terá um treinamento exclusivo e detalhado em breve, pois estamos desenvolvendo uma nova versão otimizada).\n\nPara o atendimento direto aos clientes e conversas através dos nossos números oficiais, utilizamos a plataforma SimplesDesk.'
            },
            {
                type: 'webhook_form',
                title: 'Solicitação de E-mail Corporativo',
                instruction: 'Preencha os dados abaixo. Eles serão enviados diretamente para nossa equipe de tecnologia para a criação da sua conta oficial.',
                webhookUrl: 'https://hook.us2.make.com/e7e0otybmp16gv7wnklulwuav583w1h1'
            },
            {
                type: 'content',
                title: 'O Ambiente de Trabalho (Responsabilidade)',
                content: 'A Responsabilidade Coletiva trata da preservação do ambiente e patrimônio da empresa. Zelar pelos objetos, equipamentos e imóveis evita prejuízos e reflete em benefícios para nós mesmos. Porém, existem proibições claras sobre atitudes nas estações de trabalho e uso de celulares.'
            },
            {
                type: 'scenario',
                title: 'Simulação - Atitude e Celular',
                context: 'No meio do seu expediente, o seu projeto atual sofreu um atraso brusco na comunicação do cliente. Você está ocioso há 30 min aguardando resposta. Seu colega da mesa ao lado o convida para ver um vídeo engraçado no celular rapidamente.',
                question: 'Qual atitude você deve tomar?',
                options: [
                    { text: 'Concordar em ver o vídeo rapidamente, contanto que ambos mantenham o volume baixo para não perturbar a estação de trabalho.', isCorrect: false, feedback: 'Errado! O uso do celular e distrações nas estações de trabalho são proibidos, independentemente do volume.' },
                    { text: 'Sair da estação de trabalho e ir para o refeitório com o colega para fazer um lanche, retornando assim que o cliente responder o e-mail.', isCorrect: false, feedback: 'Incorreto. Abandonar a estação de trabalho fora do horário de intervalo agrava o problema.' },
                    { text: 'Excepcionalmente, usar o computador da empresa para ler notícias até o cliente responder, já que o uso do celular na baia é irregular.', isCorrect: false, feedback: 'Falso. O computador da empresa é ferramenta exclusiva de trabalho e não deve ser usado para entretenimento.' },
                    { text: 'Declinar gentilmente o convite e aproveitar a ociosidade do gargalo para adiantar ou revisar outras demandas via Teams.', isCorrect: true, feedback: 'Perfeito. Essa atitude reflete responsabilidade coletiva e priorização do uso correto dos equipamentos.' },
                ]
            },
            {
                type: 'avatar_balloons',
                title: 'Nossos 10 Princípios da Ética',
                instruction: 'Avance os cards para interagir com a Mentoria Virtual e aprender sobre Nossos Princípios de Ética em detalhes.',
                avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
                balloons: [
                    { icon: '🤝', title: 'Ser Honesto e Transparente', content: 'Falar a verdade e agir com clareza em todas as situações.' },
                    { icon: '✔️', title: 'Assumir Responsabilidades', content: 'Reconhecer os próprios erros e aprender com eles, buscando sempre melhorar.' },
                    { icon: '👥', title: 'Respeitar os Outros', content: 'Tratar todos com dignidade, independência de posição, raça, gênero ou crenças.' },
                    { icon: '⚖️', title: 'Agir com Justiça', content: 'Ser imparcial e justo nas decisões, sem favorecimento ou discriminação.' },
                    { icon: '🔒', title: 'Confidencialidade', content: 'Manter em sigilo as informações pessoais e profissionais, respeitando a privacidade e segurança dos dados.' },
                    { icon: '🛡️', title: 'Demonstrar Lealdade', content: 'Cumprir com os deveres e compromissos assumidos com a organização, clientes e colegas.' },
                    { icon: '🚫', title: 'Evitar Conflitos', content: 'Não se envolver em situações onde interesses pessoais possam comprometer decisões profissionais.' },
                    { icon: '🌟', title: 'Promover Bem Comum', content: 'Agir para o benefício coletivo e tomar decisões que tragam impactos positivos.' },
                    { icon: '📜', title: 'Respeitar as Leis', content: 'Seguir as normas estabelecidas e cumprir todas as leis aplicáveis ao setor e à sociedade.' },
                    { icon: '🚀', title: 'Desenvolvimento', content: 'Manter-se atualizado e capacitado para agir de forma ética e competente em um ambiente em constante mudança.' }
                ]
            },
            {
                type: 'video',
                title: 'Reflexão Importante: Ética',
                description: 'Assista ao vídeo do filósofo Mario Sergio Cortella sobre Ética e Integridade (Obrigatório).',
                videoId: 'SOY2BIapESA',
                requireDelay: 180
            },
            {
                type: 'carousel',
                title: 'Dicas Importantes & LGPD',
                slides: [
                    {
                        title: 'Pontualidade e Proatividade',
                        text: '1. Cumprir horários demonstra responsabilidade e respeito pelos colegas e pela organização. Planejar-se antecipadamente evita atrasos e imprevistos.\n\n2. Antecipar-se às necessidades da equipe, sugerindo soluções e melhorias mostra comprometimento e fortalece a confiança da equipe.'
                    },
                    {
                        title: 'Segurança e LGPD',
                        text: '3. A LGPD estabelece diretrizes rigorosas para coletar, armazenar e tratar dados. Todos têm um papel essencial. Evite compartilhar informações sensíveis em ambientes inseguros.\n\n4. Sigilo e Discrição: Manter a confidencialidade de informações pessoais e profissionais garante a confiança. Não discutir assuntos do trabalho em público.'
                    },
                    {
                        title: 'Postura e Ferramentas',
                        text: '5. Autocontrole: Saber gerenciar emoções, evitar impulsividade e manter a calma.\n\n6. Contatos: Não fornecer contatos pessoais (celular/whatsapp) a clientes ou times fora do círculo necessário para preservar sua privacidade.\n\n7. Comunicação: Uso EXCLUSIVO pelo Microsoft Teams garante segurança. Não crie grupos de WhatsApp para o trabalho!'
                    }
                ]
            },
            {
                type: 'swipecards',
                title: 'Mito ou Verdade? (Deslize)',
                instruction: 'Arraste as cartas para a ESQUERDA se for um Mito/Falso, ou para a DIREITA se for Verdade/Correto.',
                cards: [
                    { text: 'A comunicação de trabalho deve ser concentrada no WhatsApp porque é mais rápido.', isCorrect: false },
                    { text: 'Tratar dados é uma opção de cada departamento, o Microsoft Teams não é obrigatório.', isCorrect: false },
                    { text: 'Nunca fornecer telefones pessoais, zelar pelas senhas e usar o Teams é regra.', isCorrect: true },
                    { text: 'Se um colega me pedir a senha para resolver uma pendência urgente, devo passar.', isCorrect: false },
                    { text: 'O Vale Refeição (VR) e Vale Transporte (VT) são depositados sempre no dia 10.', isCorrect: true }
                ]
            },
            {
                type: 'open_question',
                title: 'Desafio Descritivo (Parte 1: O Fato)',
                context: 'Imagine o seguinte cenário na TEC-B2:\nVocê está almoçando em um restaurante próximo à empresa, cheio de clientes e outras pessoas.\n\nDe repente, você ouve dois colegas de outro setor discutindo abertamente em voz alta sobre os dados salariais e de benefícios de um colaborador específico recém-contratado.',
                question: 'Considerando as regras de LGPD e Confidencialidade, qual o grande risco que esses colegas estão trazendo para a imagem da empresa e a privacidade do funcionário neste exato momento?'
            },
            {
                type: 'open_question',
                title: 'Desafio Descritivo (Parte 2: A Atitude)',
                context: 'Ainda no mesmo cenário do restaurante, você percebe que um desses dois colegas tem o celular aberto, em cima da mesa, mostrando exatamente um trecho do sistema interno que eles esqueceram de fechar.',
                question: 'Sendo um colaborador ético, como você lidaria ativamente com essa situação? Descreva qual seria a sua atitude ali na hora ou como você levaria isso para a liderança deles.'
            }
        ]
    },
    {
        id: "onboarding-rh",
        title: "Onboarding Especialista RH",
        description: "Processos internos, folha e gestão de benefícios da TEC-B2.",
        duration: "20 min",
        icon: "👥",
        departments: ["RH"], // Apenas para quem logar como RH
        modules: [
            {
                type: 'content',
                title: 'Gestão de Benefícios',
                content: 'Todos os benefícios devem ser solicitados via sistema centralizado até o dia 15 de cada mês.'
            },
            {
                type: 'quiz',
                question: 'Até que dia os benefícios devem ser solicitados?',
                options: [
                    { text: 'Dia 5', isCorrect: false },
                    { text: 'Dia 15', isCorrect: true },
                    { text: 'Dia 20', isCorrect: false },
                ]
            }
        ]
    },
    {
        id: 2,
        title: 'Indicadores',
        description: 'Domine a métrica R$ FRESH, conheça as Torres de Venda da Vivo (Móvel, FTTH, Avançada, etc) e a Lógica de Atendimento B2B.',
        duration: '15 min',
        icon: '📈',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400',
        departments: ['Todos'], // Aberto para todos conforme solicitado
        modules: [
            {
                type: 'content',
                title: 'Introdução: A Bússola do Vendedor',
                content: 'Os indicadores para um vendedor são ferramentas essenciais para medir o desempenho e auxiliar na melhoria contínua das vendas. Eles oferecem informações precisas sobre diferentes aspectos da atuação e ajudam a tomar decisões informadas para atingir suas metas financeiras e premiações.'
            },
            {
                type: 'accordion',
                title: 'As 8 Finalidades dos Indicadores',
                instruction: 'Acesse cada finalidade para compreender a importância do monitoramento.',
                items: [
                    { title: 'Avaliar Desempenho', content: 'Mede como o vendedor atinge metas de vendas, captação de clientes, valor total e taxa de conversão.' },
                    { title: 'Padrões e Tendências', content: 'Identifica produtos mais vendidos, melhores estratégias e períodos mais produtivos.' },
                    { title: 'Melhorar a Performance', content: 'Otimiza tempo e abordagem acompanhando tempo de fechamento e taxas de follow-up.' },
                    { title: 'Foco nas Metas', content: 'Garante que as ações diárias estejam focadas nas metas de faturamento e leads.' },
                    { title: 'Áreas de Melhoria', content: 'Aponta o que deve melhorar quando algo não atinge a expectativa.' },
                    { title: 'Crescimento Profissional', content: 'O aumento do ticket médio ajuda a reconhecer virtudes e a indicar necessidade de treinamentos.' },
                    { title: 'Decisões Estratégicas', content: 'Baseia as mudanças e escolhas dos vendedores e gestores em fatos e dados concretos.' },
                    { title: 'Motivação', content: 'Acompanhar seus próprios resultados motiva e é base para o sistema de remuneração e prêmios.' }
                ]
            },
            {
                type: 'content',
                title: 'O Gatilho da Premiação: R$ FRESH',
                html: true,
                content: 'O pilar do nosso negócio é a R$ FRESH (Novas Receitas), com um parâmetro de R$ 1.800,00. Este indicador é o gatilho da sua política de premiação; em resumo, ele é o ponto de partida para você faturar. No entanto, realizar receita sem o cumprimento dos indicadores pode se transformar em um processo sem rentabilização, pois, assim como o seu modelo de premiação, a TEC-B2 também necessita entregar torres de produtos para gerar rentabilidade.<br/><br/>Neste indicador, as vendas de novos produtos nas torres são indispensáveis. Portanto, fique atento às torres necessárias para o cumprimento da R$ FRESH e esteja alinhado com seu gestor para manter sua premiação com as melhores porcentagens.<br/><br/>Nem todos os processos realizados com os clientes geram R$ FRESH. Um exemplo disso é a renovação, que, apesar de ser um indicador, não conta como R$ FRESH, mas gera oportunidades para captar novas receitas.<br/><br/>Dessa forma, é importante que você fique atento às oportunidades e à R$ FRESH gerada. Veja nos próximos slides as torres e tipos de clientes que geram R$ FRESH:'
            },
            {
                type: 'carousel',
                title: 'As Torres de Venda (Parte 1)',
                slides: [
                    { title: '📱 ALTA MÓVEL', text: 'Movimento no incremento e/ou venda de novas linhas móveis, sempre que a venda ocorrer nas modalidades de NOVO, INCREMENTO e PORTABILIDADE, seguindo as premissas de Segmento e DDD. A linha irá rentabilizar como R$ FRESH e Pontuação. Acompanhe este indicador, pois ele é fundamental no seu simulador de premiação. Entregar este indicador lhe trará rentabilização, aumentará seu parque móvel e proporcionará maior rentabilização no médio e longo prazo!<br/><br/><b>TORRE:</b> MÓVEL<br/><b>CLIENTE:</b> NOVO, INCREMENTO, PORTABILIDADE<br/><b>SEGMENTO:</b> PME (Pequenas e Médias Empresas)<br/><b>DDD:</b> 51, 53, 54, 55<br/><b>TCM (Ticket Central Médio/Ticket Médio) PRODUTO:</b> R$ 52,50<br/><b>MELHOR PERFIL:</b> 1 a 2 até ACIMA DE 500 COLABORADORES<br/><br/><i>*CLIENTE QUE SÓ POSSUI BÁSICA É OPORTUNIDADE EXTRA</i>' },
                    { title: '🌐 FTTH', text: 'A "menina dos olhos" da VIVO nos últimos 5 anos foi o investimento em tecnologia de fibra (Fiber To The Home - Fibra até a empresa). O que possibilitou a ampliação da viabilidade e se tornou uma fonte de rentabilização para vendedores e parceiros. Este indicador é peça-chave na sua política de premiação e deve receber um cuidado especial. Não trabalhe com o limite da meta, pois poderá ocorrer desistências ou inviabilidades. Dessa forma, você não comprometerá seu mês.<br/><br/><b>TORRE:</b> FTTH<br/><b>CLIENTE:</b> NOVO, INCREMENTO<br/><b>SEGMENTO:</b> PME<br/><b>DDD:</b> 51, 53, 54, 55<br/><b>TCM PRODUTO:</b> R$ 91,50<br/><b>MELHOR PERFIL:</b> 1 a 2 até ACIMA DE 500 COLABORADORES<br/><br/><i>*CLIENTE QUE SÓ POSSUI MÓVEL É OPORTUNIDADE EXTRA</i>' },
                    { title: '🗣️ VVN (Voz na Nuvem)', text: 'Uma solução revolucionária que não depende de barreiras estruturais e está disponível em mais de 75% do território gaúcho. Além de ser inovadora, a solução é um grande aliado para o seu faturamento. Com modulações e descontos por volume, o produto possibilita, em uma única negociação, alcançar sua meta e rentabilizar clientes que não possuem oportunidade de venda de Mobilidade e FTTH.<br/><br/><b>TORRE:</b> VVN<br/><b>CLIENTE:</b> NOVO, INCREMENTO, PORTABILIDADE<br/><b>SEGMENTO:</b> PME<br/><b>DDD:</b> 51, 53, 54, 55<br/><b>TCM PRODUTO:</b> R$ 47,80<br/><b>TURBINE:</b> GRAVAÇÃO, URA (Unidade de Resposta Audível), MÓDULO TEAMS<br/><b>MELHOR PERFIL:</b> 1 a 2 até ACIMA DE 500 COLABORADORES' }
                ]
            },
            {
                type: 'carousel',
                title: 'As Torres de Venda (Parte 2)',
                slides: [
                    { title: '💻 DIGITAL', text: 'Uma das torres com o maior número de possibilidades. Apesar de um ticket médio baixo, as soluções da MICROSOFT, GOOGLE, MDM (Mobile Device Management) e outras são produtos eficientes para a composição da R$ FRESH. Sem contar a possibilidade de encontrar projetos com alto valor agregado, abrindo portas para grandes negociações. Descubra o que seu cliente realmente utiliza!<br/><br/><b>TORRE:</b> DIGITAL<br/><b>CLIENTE:</b> NOVO<br/><b>SEGMENTO:</b> PME<br/><b>DDD:</b> 51, 53, 54, 55<br/><b>TCM PRODUTO:</b> R$ 15,60<br/><b>TURBINE:</b> MICROSOFT/GOOGLE, MDM, GESTÃO DE EQUIPE' },
                    { title: '🚀 AVANÇADA', text: 'Quer faturar alto? Este é um produto que lhe possibilitará ultrapassar vários limites, com um ticket médio elevado e diversas soluções de LINK (Link Dedicado Exclusivo), VOZ (SIP - Operadora IP) e SEGURANÇA (SDWAN). Aqui, você tem uma excelente oportunidade de colocar a "cereja no bolo". Os produtos avançados já fazem parte de muitas empresas.<br/><br/><b>TORRE:</b> AVANÇADA VOZ E DADOS<br/><b>CLIENTE:</b> NOVO, PORTABILIDADE<br/><b>SEGMENTO:</b> PME<br/><b>DDD:</b> 51, 53, 54, 55<br/><b>TCM PRODUTO:</b> R$ 680,00<br/><b>TURBINE:</b> LINK DEDICADO, SIP, 0800, SDWAN<br/><b>MELHOR PERFIL:</b> A partir de 3 COLABORADORES, ATÉ ACIMA DE 500 COLABORADORES' },
                    { title: '🔄 RENOVAÇÃO', text: 'A renovação é um dos pilares da atividade da equipe Farm, sendo um excelente caminho para estreitar relações. Uma das premissas é fidelizar 85% ou mais do seu parque. Mantenha atenção nos processos, pois renovações com DOWNGRADE (redução do plano) afetam negativamente sua premiação e não geram nenhum tipo de pontuação. Seu foco deve ser rentabilizar renovando o parque buscando UPGRADE (aumento de valor da receita em +6%).<br/><br/><b>TORRE:</b> MÓVEL, FTTH, AVANÇADA<br/><b>TIPOS:</b> RENOVAÇÃO (ANTECIPADA, DOWN, PADRÃO, COM UP)<br/><b>SEGMENTO:</b> PME<br/><b>DDD:</b> 51 a 55<br/><b>TCM PRODUTO:</b> R$ 41,00' },
                    { title: '🛒 EQUIPAMENTOS', text: 'Venda de equipamentos é um excelente caminho para gerar relacionamento e facilidades ao cliente, com possibilidade de parcelar em até 24x diretamente na fatura. Quando bem utilizada pode gerar diversas oportunidades como através da venda Alta móvel, ser o determinante para o sucesso da sua negociação.<br/><br/><b>TORRE:</b> EQUIPAMENTOS<br/><b>CLIENTE:</b> TODOS (MENOS TT - Troca de titularidade CNPJ p/ CNPJ)<br/><b>SEGMENTO:</b> PME<br/><b>DDD:</b> TODOS<br/><b>TCM PRODUTO:</b> R$ 1.450,00<br/><b>TURBINE:</b> MDM, MICROSOFT, GESTÃO DA EQUIPE, ALTA MÓVEL' }
                ]
            },
            {
                type: 'swipecards',
                title: 'Verdade ou Mito: R$ FRESH',
                instruction: 'Deslize para a direita (Correto) ou esquerda (Incorreto) nas afirmações sobre a R$ FRESH.',
                cards: [
                    { id: 'c1', text: 'Renovação de contratos conta como R$ FRESH para o gatilho da premiação.', correctIsRight: false, explanation: 'Incorreto! Renovação não conta como FRESH, mas é um meio de encontrar novas receitas.' },
                    { id: 'c2', text: 'Para faturar a R$ FRESH completa, os produtos devem ser de clientes PME dos DDDs 51, 53, 54 e 55.', correctIsRight: true, explanation: 'Correto! Outros DDDs ou segmentos gerarão apenas 30% da pontuação normal.' }
                ]
            },
            {
                type: 'drag_drop_sort',
                title: 'Desafio Prático: A Lógica do Contato',
                instruction: 'Arraste e solte para ordenar a sequência ideal da Venda Digital TEC-B2:',
                steps: [
                    'Sondagem e Identificação (Escutar ativamente a "dor" de conectividade do cliente).',
                    'Ancoragem de Valor (Abordar o pacote VVN ou Link Dedicado visando solucionar o problema).',
                    'Proposição de Fechamento (Propor o envio do contrato via aceite virtual).',
                    'Registro da Venda (Acompanhar a R$ FRESH virando Pontuação Real).'
                ]
            },
            {
                type: 'scenario',
                title: 'Simulação - Foco na Rentabilidade',
                context: 'Você está no final do mês. Conseguiu fechar com um cliente pequeno um projeto imenso de Link Dedicado (Avançada) no município de Curitiba (DDD 41).',
                question: 'Qual o impacto direto dessa venda na sua métrica de R$ FRESH oficial?',
                options: [
                    { text: 'A venda não valerá nada, pois Link Dedicado parou de ser comissionado neste semestre.', isCorrect: false, feedback: 'Incorreto. Link Avançado é a cereja do bolo e continua hiper comissionado.' },
                    { text: 'A venda contará com percentual reduzido (30%), pois o cliente pertence a um DDD não listado como foco principal (fora da área 51-55).', isCorrect: true, feedback: 'Exatamente! O valor negociado de cliente fora dos DDDs oficiais vai rentabilizar a R$ FRESH em apenas 30% da pontuação normal. A regra é implacável.' },
                    { text: 'A venda contará 100% de FRESH, pois serviços avançados ignoram a regra de DDD ou Área.', isCorrect: false, feedback: 'Incorreto. A premissa de Segmento PME e DDDs específicos é exigência fundamental para os 100% no R$ FRESH.' }
                ]
            },
            {
                type: 'content',
                title: 'Conclusão: A Matemática Final',
                content: 'Tudo o que você vende gera uma pontuação baseada na torre e no tipo de cliente. Acompanhe ativamente sua placa de pontuação! Vender com estratégia eleva a base, fideliza a carteira e multiplica a sua própria recompensa.'
            }
        ]
    }
];

export const getAvailableCourses = (department) => {
    return coursesData.filter(
        course => course.departments.includes("Todos") || course.departments.includes(department)
    );
};

export const getCourseById = (id) => {
    return coursesData.find(course => course.id === id);
};
