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
                    { title: '📱 ALTA MÓVEL', text: 'Movimento no incremento e/ou venda de novas linhas móveis, sempre que a venda ocorrer nas modalidades de NOVO, INCREMENTO e PORTABILIDADE, seguindo as premissas de Segmento e DDD. A linha irá rentabilizar como R$ FRESH e Pontuação. Acompanhe este indicador, pois ele é fundamental no seu simulador de premiação. Entregar este indicador lhe trará rentabilização, aumentará seu parque móvel e proporcionará maior rentabilização no médio e longo prazo!<br/><br/><ul style="padding-left: 20px; text-align: left; list-style-type: disc;"><li><b>TORRE:</b> MÓVEL</li><li><b>CLIENTE:</b> NOVO, INCREMENTO, PORTABILIDADE</li><li><b>SEGMENTO:</b> PME (Pequenas e Médias Empresas)</li><li><b>DDD:</b> 51, 53, 54, 55</li><li><b>TCM (Ticket Central Médio/Ticket Médio) PRODUTO:</b> R$ 52,50</li><li><b>MELHOR PERFIL:</b> 1 a 2 até ACIMA DE 500 COLABORADORES</li></ul><p style="text-align: left; font-size: 0.9em; margin-top: 10px;"><i>*CLIENTE QUE SÓ POSSUI BÁSICA É OPORTUNIDADE EXTRA</i></p>' },
                    { title: '🌐 FTTH', text: 'A "menina dos olhos" da VIVO nos últimos 5 anos foi o investimento em tecnologia de fibra (Fiber To The Home - Fibra até a empresa). O que possibilitou a ampliação da viabilidade e se tornou uma fonte de rentabilização para vendedores e parceiros. Este indicador é peça-chave na sua política de premiação e deve receber um cuidado especial. Não trabalhe com o limite da meta, pois poderá ocorrer desistências ou inviabilidades. Dessa forma, você não comprometerá seu mês.<br/><br/><ul style="padding-left: 20px; text-align: left; list-style-type: disc;"><li><b>TORRE:</b> FTTH</li><li><b>CLIENTE:</b> NOVO, INCREMENTO</li><li><b>SEGMENTO:</b> PME</li><li><b>DDD:</b> 51, 53, 54, 55</li><li><b>TCM PRODUTO:</b> R$ 91,50</li><li><b>MELHOR PERFIL:</b> 1 a 2 até ACIMA DE 500 COLABORADORES</li></ul><p style="text-align: left; font-size: 0.9em; margin-top: 10px;"><i>*CLIENTE QUE SÓ POSSUI MÓVEL É OPORTUNIDADE EXTRA</i></p>' },
                    { title: '🗣️ VVN (Voz na Nuvem)', text: 'Uma solução revolucionária que não depende de barreiras estruturais e está disponível em mais de 75% do território gaúcho. Além de ser inovadora, a solução é um grande aliado para o seu faturamento. Com modulações e descontos por volume, o produto possibilita, em uma única negociação, alcançar sua meta e rentabilizar clientes que não possuem oportunidade de venda de Mobilidade e FTTH.<br/><br/><ul style="padding-left: 20px; text-align: left; list-style-type: disc;"><li><b>TORRE:</b> VVN</li><li><b>CLIENTE:</b> NOVO, INCREMENTO, PORTABILIDADE</li><li><b>SEGMENTO:</b> PME</li><li><b>DDD:</b> 51, 53, 54, 55</li><li><b>TCM PRODUTO:</b> R$ 47,80</li><li><b>TURBINE:</b> GRAVAÇÃO, URA (Unidade de Resposta Audível), MÓDULO TEAMS</li><li><b>MELHOR PERFIL:</b> 1 a 2 até ACIMA DE 500 COLABORADORES</li></ul>' }
                ]
            },
            {
                type: 'carousel',
                title: 'As Torres de Venda (Parte 2)',
                slides: [
                    { title: '💻 DIGITAL', text: 'Uma das torres com o maior número de possibilidades. Apesar de um ticket médio baixo, as soluções da MICROSOFT, GOOGLE, MDM (Mobile Device Management) e outras são produtos eficientes para a composição da R$ FRESH. Sem contar a possibilidade de encontrar projetos com alto valor agregado, abrindo portas para grandes negociações. Descubra o que seu cliente realmente utiliza!<br/><br/><ul style="padding-left: 20px; text-align: left; list-style-type: disc;"><li><b>TORRE:</b> DIGITAL</li><li><b>CLIENTE:</b> NOVO</li><li><b>SEGMENTO:</b> PME</li><li><b>DDD:</b> 51, 53, 54, 55</li><li><b>TCM PRODUTO:</b> R$ 15,60</li><li><b>TURBINE:</b> MICROSOFT/GOOGLE, MDM, GESTÃO DE EQUIPE</li></ul>' },
                    { title: '🚀 AVANÇADA', text: 'Quer faturar alto? Este é um produto que lhe possibilitará ultrapassar vários limites, com um ticket médio elevado e diversas soluções de LINK (Link Dedicado Exclusivo), VOZ (SIP - Operadora IP) e SEGURANÇA (SDWAN). Aqui, você tem uma excelente oportunidade de colocar a "cereja no bolo". Os produtos avançados já fazem parte de muitas empresas.<br/><br/><ul style="padding-left: 20px; text-align: left; list-style-type: disc;"><li><b>TORRE:</b> AVANÇADA VOZ E DADOS</li><li><b>CLIENTE:</b> NOVO, PORTABILIDADE</li><li><b>SEGMENTO:</b> PME</li><li><b>DDD:</b> 51, 53, 54, 55</li><li><b>TCM PRODUTO:</b> R$ 680,00</li><li><b>TURBINE:</b> LINK DEDICADO, SIP, 0800, SDWAN</li><li><b>MELHOR PERFIL:</b> A partir de 3 COLABORADORES, ATÉ ACIMA DE 500 COLABORADORES</li></ul>' },
                    { title: '🔄 RENOVAÇÃO', text: 'A renovação é um dos pilares da atividade da equipe Farm, sendo um excelente caminho para estreitar relações. Uma das premissas é fidelizar 85% ou mais do seu parque. Mantenha atenção nos processos, pois renovações com DOWNGRADE (redução do plano) afetam negativamente sua premiação e não geram nenhum tipo de pontuação. Seu foco deve ser rentabilizar renovando o parque buscando UPGRADE (aumento de valor da receita em +6%).<br/><br/><ul style="padding-left: 20px; text-align: left; list-style-type: disc;"><li><b>TORRE:</b> MÓVEL, FTTH, AVANÇADA</li><li><b>TIPOS:</b> RENOVAÇÃO (ANTECIPADA, DOWN, PADRÃO, COM UP)</li><li><b>SEGMENTO:</b> PME</li><li><b>DDD:</b> 51 a 55</li><li><b>TCM PRODUTO:</b> R$ 41,00</li></ul>' },
                    { title: '🛒 EQUIPAMENTOS', text: 'Venda de equipamentos é um excelente caminho para gerar relacionamento e facilidades ao cliente, com possibilidade de parcelar em até 24x diretamente na fatura. Quando bem utilizada pode gerar diversas oportunidades como através da venda Alta móvel, ser o determinante para o sucesso da sua negociação.<br/><br/><ul style="padding-left: 20px; text-align: left; list-style-type: disc;"><li><b>TORRE:</b> EQUIPAMENTOS</li><li><b>CLIENTE:</b> TODOS (MENOS TT - Troca de titularidade CNPJ p/ CNPJ)</li><li><b>SEGMENTO:</b> PME</li><li><b>DDD:</b> TODOS</li><li><b>TCM PRODUTO:</b> R$ 1.450,00</li><li><b>TURBINE:</b> MDM, MICROSOFT, GESTÃO DA EQUIPE, ALTA MÓVEL</li></ul>' }
                ]
            },
            {
                type: 'swipecards',
                title: 'Verdade ou Mito: R$ FRESH',
                instruction: 'Deslize para a direita (Correto) ou esquerda (Mito) nas afirmações sobre as regras da R$ FRESH.',
                cards: [
                    { id: 'c1', text: 'Independentemente do DDD (seja 51 ou 41), uma venda robusta de Linhas Móveis ou Equipamento TT conta integralmente para a R$ FRESH.', correctIsRight: false, explanation: 'Mito clássico! Outros DDDs não listados como foco geram apenas 30%. E Troca de Titularidade (TT) não foca na métrica de Torres Equipamentos.' },
                    { id: 'c2', text: 'Para faturar 100% da R$ FRESH, a regra mais valiosa indica que os produtos devem ser vendidos para o Segmento PME nos DDDs 51, 53, 54 e 55.', correctIsRight: true, explanation: 'Fato! Esta é a principal regra de ouro que garante sua comissão máxima.' }
                ]
            },
            {
                type: 'drag_drop_sort',
                title: 'Desafio Prático: A Lógica do TCM',
                instruction: 'Com base no Ticket Central Médio (TCM) dos produtos, ordene as Torres de Venda da Vivo posicionando o produto de MAIOR VALOR FINANCEIRO (topo) até o de MENOR VALOR:',
                steps: [
                    'Avançada Voz e Dados (Link Dedicado, SIP, SDWAN)',
                    'FTTH (A "menina dos olhos" da Vivo em Banda Larga)',
                    'Alta Móvel (Novas linhas e Portabilidade)',
                    'Digital (A "porta de entrada": Microsoft, Google, MDM)'
                ]
            },
            {
                type: 'scenario',
                title: 'Simulação - Lógica do Impacto',
                context: 'Após mapear com êxito os 4 primeiros passos avaliados, você percebeu que um cliente, pertencente à região de Rio Grande (DDD 53) no Segmento PME, optou apenas pela Renovação DOWNGRADE e recusou a proposta de VVN em novos pontos de serviço.',
                question: 'Considerando a política da equipe Farm e o foco das metas, o que acontece com a sua performance imediata e ganhos R$ FRESH com este cliente?',
                options: [
                    { text: 'A Renovação em DOWNGRADE irá afetar negativamente sua premiação final perdendo a fidelidade base, e você não somará nenhum R$ FRESH para o novo ciclo.', isCorrect: true, feedback: 'Excelente interpretação! Renovar por si mesmo não gera R$ FRESH, e como foi em DOWNGRADE, você afeta diretamente a fatia de rentabilização!' },
                    { text: 'Apesar de não levar VVN que geraria R$ 47,80 de TCM, você ganhará R$ FRESH parcial devido ao cliente ser do Rio Grande.', isCorrect: false, feedback: 'Incorreto. Serviços de renovações não geram nem contam R$ FRESH de forma direta baseada no DDD.' },
                    { text: 'Sua R$ FRESH renderá 30% do valor porque a Renovação conta como uma venda de torre tradicional.', isCorrect: false, feedback: 'Incorreto. O conceito de render apenas 30% vale para Vendas de Novos Produtos que caem *fora* do enquadramento dos DDDs Oficiais e PME. Renovação NÃO é R$ FRESH.' }
                ]
            },
            {
                type: 'content',
                title: 'Conclusão: A Matemática Final',
                content: 'Tudo o que você vende gera uma pontuação baseada na torre e no tipo de cliente. Acompanhe ativamente sua placa de pontuação! Vender com estratégia eleva a base, fideliza a carteira e multiplica a sua própria recompensa.'
            }
        ]
    },
    {
        id: 3,
        title: 'Processo de Venda',
        description: 'Estratégias completas de Vendas B2B: Atendimento Humanizado, Metodologia SPIN Selling, Processo de Sondagem e Funil Rigoroso de Relacionamento.',
        duration: '40 min',
        icon: '🤝',
        thumbnail: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=400',
        departments: ['Todos'],
        modules: [
            {
                type: 'content',
                title: 'O Atendimento Humanizado',
                html: true,
                content: 'O atendimento humanizado foca na <b>empatia e na personalização</b>, valorizando o cliente como indivíduo e não apenas como comprador. Ele rompe com o tradicional modelo de telemarketing de roteiros rígidos. Esse tipo de atendimento fortalece a relação cliente-empresa e gera confiança.<br/><br/>De acordo com o Relatório Zendesk, 66% dos consumidores afirmam que uma interação ruim com o suporte pode arruinar seu dia, e 52% relatam sentir-se exaustos após essas interações. A consequência de não humanizar reflete em números preocupantes: enquanto 73% mudarão para um concorrente após várias experiências ruins, <b>mais da metade abandonará a empresa após uma única interação insatisfatória.</b><br/><br/><i>"Eu acredito que minha empresa só existe por causa dos clientes... Essa abordagem ‘customer centric’ é um processo de longo prazo que exige envolvimento de todos."</i><br/><br/>Tão importante quanto resolver um problema é entrar em contato depois que o cliente já está satisfeito ("posso ajudar com mais alguma coisa?").'
            },
            {
                type: 'video',
                title: 'Empatia e Encantamento (Disney)',
                description: 'Conhecida como um lugar de sonhos, a Disney direciona seus esforços aplicando o conceito H.E.A.R.D: Ouvi (Hear), Empatizar (Empathize), Pedir desculpas (Apologize), Resolver (Resolve) e Diagnosticar (Diagnose).',
                videoId: 'M8sQwMZiBfM',
                requireDelay: 0
            },
            {
                type: 'content',
                title: 'O Processo Além da Empatia',
                html: true,
                content: 'Embora não sigamos um script rígido, isso não significa que devemos ignorar processos. A venda nasce de um relacionamento, e cada etapa é essencial.<br/><br/>O modelo se baseia em quatro pilares interconectados: <b>Processos, Empatia, Atenção e Personalizado</b> (substituindo o antigo "Script Fixo").'
            },
            {
                type: 'carousel',
                title: 'Metodologia: SPIN Selling',
                slides: [
                    { title: 'A Origem', text: 'Desenvolvido por Neil Rackham (1970) após estudo de 35 mil ligações em 20 países (com Xerox e IBM). Conclusão: a melhor forma de vender não é forçar, mas <b>criar valor</b> e atuar como consultor de confiança.<br/><br/>O método trabalha fechamento de negócios complexos por meio de Perguntas na ordem certa.' },
                    { title: 'S - Situação', text: 'Etapa fundamental para conhecer seu comprador e problemas atuais. Aqui coletamos o máximo de info.<br/><br/><b>Exemplos Vivo Empresas:</b><br/>- Como está a estrutura de comunicação atualmente?<br/>- Quantos colaboradores utilizam dados móveis no trabalho?<br/>- Vocês já utilizam PABX virtual?' },
                    { title: 'P - Problema', text: 'Concentra nas dores. Destaca problemas que talvez nem o cliente tenha percebido. Foque na dor e ouça 100%.<br/><br/><b>Exemplos Vivo Empresas:</b><br/>- Você enfrenta dificuldades com comunicação interna?<br/>- Teve interrupções na internet?<br/>- Os colaboradores precisam de mobilidade e não conseguem acesso remoto?' },
                    { title: 'I - Implicação', text: 'Ajuda o cliente a identificar as consequências de NÃO resolver o problema. Aumenta o senso de urgência!<br/><br/><b>Exemplos Vivo Empresas:</b><br/>- Se continuar ineficiente, como afeta a produtividade?<br/>- Quais os custos/perdas se as interrupções persistirem?<br/>- Como a falta de mobilidade impacta o atendimento ao público?' },
                    { title: 'N - Necessidade de Solução', text: 'Fazer o comprador perceber que sua solução o ajudará em todos os problemas acima. Faça-o imaginar a vida sem a dor.<br/><br/><b>Exemplos Vivo Empresas:</b><br/>- Como seria contar com comunicação confiável?<br/>- De que forma uma internet estável otimizaria operações?<br/>- Se acessassem remoto com segurança, impactaria o atendimento?' }
                ]
            },
            {
                type: 'content',
                title: 'Incorpore Estratégia e TIS',
                html: true,
                content: 'Hoje as informações existem e devem ser aproveitadas. Observe o ramo da empresa, mídias sociais e o site. No <b>TIS</b>, você encontra inúmeras informações sobre o comportamento do cliente, facilitando a comunicação empática. No fechamento, o vendedor apenas consolida as informações das etapas do SPIN para visualizar a solução ideal ("Com base em nossa conversa, qual o próximo passo...").'
            },
            {
                type: 'accordion',
                title: 'Processo de Sondagem e Tipos de Necessidades',
                instruction: 'Explore as diretrizes de Sondagem para Escuta Ativa:',
                items: [
                    { title: 'Preparação', content: 'Conhecimento prévio (pesquisar CNAE, etc) e Definição de Objetivos (o que descobrir hoje).' },
                    { title: 'Início da Conversa', content: 'Abertura amigável para ambiente de confiança. Explane o objetivo da interação.' },
                    { title: 'Necessidades Explícitas', content: 'Dores claras e diretas. O cliente já reconhece e comunica Ativamente.\n\nExemplo 1: Preciso de um pc maior.\nExemplo 2: Software está com problema (Assistência).' },
                    { title: 'Necessidades Implícitas', content: 'Dores não ditas, latentes. Cabe ao vendedor identificar entrelinhas.\n\nExemplo 1: Reclama da lentidão mas não pede upgrade (Dor: processador).\nExemplo 2: Insatisfeito com a entrega mas não sabe nomear a solução.' },
                    { title: 'Análise e Diagnóstico', content: 'Compile dados e defina ações e soluções Vivo Empresas baseadas nas respostas abertas.' },
                    { title: 'Feedback e Seguimento', content: 'Compartilhe o encontrado, encaminhe a solução, e faça acompanhamento dos próximos passos.' }
                ]
            },
            {
                type: 'carousel',
                title: 'A Jornada do Processo de Relacionamento',
                slides: [
                    { title: 'O Poder da Relação', text: 'Usamos marcação de manutenção para oportunizar negócios. Um cliente bem relacionado <b>eleva em 80% a contratação de novos produtos</b> e em <b>97% a chance de mantê-lo.</b> Expectativa de 1 contato a cada 90 dias (33% da carteira/mês) marcados como Relacionamento, Negociação, etc.' },
                    { title: '1. Pesquisa e Preparação', text: 'Atividade CNAE; Nº de Colaboradores; Planta de Produtos VIVO; Site. Defina o objetivo claro.' },
                    { title: '2. Primeiro Contato', text: 'Abordagem pessoal (nome do cliente). Seja breve. Use o canal adequado. APROVEITE para enviar Carta de Apresentação e WhatsApp se apresentando.' },
                    { title: '3. Escuta Ativa', text: 'Ouça mais, fale menos. Ex: "O que eu posso fazer para melhorar seu uso?", "Deseja testar novos produtos vivo?", "Sr sabia do gerente exclusivo?"' },
                    { title: '4. Ofereça Valor (Soluções)', text: 'Mobilidade (chip do cadastro é vivo? FTTH (venda 20GB extra e ticket médio)? VVN (todos perfis)? Digital (Office/LGPD)? Avançada (Link 99.6% SLA 4h)? Equipamentos. É impossível sair sem oferta.' },
                    { title: '5. Manutenção e Fidelização', text: 'Seja PROATIVO nas tratativas (avise do andamento do pedido antes que ele cobre). O uso de dados acima do contrato é chance de abordar. Apresente do VIVO VALORIZA.' },
                    { title: '7 e 8. Longo Prazo e Conflitos', text: 'Resolução rápida (Nós temos profissional exclusivo técnico TEC-B2). Evolução conjunta entendendo que parcerias maduras ganham customizações extras.' }
                ]
            },
            {
                type: 'content',
                title: 'Funil de Vendas Visual',
                html: true,
                content: 'A representação visual do funil passa por:<br/>1. <b>Oportunidade (Leads / Fresh / Carteira)</b>: Clientes com perfil para expansão ou sem integração.<br/>2. <b>Relacionamento (SPIN)</b>: Onde aplicamos o método com as dores reais (latentes ou futuras).<br/>3. <b>Negociação</b>: Momento de não retorno formal (sucesso depende da etapa 2).<br/>4. <b>Fechamento</b>: Construção do vínculo virou assinatura. Previsibilidade de receita.'
            },
            {
                type: 'swipecards',
                title: 'Mito ou Verdade: SPIN e Implícitas',
                instruction: 'Deslize para a direita (Correto) ou esquerda (Mito) sobre as falas abaixo:',
                cards: [
                    { id: 'sv1', text: 'Segundo o SPIN Selling, minha primeira atitude com um Lead é listar os preços do Vivo FTTH.', correctIsRight: false, explanation: 'Mito! Iniciar pelo PREÇO destrói o SPIN. O S de Situação manda você primeiro pesquisar como está a infraestrutura dele.' },
                    { id: 'sv2', text: 'Apenas ser Reativo (responder só quando o cliente chama com problema) passa impressão de indiferença.', correctIsRight: true, explanation: 'Correto. Manutenção Proativa (avisar andamento de ticket, apontar uso extra de dados) cria Fidelização fortíssima.' },
                    { id: 'sv3', text: 'Um cliente dizendo "A comunicação do meu time externo é lenta" está dando uma Necessidade Implícita para MDM e MÓVEL.', correctIsRight: true, explanation: 'Fato perfeito. Ele falou a dor mascarada, o vendedor qualificado traduz a dor na Solução certa!' }
                ]
            },
            {
                type: 'drag_drop_sort',
                title: 'Desafio Prático: A Metodologia do SPIN',
                instruction: 'Ordene a Lógica do SPIN Selling pela estrutura evolutiva da negociação:',
                steps: [
                    'SITUAÇÃO (Qual o seu CNAE e como trabalha seu TI?)',
                    'PROBLEMA (A internet de hoje derruba sua operação de NF?)',
                    'IMPLICAÇÃO (Se parar 3 horas, o prejuízo das NF não emitidas passa seu orçamento atual?)',
                    'NECESSIDADE (Se o Link Dedicado 99.6% garantir o seu faturamento seguro, nós fechamos?)'
                ]
            },
            {
                type: 'scenario',
                title: 'Simulação: A Oferta de Valor B2B',
                context: 'No contato de relacionamento trimestral com uma rede de pequenas padarias (PME), o dono reclama informalmente que alguns gerentes não abrem planilhas rápido em casa nem conseguem bater ponto e diz: "Eu gasto com plano controle vagabundo e a internet deles acaba antes do fim do mês".',
                question: 'Como aplicar a "Oferta de Valor" diagnosticando a dor do cliente segundo as cartilhas Vivo?',
                options: [
                    { text: 'Aconselhar o cliente a mandar os gerentes comprarem pacote de internet com o próprio bolso, já que é erro pessoal deles.', isCorrect: false, feedback: 'Incorreto e anti-humanizado. Quebra total de relacionamento e perde venda.' },
                    { text: 'Empurrar um Link Avançado Dedicado caríssimo para as padarias, ignorando os celulares.', isCorrect: false, feedback: 'Incorreto. A oferta não conecta com a dor descrita (home office/controle móvel). Solução cara e sem propósito falha no SPIN.' },
                    { text: 'Investigar se os telefones em uso são Vivo (linha VIVO na Planta). Realizar a venda de Alta Móvel Corporativa + Licenças DIGITAIS de Office/Teams, unificando a gestão e resolvendo o problema de dados móveis do time.', isCorrect: true, feedback: 'Excelente! Isso é "Escuta Ativa" em Mestre. O cliente entregou dores (comunicação e cota de dados) e você achou Torres cruzadas MÓVEL+DIGITAL.' }
                ]
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
