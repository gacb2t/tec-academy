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
                content: 'Nossa Identidade Visual reflete nossa marca e presença digital. Acompanhe nossos canais oficiais para ficar por dentro das novidades:\n\n<div style="display:flex; flex-direction:column; align-items:center; gap: 1rem; margin-top:2rem;"><div>🌐 <a href="http://TECB2.COM.BR" target="_blank" style="color:var(--primary-color);text-decoration:none;font-weight:bold;">TECB2.COM.BR</a></div><div>📱 <a href="https://instagram.com/TECB2B" target="_blank" style="color:var(--primary-color);text-decoration:none;font-weight:bold;">@TECB2B</a></div></div>'
            },
            {
                type: 'accordion',
                title: 'Regras de Ponto e Pagamentos',
                instruction: 'Clique nos itens para ler as regras fundamentais de ausências e recebimentos.',
                items: [
                    { icon: '⏱', title: 'Banco de Horas', content: 'Em casos de horas extras ou de saldo de horas deliberado pela empresa, os mesmos serão computados no banco de horas.' },
                    { icon: '📄', title: 'Falta Justificada', content: 'Em casos de falta justificada (conforme a lei de abono), o documento comprobatório deverá ser enviado ao RH em até 48 horas.' },
                    { icon: '⚠️', title: 'Falta Não Justificada', content: 'Ocorre quando um funcionário se ausenta sem apresentar motivo válido ou atestado. Gera descontos de: Vale Transporte, Vale Refeição, DSR e reflexos nas Férias.' },
                    { icon: '💰', title: 'Pagamento de Salário', content: 'Ocorre sempre no 5º DIA ÚTIL. A conta bancária da empresa é vinculada ao Itaú.' },
                    { icon: '🍽️', title: 'Benefícios (VR/VT)', content: 'Os créditos de Vale Refeição (Alelo) e Vale Transporte são depositados no DIA 10.' },
                    { icon: '🏅', title: 'Premiações', content: 'A apuração e pagamento das Premiações também ocorrem no DIA 10.' },
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
                        imageUrl: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=400&q=80'
                    },
                    {
                        title: '2. Saída para Intervalo',
                        description: 'Indica o início da pausa para o seu almoço ou descanso.',
                        imageUrl: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&q=80'
                    },
                    {
                        title: '3. Retorno do Intervalo',
                        description: 'Marca o fim do intervalo e o seu retorno efetivo ao trabalho.',
                        imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&q=80'
                    },
                    {
                        title: '4. Saída (Término da Jornada)',
                        description: 'Registra o fim do seu expediente diário e encerra as horas do dia.',
                        imageUrl: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=400&q=80'
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
                    { icon: '✅', title: 'Assumir Responsabilidades', content: 'Reconhecer os próprios erros e aprender com eles, buscando sempre melhorar.' },
                    { icon: '🤗', title: 'Respeitar os Outros', content: 'Tratar todos com dignidade, independência de posição, raça, gênero ou crenças.' },
                    { icon: '⚖️', title: 'Agir com Justiça', content: 'Ser imparcial e justo nas decisões, sem favorecimento ou discriminação.' },
                    { icon: '🔒', title: 'Confidencialidade', content: 'Manter em sigilo as informações pessoais e profissionais, respeitando a privacidade e segurança dos dados.' },
                    { icon: '🛡️', title: 'Demonstrar Lealdade', content: 'Cumprir com os deveres e compromissos assumidos com a organização, clientes e colegas.' },
                    { icon: '🕊', title: 'Evitar Conflitos', content: 'Não se envolver em situações onde interesses pessoais possam comprometer decisões profissionais.' },
                    { icon: '🌱', title: 'Promover Bem Comum', content: 'Agir para o benefício coletivo e tomar decisões que tragam impactos positivos.' },
                    { icon: '📋', title: 'Respeitar as Leis', content: 'Seguir as normas estabelecidas e cumprir todas as leis aplicáveis ao setor e à sociedade.' },
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
        icon: "🤝",
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
        icon: '📊',
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
                    { title: '☁️ VVN (Voz na Nuvem)', text: 'Uma solução revolucionária que não depende de barreiras estruturais e está disponível em mais de 75% do território gaúcho. Além de ser inovadora, a solução é um grande aliado para o seu faturamento. Com modulações e descontos por volume, o produto possibilita, em uma única negociação, alcançar sua meta e rentabilizar clientes que não possuem oportunidade de venda de Mobilidade e FTTH.<br/><br/><ul style="padding-left: 20px; text-align: left; list-style-type: disc;"><li><b>TORRE:</b> VVN</li><li><b>CLIENTE:</b> NOVO, INCREMENTO, PORTABILIDADE</li><li><b>SEGMENTO:</b> PME</li><li><b>DDD:</b> 51, 53, 54, 55</li><li><b>TCM PRODUTO:</b> R$ 47,80</li><li><b>TURBINE:</b> GRAVAÇÃO, URA (Unidade de Resposta Audível), MÓDULO TEAMS</li><li><b>MELHOR PERFIL:</b> 1 a 2 até ACIMA DE 500 COLABORADORES</li></ul>' }
                ]
            },
            {
                type: 'carousel',
                title: 'As Torres de Venda (Parte 2)',
                slides: [
                    { title: '💻 DIGITAL', text: 'Uma das torres com o maior número de possibilidades. Apesar de um ticket médio baixo, as soluções da MICROSOFT, GOOGLE, MDM (Mobile Device Management) e outras são produtos eficientes para a composição da R$ FRESH. Sem contar a possibilidade de encontrar projetos com alto valor agregado, abrindo portas para grandes negociações. Descubra o que seu cliente realmente utiliza!<br/><br/><ul style="padding-left: 20px; text-align: left; list-style-type: disc;"><li><b>TORRE:</b> DIGITAL</li><li><b>CLIENTE:</b> NOVO</li><li><b>SEGMENTO:</b> PME</li><li><b>DDD:</b> 51, 53, 54, 55</li><li><b>TCM PRODUTO:</b> R$ 15,60</li><li><b>TURBINE:</b> MICROSOFT/GOOGLE, MDM, GESTÃO DE EQUIPE</li></ul>' },
                    { title: '⚡ AVANÇADA', text: 'Quer faturar alto? Este é um produto que lhe possibilitará ultrapassar vários limites, com um ticket médio elevado e diversas soluções de LINK (Link Dedicado Exclusivo), VOZ (SIP - Operadora IP) e SEGURANÇA (SDWAN). Aqui, você tem uma excelente oportunidade de colocar a "cereja no bolo". Os produtos avançados já fazem parte de muitas empresas.<br/><br/><ul style="padding-left: 20px; text-align: left; list-style-type: disc;"><li><b>TORRE:</b> AVANÇADA VOZ E DADOS</li><li><b>CLIENTE:</b> NOVO, PORTABILIDADE</li><li><b>SEGMENTO:</b> PME</li><li><b>DDD:</b> 51, 53, 54, 55</li><li><b>TCM PRODUTO:</b> R$ 680,00</li><li><b>TURBINE:</b> LINK DEDICADO, SIP, 0800, SDWAN</li><li><b>MELHOR PERFIL:</b> A partir de 3 COLABORADORES, ATÉ ACIMA DE 500 COLABORADORES</li></ul>' },
                    { title: '🔄 RENOVAÇÃO', text: 'A renovação é um dos pilares da atividade da equipe Farm, sendo um excelente caminho para estreitar relações. Uma das premissas é fidelizar 85% ou mais do seu parque. Mantenha atenção nos processos, pois renovações com DOWNGRADE (redução do plano) afetam negativamente sua premiação e não geram nenhum tipo de pontuação. Seu foco deve ser rentabilizar renovando o parque buscando UPGRADE (aumento de valor da receita em +6%).<br/><br/><ul style="padding-left: 20px; text-align: left; list-style-type: disc;"><li><b>TORRE:</b> MÓVEL, FTTH, AVANÇADA</li><li><b>TIPOS:</b> RENOVAÇÃO (ANTECIPADA, DOWN, PADRÃO, COM UP)</li><li><b>SEGMENTO:</b> PME</li><li><b>DDD:</b> 51 a 55</li><li><b>TCM PRODUTO:</b> R$ 41,00</li></ul>' },
                    { title: '📦 EQUIPAMENTOS', text: 'Venda de equipamentos é um excelente caminho para gerar relacionamento e facilidades ao cliente, com possibilidade de parcelar em até 24x diretamente na fatura. Quando bem utilizada pode gerar diversas oportunidades como através da venda Alta móvel, ser o determinante para o sucesso da sua negociação.<br/><br/><ul style="padding-left: 20px; text-align: left; list-style-type: disc;"><li><b>TORRE:</b> EQUIPAMENTOS</li><li><b>CLIENTE:</b> TODOS (MENOS TT - Troca de titularidade CNPJ p/ CNPJ)</li><li><b>SEGMENTO:</b> PME</li><li><b>DDD:</b> TODOS</li><li><b>TCM PRODUTO:</b> R$ 1.450,00</li><li><b>TURBINE:</b> MDM, MICROSOFT, GESTÃO DA EQUIPE, ALTA MÓVEL</li></ul>' }
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
        title: 'Processos de Vendas',
        description: 'Treinamento Supremo de Vendas B2B: Atendimento Humanizado, Metodologia SPIN Selling, TIS, Processo de Sondagem e as 8 Etapas do Relacionamento.',
        duration: '45 min',
        icon: '💼',
        thumbnail: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=400',
        departments: ['Todos'],
        modules: [
            {
                type: 'content',
                title: 'O que é Atendimento Humanizado?',
                html: true,
                content: 'O <b>atendimento humanizado</b> foca na empatia e na personalização, valorizando o cliente como indivíduo e não apenas como comprador. O objetivo é proporcionar uma experiência completa.<br/><br/>Ele é caracterizado por um diálogo atento e empático, focado em resolver problemas de forma acolhedora. Rompe com o tradicional modelo de telemarketing de roteiros rígidos, promovendo comunicação próxima e genuína.'
            },
            {
                type: 'content',
                title: 'Por que a Humanização é Importante?',
                html: true,
                content: 'Em um mercado onde a impessoalidade predomina, o tratamento diferenciado destaca você da concorrência.<br/><br/>De acordo com o Relatório Zendesk:<br/>- <b>66%</b> dos consumidores afirmam que uma interação ruim estraga o dia.<br/>- <b>52%</b> sentem-se exaustos após suportes ruins.<br/>- <b>73%</b> mudarão para um concorrente após várias experiências ruins.<br/>- <b>Mais da metade</b> abandonará a empresa após UMA ├ÜNICA interação insatisfatória.'
            },
            {
                type: 'content',
                title: 'A Empatia como Peça-Chave',
                html: true,
                content: 'Ter empatia é fundamental no atendimento, onde lidamos com emoções como frustração e raiva. A capacidade de ajustar a abordagem e <b>oferecer desculpas genuínas é insubstituível</b>.<br/><br/>Daniel Kahneman destaca: 70% das experiências de compra são influenciadas pela percepção de como o consumidor é tratado. Mesmo quando você não pode resolver o problema naquele segundo, demonstrar empatia faz o cliente se sentir ouvido e valorizado.'
            },
            {
                type: 'video',
                title: 'A Magia da Disney e a Empatia',
                description: 'A Disney é referência mundial em atendimento (encantamento) pois empodera os funcionários a sentirem o que é felicidade.',
                videoId: 'M8sQwMZiBfM',
                requireDelay: 900  // 15 minutos obrigatórios
            },
            {
                type: 'accordion',
                title: 'O Conceito H.E.A.R.D (Disney)',
                instruction: 'Clique nas letras para aprender o método aplicado pelos "Cast Members" dos parques:',
                items: [
                    { title: 'H - Hear (Ouvir)', content: 'Escute ativamente o cliente, sem interromper, permitindo que ele expresse toda a sua frustração.' },
                    { title: 'E - Empathize (Empatizar)', content: 'Valide os sentimentos do cliente. Mostre que você entende o peso do problema dele ("Eu entendo perfeitamente como isso é frustrante").' },
                    { title: 'A - Apologize (Pedir Desculpas)', content: 'Peça desculpas sinceras, não apenas de forma mecânica. Peça desculpas pela situação, mesmo que a culpa "técnica" não seja unicamente sua.' },
                    { title: 'R - Resolve (Resolver)', content: 'Dê uma solução rápida e eficiente. Se não puder resolver o problema raiz na hora, ofereça uma alternativa paliativa ou prazo real.' },
                    { title: 'D - Diagnose (Diagnosticar)', content: 'Entenda por que o problema ocorreu e trabalhe nos bastidores (processos internos) para que não aconteça de novo com outro cliente.' }
                ]
            },
            {
                type: 'content',
                title: 'Customer Centric e Pós-Tratativa',
                html: true,
                content: 'Acredite: <i>"A minha empresa só existe por causa dos clientes"</i>.<br/>Isso é <b>Customer Centric</b> - garantir que todas as decisões sejam feitas pensando na experiência de sucesso do cliente.<br/><br/><b>Dica de Ouro: Entre em contato DEPOIS que o problema foi resolvido!</b><br/>Ligue dizendo apenes "Posso ajudar com mais alguma coisa?". Isso demonstra compromisso absurdamente raro no Brasil e gera indicações (vendas adicionais).'
            },
            {
                type: 'content',
                title: 'Além do Script Fixo',
                html: true,
                content: 'Embora não sigamos scripts rígidos para não parecermos rob├┤s, <b>não podemos ignorar Processos</b>.<br/>O nosso processo de relacionamento substitui o "script inflexível" por um Quadrado Mágico: <b>Processos + Empatia + Atenção + Personalizado</b>.<br/>Isso permite, por exemplo, ouvir uma contestação de fatura e transformar a bronca em uma renegociação amigável de ampliação de plano.'
            },
            {
                type: 'carousel',
                title: 'Introdução ao SPIN Selling',
                slides: [
                    { title: 'O Que É?', text: 'Técnica focada em fazer boas perguntas, na ordem certa, para traduzir dores em vendas B2B.' },
                    { title: 'Como Surgiu?', text: 'Criada em 1988 por Neil Rackham após estudar 35 mil ligações de vendas da Xerox/IBM. A conclusão? Não se "empurra" o produto. Você diagnostica e o cliente pede para comprar.' }
                ]
            },
            {
                type: 'carousel',
                title: 'Mergulho: As 4 Letras do SPIN',
                slides: [
                    { title: '1. S - Situação', text: 'Coleta de Dados ("Fase de Investigação").<br/><br/>Exemplo Vivo: "Como está sua infra atual?", "Usam PABX?", "Quantos da equipe tem Home Office?"' },
                    { title: '2. P - Problema', text: 'Investigar dores que talvez nem o cliente saiba nomear.<br/><br/>Exemplo Vivo: "Você enfrenta quedas do link à tarde?", "Sua equipe fica sem dados móveis no dia 15?"' },
                    { title: '3. I - Implicação', text: 'Tocar na ferida. O que acontece se NÃO resolver hoje?<br/><br/>Exemplo Vivo: "Se a internet de vocês parar 2 horas, quanto se perde de nota fiscal?", "Sem dados, sua equipe deixa de bater metas externas?"' },
                    { title: '4. N - Necessidade de Solução', text: 'Apresentar o produto como remédio. Fazer ele imaginar a cura.<br/><br/>Exemplo Vivo: "Se eu colocasse uma VPN para sua equipe trabalhar seguro de casa, isso impactaria quantos % nas vendas?"' }
                ]
            },
            {
                type: 'content',
                title: 'SPIN Selling: Pontos de Atenção',
                html: true,
                content: '<b>Atenção:</b> O SPIN exige nível de proficiência, sondagem aprofundada, personalização (não leia regras como um rob├┤) e acompanhamento.<br/><br/>Use o sistema <b>TIS</b> para incorporar estratégia! Veja redes sociais, ramo de atuação (CNAE) e entenda quais soluções concorrentes podem ser atacadas. O TIS revela comportamentos e dá munição real para suas perguntas.'
            },
            {
                type: 'content',
                title: 'O Fechamento no SPIN',
                html: true,
                content: 'O Fechamento <b>NÃO</b> deve ser o momento de mais tensão!<br/>No passo "Necessidade de Solução", o cliente já concordou que precisa de você. No fechamento, você apenas consolida tudo o que foi conversado nas letras S, P e I.<br/><br/>Faça perguntas abertas e suaves: <i>"Com base nas nossas conversas, qual o próximo passo que podemos seguir para implementar isso?"</i>.'
            },
            {
                type: 'swipecards',
                title: 'Mito ou Verdade: A Venda Consultiva',
                instruction: 'Deslize para a direita (Correto) ou esquerda (Mito) sobre Atendimento e SPIN Selling.',
                cards: [
                    { id: 'sv_1', text: 'Ao ouvir um cliente reclamar muito da fatura alta (P: Problema), devo jogar a tabela de preços do Vivo Total na cara dele.', correctIsRight: false, explanation: 'Mito! Entendemos a dor, mas falta fazer a Implicação. E se o preço estiver caro porque a equipe dele gasta desordenadamente? Analise primeiro.' },
                    { id: 'sv_2', text: 'O "S"ituação é a hora onde lemos o CNAE e o TIS para sabermos com quem estamos falando antes da dor aparecer.', correctIsRight: true, explanation: 'Correto! Fazer o "Dever de casa" no TIS te deixa pronto para a fase S do SPIN.' },
                    { id: 'sv_3', text: 'Um atendimento humanizado não pode envolver scripts, nem processos internos organizacionais.', correctIsRight: false, explanation: 'Mito! O material deixa claro: fugir do rótulo de telemarketing não isenta a TEC-B2 de seguir PROCESSOS rígidos com organização.' }
                ]
            },
            {
                type: 'accordion',
                title: 'A Lógica Visual do Funil de Relacionamento',
                instruction: 'Como dividimos o Funil B2B internamente:',
                items: [
                    { title: '1. Oportunidade (Leads / Fresh / Carteira)', content: 'Clientes do Fresh (estão em outra operadora e ativaremos) ou da Carteira (estouraram dados mensais e dão sinal para upgrade).' },
                    { title: '2. Relacionamento (SPIN)', content: 'Fase de SONDAGEM. Entender se a oportunidade é latente ou para o futuro. Classificar o cliente de forma correta e conversar.' },
                    { title: '3. Negociação', content: 'Identificamos a dor formalizando a Proposta e Enviando Contrato. O sucesso aqui é reflexo de ter escutado bem no Relacionamento.' },
                    { title: '4. Fechamento', content: 'A fase mais esperada. É o "Case de Sucesso", pois provou o vínculo de confiança construcionado nas etapas anteriores.' }
                ]
            },
            {
                type: 'content',
                title: 'O Funil: Metas de Registro da TEC-B2',
                html: true,
                content: 'A finalidade do CRM e Funil é dar <b>previsibilidade de receitas</b> e garantir segurança LGPD das conversas.<br/><br/><b>A REGRA DOS 90 DIAS:</b> Nossa expectativa é que 100% dos clientes da Carteira recebam contato de relacionamento pelo menos uma vez a cada 90 dias.<br/><br/>Isso significa que o vendedor deve bater <b>33% da sua carteira mensalmente</b> apenas gerando relacionamento proativo!'
            },
            {
                type: 'accordion',
                title: 'O Processo Oculto da Sondagem',
                instruction: 'O que o cliente fala X O que o cliente não percebe:',
                items: [
                    { title: 'Necessidades Explícitas', content: 'As fáceis. Cenários onde o cliente expressa sua dor de forma clara.\n\nExemplo: "O celular da chefia quebrou." ou "Preciso de pacote maior pois acabou a cota do office."' },
                    { title: 'Necessidades Implícitas', content: 'Cuidado extra! Dores subentendidas ou latentes.\n\nExemplo: O cliente liga insatisfeito com o setor de SAC da loja que trava. A necessidade Implícita = Ele precisa modernizar com PABX (Voz na Nuvem Vivo) no setor dele.' }
                ]
            },
            {
                type: 'carousel',
                title: 'As 8 Etapas do Processo: 1 a 4',
                slides: [
                    { title: '1. Pesquisa e Preparação', text: 'Uso do CNAE, Quantidade de Colaboradores e Planta de Produtos. Ter objetivo do contato definido na cabeça.' },
                    { title: '2. Primeiro Contato', text: 'Nome do cliente na ponta da língua! Ser breve. IMPORTANTE: Envie também o seu cartão de visita, sua carta de apresentação e deixe o WhatsApp visível.' },
                    { title: '3. Escuta Ativa', text: 'Faça perguntas relevantes. "Qual sua expectativa com meu atendimento?", "Há melhorias que eu posso puxar para vocês?"' },
                    { title: '4. Ofereça Valor (Soluções!)', text: 'Você sabe as dores, atire as soluções! Temos Mobilidade, FTTH B2B (20GB+, ticket rico), VVN, PACOTE OFFICE GoogleWorkspace, Link Dedicado (99.6% / 4h SLA) e Segurança MDM/LGPD.' }
                ]
            },
            {
                type: 'carousel',
                title: 'As 8 Etapas do Processo: 5 a 8',
                slides: [
                    { title: '5. Manutenção', text: 'O Erro Crasso é ser Reativo (responder só quando ele liga bravo). Seja PROATIVO: informe o status do pedido, avise uso alto de dados, seja o "Guardião" da conta dele.' },
                    { title: '6. Fidelização', text: 'Comunique de forma respeitosa (sem invadir a caixa de emails). Promova o programa Vivo Valoriza B2B.' },
                    { title: '7. Resolução de Conflitos', text: 'Seja Empático e Resolva rápido! Um conflito resolvido em minutos fixa um cliente. Nós da TEC-B2 possuímos Analistas Técnicos Exclusivos para você chamar e mitigar dores grandes!' },
                    { title: '8. Relacionamento a Longo Prazo', text: 'A Evolução Conjunta do B2B. A empresa dele vai crescer, precisará de Link IP maior, de Data Center, de IoT. Cresça junto com o CNPJ dele!' }
                ]
            },
            {
                type: 'drag_drop_sort',
                title: 'Desafio Prático: Sondando Necessidades',
                instruction: 'Organize a lógica impecável da Etapa de Sondagem. O que você faz antes de abrir a boca até a consolidação da venda?',
                steps: [
                    'Pesquisa Prévia: Leio o CNAE e o TIS do cliente antes de discar.',
                    'Escuta Ativa: Faço o cliente expor as Necessidades (Explícitas ou Implícitas).',
                    'Oferta de Valor: Conecto um MDM/Link Dedicado na dor que ele confessou.',
                    'Manutenção: Ligo para ele só pra avisar que a instalação foi sucesso e gerar Fidelização.'
                ]
            },
            {
                type: 'scenario',
                title: 'Simulação - Sala de Guerra B2B',
                context: 'A Imobiliária AlugaRápido ligou hoje. A Gerente Joana está uma fera. Ela perdeu duas negociações porque o sistema dela travou por queda de internet, ao mesmo tempo o telefone físico parou. Ela acusa: "A internet básica da loja atual não resolve nada. Preciso cancelar tudo ou me mudem!".',
                question: 'Como aplicar a empatia H.E.A.R.D aliada à Metodologia SPIN para converter o estresse em um Upgrade Gigante?',
                options: [
                    { text: 'A: Focar em Necessidade Explícita: Dizer "Mil desculpas, vamos arrumar a sua internet" e pedir abertura de chamado na Anatel ou na base de TI para consertar o plano dela de internet.', isCorrect: false, feedback: 'Incorreto. Você foi reativo e deixou a cliente com a mesma dor central. Ela poderá rescindir se der defeito de novo mês que vem.' },
                    { text: 'B: Listar o Catálogo de Preços: Falar "A culpa é do seu roteador antigo. Por 1.990 Reais ao mês eu te indico uma nova infra IP."', isCorrect: false, feedback: 'Incorreto. Você pulou a letram "E" (Empatia) e já fez Oferta antes de rodar o SPIN (Situação e Problema). O cliente ficará ofendido!' },
                    { text: 'C: Empregar o H.E.A.R.D para ouvir a dor. Em seguida, aplicar SPIN mostrando a Implicação Financeira. Escutar a Necessidade Implícita (Telefone parado? Pode ser Voz Na Nuvem) (Quedas? Linha de Link Dedicado). Ofertar VVN Básico + Link Avançado SLA 4h para fechar a empresa num escudo.', isCorrect: true, feedback: 'Obra Prima B2B! Você acolheu a emoção, aplicou o SPIN e achou Dores Implícitas de Backup e Telefonia IP, dobrando a receita da cliente blindando a imobiliária dela contra prejuízos.' }
                ]
            }
        ]
    },
    {
        id: 'sistemas_b2',
        title: 'Sistemas TEC-B2',
        description: 'Conheça o ecossistema de ferramentas digitais e operacionais utilizadas no dia a dia da TEC-B2 para maximizar vendas e produtividade.',
        thumbnail: '💻',
        duration: '15 min',
        modules: 5,
        departments: ['Todos'],
        content: [
            {
                type: 'carousel',
                title: 'O Ecossistema de Ferramentas',
                slides: [
                    { title: 'Simpledesk', text: 'Nossa ferramenta oficial para comunicação com nossos clientes. Com ela, centralizamos todas as conversas do WhatsApp em uma única plataforma, facilitando o dia a dia. É de uso exclusivo para relacionamento com clientes!' },
                    { title: 'Teams', text: 'Ferramenta oficial de comunicação interna. Conecta colaboradores, celebra conquistas e compartilha conhecimento. Uso restrito ao horário de expediente.' },
                    { title: 'Microsoft 365', text: 'Acesso ao e-mail corporativo, Excel, Word e diversas outras ferramentas essenciais. Segurança e foco: nunca compartilhe sua senha!' },
                    { title: 'TIS CRM', text: 'Nosso sistema de gestão exclusivo. Gerenciamento de clientes, contratos e chamados de forma integrada. O funil de vendas deve estar sempre atualizado aqui!' },
                    { title: 'Smart Vendas & Cockpit', text: 'Ferramenta Vivo para consultar viabilidade de fibra (por CNPJ/CPF). Em algumas situações, permite consulta manual via Cockpit (atenção especial a cidades com CEP único!).' },
                    { title: 'Simplifique (Estruturante)', text: 'Permite consultar clientes, identificar oportunidades, verificar faturas em aberto e calcular multas. Indispensável para visualizar ofertas de renovação (margens e planos). Sem ele, não há negociação!' },
                    { title: 'Portal (FARM)', text: 'Consultar informações de clientes para analisar a planta, faturamentos, perfil contratado e consumo. Auxilia especialmente os consultores da equipe FARM.' }
                ]
            },
            {
                type: 'swipe_cards',
                title: 'Boas Práticas: Qual sistema usar?',
                instruction: 'Deslize para a Esquerda (❌ Falso) ou para a Direita (✅ Verdadeiro). Qual é a ferramenta certa para cada situação?',
                cards: [
                    { id: 'sc_sist_1', text: 'Para falar de forma descontraída com um cliente da Vivo, devo adicioná-lo no meu WhatsApp particular e não no Simpledesk.', correctIsRight: false, explanation: 'Falso! Toda comunicação externa com o cliente deve ser feita via Simpledesk (para segurança e histórico centralizado).' },
                    { id: 'sc_sist_2', text: 'Para conversar com o setor de Qualidade Interna e Analistas da TEC-B2, devo chamá-los no Microsoft Teams.', correctIsRight: true, explanation: 'Verdadeiro! O Teams é a nossa via oficial para comunicação interna diária.' },
                    { id: 'sc_sist_3', text: 'O TIS CRM é onde atualizamos as etapas do funil de relacionamento e os chamados abertos da nossa carteira.', correctIsRight: true, explanation: 'Perfeito! O TIS consolida o relacionamento diário do vendedor com os clientes, garantindo que o pipeline fique atualizado.' },
                    { id: 'sc_sist_4', text: 'Senhas do ecossistema Microsoft podem ser compartilhadas com atendentes temporários.', correctIsRight: false, explanation: 'Jamais! A instrução é clara: segurança em primeiro lugar, nunca compartilhe credenciais.' }
                ]
            },
            {
                type: 'myth_truth',
                title: 'Mito x Verdade: Identificação Técnica',
                statements: [
                    { text: 'A ferramenta Smart Vendas é utilizada unicamente para faturamento, não tendo utilidade de pesquisa prévia.', isMyth: true, explanation: 'Mito! O Smart Vendas é focado exatamente em consultar VIABILIDADE de fibra e de produtos Vivo via CPF/CNPJ.' },
                    { text: 'Se no Smart Vendas der "Sem Viabilidade" para um CEP único, eu não posso fazer mais nada e perco a venda.', isMyth: true, explanation: 'Falso! Você pode realizar a consulta manual pelo Cockpit e abrir um chamado de análise de cadastro para tentar aprovar a viabilidade.' },
                    { text: 'É possível realizar uma negociação de renovação (margens e planos) sem consultar a ferramenta Simplifique.', isMyth: true, explanation: 'Mito gigantesco! O Simplifique é indispensável e estruturante: sem ele, não tem como calcular multas nem ver ofertas e margens para bater o martelo.' }
                ]
            },
            {
                type: 'drag_drop_sort',
                title: 'Organizando a Ferramenta Pelo Objetivo',
                instruction: 'Combine a ferramenta exata com o seu propósito de uso na rotina TEC-B2:',
                steps: [
                    'WhatsApp c/ Cliente: Simpledesk',
                    'Chat Interno & Notícias: Microsoft Teams',
                    'Visualizar Funil & Contratos: TIS CRM',
                    'Consulta Viabilidade de Fibra: Smart Vendas (e Cockpit para manuais)'
                ]
            },
            {
                type: 'scenario',
                title: 'Desafio FARM: Analisando o Cliente',
                context: 'A consultora Maria da equipe FARM assumiu uma carteira de 150 clientes recentemente. Um deles, a Padaria Pão Quente, está reclamando do alto valor no faturamento dos dados móveis devido a estouro de pacote todos os meses, e ameaçou ir para a concorrência.',
                question: 'Qual é a jogada de Mestre utilizando os Sistemas da TEC-B2 para virar o jogo?',
                options: [
                    { text: 'A) Atualizar os dados do TIS e aguardar que ele entre em contato pedindo o cancelamento de fato para depois ofertar desconto.', isCorrect: false, feedback: 'Incorreto. Ações passivas na retenção não ajudam e a concorrência agirá primeiro.' },
                    { text: 'B) Abrir o Portal para analisar o relatório completo de consumo/perfil e, munida dessas informações, abrir o Simplifique para validar cálculo de multa e encaixar um Upgrade de pacote que abaixe o custo do GB e prenda ele na Vivo.', isCorrect: true, feedback: 'Fantástico! Usou o Portal (FARM) para mapear consumo + Simplifique (Renovação) para achar margem e blindar o cliente com um Upgrade Win-Win.' },
                    { text: 'C) Consultar o Cockpit para tentar aprovar uma viabilidade de Fibra que resolva o uso do pacote de dados da rua.', isCorrect: false, feedback: 'Incorreto. Fibra é fixa; dados móveis de rua não são convertidos para Fibra em um cenário de mobilidade.' }
                ]
            }
        ]
    },
    {
        id: 'planejamento_tempo_vendas',
        title: 'Planejamento de Tempo e Produtividade',
        description: 'Aprenda a organizar seu dia, gerenciar seu Funil de Vendas e definir metas estratégicas utilizando a Pirâmide de Produtividade.',
        thumbnail: '⏳',
        duration: '25 min',
        modules: 13,
        departments: ['Vendas', 'Todos'],
        content: [
            {
                type: 'image_content',
                title: 'A Pirâmide de Produtividade',
                imageSrc: '/images/courses/prod_slide_1.png',
                content: '<p><strong>Dicas para planejar seu tempo</strong><br>O sucesso das suas vendas começa na base da nossa pirâmide: <strong>O Planejamento</strong>.</p>'
            },
            {
                type: 'image_content',
                title: '1. Funil de Vendas e 2. Retornos',
                imageSrc: '/images/courses/prod_slide_2.png',
                content: '<p><strong>1 FUNIL DE VENDAS</strong><br>Comece o seu dia analisando o funil de vendas, organize seus retornos e avalie sua capacidade de fechamento. Você precisa entender a capacidade de produção para o dia. Gerar previsibilidade lhe ajudará a atingir os indicadores. Participe das negociações mais importantes.</p><p><strong>2 RETORNOS</strong><br>Agora, vamos organizar seus retornos do dia. Seguir a base de retornos lhe ajudará a manter sua carteira em dia. Este é um ponto importante na sua jornada de gestão: gerenciar os retornos é essencial para gerar oportunidades.</p>'
            },
            {
                type: 'image_content',
                title: '3. Pedidos e 4. Estratégia',
                imageSrc: '/images/courses/prod_slide_3.png',
                content: '<p><strong>3 PEDIDOS</strong><br>Verifique seus pedidos e fique atento aos status AG, ACEITE e SOLUÇÃO CONSULTOR. Trate as demandas e siga para o próximo passo. Gerencie os pedidos reprovados por crédito. Tornar sua produtividade eficiente significa tratar seus pedidos com atenção. Aproveite este momento para debater soluções para cada caso.</p><p><strong>4 ESTRATÉGIA</strong><br>Chegou o momento de planejar seu dia: entender qual perfil de cliente você irá abordar e definir suas metas de prospecção. Sua participação aqui é fundamental para tornar o dia produtivo. Fique atento às oportunidades que sua lista de clientes pode gerar. Garantir que a proposta de trabalho foi executada é um grande trunfo para o sucesso da estratégia.</p>'
            },
            {
                type: 'image_content',
                title: 'Prospecção',
                imageSrc: '/images/courses/prod_slide_4.png',
                content: '<p><strong>Prospecção:</strong> Execute suas tarefas com foco e dedicação para alcançar os melhores resultados.</p>'
            },
            {
                type: 'image_content',
                title: '5. Métricas',
                imageSrc: '/images/courses/prod_slide_5.png',
                content: '<p><strong>5 MÉTRICAS</strong><br>Tenha objetivos bem definidos, é importante ter ao menos 5 oportunidades quentes, criadas durante sua jornada, buscando abrir negociações em todos os seus indicadores.</p><p>Tenha metas claras e objetivas de prospecção. Pouco adianta apenas contatar o cliente sem um processo de abordagem bem definido. Entender o perfil do cliente é essencial para planejar seu dia. Devemos iniciar o dia de trabalho com, no mínimo, R$ 2.500,00 (por consultor) no funil, mantendo atenção aos produtos necessários para a composição da meta. Em resumo, os contatos devem gerar oportunidades. Não adianta contatar sem um objetivo claro e definido!</p><p><strong>Seu dia não pode encerrar sem, ao menos, 5 novas negociações. Esse será o ponto de partida para o sucesso dos seus resultados.</strong></p>'
            },
            {
                type: 'image_content',
                title: '6. Pesquisa e Abordagem',
                imageSrc: '/images/courses/prod_slide_6.png',
                content: '<p><strong>6 PESQUISA/ABORDAGEM</strong><br>Uma boa abordagem pode reduzir significativamente o caminho para a conquista. Buscar maneiras humanizadas e demonstrar conhecimento é fundamental para construir uma negociação sólida. Aplique todo o seu conhecimento sobre os produtos e, principalmente, sobre as características do negócio do cliente.</p><p>Certifique-se que o processo de abordagem e pesquisa está sendo executado, entenda se o consultor está utilizando PROMPT de forma adequada e se o mesmo está utilizando e/ou realizando os processos adequadamente.</p><p>O prompt é um excelente recurso para conhecer melhor o seu cliente. Utilize prova social, referências de concorrentes e possíveis soluções. Crie um elo entre as soluções, o atendimento e as necessidades do cliente. Deixe claro o motivo da escolha do produto, seus valores e, principalmente, o quanto ele pode contribuir para o sucesso do negócio.</p><p>Não se esqueça de entender as principais necessidades do cliente e suas maiores dificuldades, trazendo analogias entre nossos produtos e as soluções que podem ser aplicadas.</p>'
            },
            {
                type: 'image_content',
                title: 'Negociações',
                imageSrc: '/images/courses/prod_slide_7.png',
                content: '<p><strong>Negociações:</strong> Uma negociação eficaz exige ouvir atentamente, compreender as necessidades do cliente e oferecer soluções que agreguem valor para ambos os lados.</p>'
            },
            {
                type: 'image_content',
                title: '7. Negociação',
                imageSrc: '/images/courses/prod_slide_8.png',
                content: '<p><strong>7 NEGOCIAÇÃO</strong><br>Lembrar que uma boa negociação é aquela que ambos os lados saem feliz, para isso ocorrer é fundamental que os ciclos 1 a 6 tenham sido executados de forma correta, somente desta forma você terá capacidade de construir uma negociação de valor.</p><p>Participe ativamente das negociações e da construção de propostas. Esta é a melhor forma de entender como as negociações estão sendo conduzidas e como seu time está direcionando o processo, estando apto a intervir em casos de negativas ou dificuldades em negociações pontuais.</p><p>Tenha em mente o que caracteriza uma negociação ou um acréscimo de serviço. Negociar é construir soluções. Geralmente, a construção de uma negociação resulta em um ticket médio maior, enquanto adicionar um produto não trará muitos recursos de receita adicional. Por isso, construa suas negociações com cuidado. Você verá o resultado de uma negociação bem construída quando o cliente começar a utilizar a solução. Isso gerará um relacionamento de longo prazo, e você terá um comprador por muito tempo!</p>'
            },
            {
                type: 'image_content',
                title: '8. Propostas',
                imageSrc: '/images/courses/prod_slide_9.png',
                content: '<p><strong>8 PROPOSTAS</strong><br>Aqui iniciamos uma etapa importante: confeccionar a proposta é muito mais do que enviar um orçamento. Este é o momento que definirá o sucesso da sua abordagem. Entender os pontos críticos e as possíveis melhorias é fundamental para uma proposta bem elaborada, gerando maior aceitação por parte do cliente.</p><p>Participe da elaboração e do envio da proposta, certificando-se de que ela atende às necessidades do cliente, possui clareza e está alinhada com a abordagem realizada. Acompanhe a comunicação através do SIMPLES DESK e verifique se está de acordo com as expectativas do cliente.</p><p>Lembre-se de que preço e qualidade nem sempre estão alinhados. A proposta deve agregar valor. É possível encontrar margem em outras categorias de produtos, assim você evita desvalorizar sua renovação, entregando tanto qualidade quanto preço.</p><p>Após enviar suas propostas, atualize seu funil de vendas. Mantenha-o abastecido com informações relevantes sobre a conversa que teve com o cliente. Dessa forma, você poderá acompanhar e contornar diversas situações.</p>'
            },
            {
                type: 'image_content',
                title: 'Venda',
                imageSrc: '/images/courses/prod_slide_10.png',
                content: '<p><strong>Venda:</strong> Uma venda bem-sucedida não se resume ao fechamento do negócio, mas à construção de confiança e valor para o cliente.</p>'
            },
            {
                type: 'image_content',
                title: '9. Finalização',
                imageSrc: '/images/courses/prod_slide_11.png',
                content: '<p><strong>9 FINALIZAÇÃO</strong><br>Lembrar que uma boa negociação é aquela que ambos os lados saem feliz, para isso ocorrer é fundamental que os ciclos 1 a 6 tenham sido executados de forma correta, somente desta forma você terá capacidade de construir uma negociação de valor.</p><p>Participe ativamente das negociações e da construção de propostas. Esta é a melhor forma de entender como as negociações estão sendo conduzidas e como seu time está direcionando o processo, estando apto a intervir em casos de negativas ou dificuldades em negociações pontuais.</p><p>Tenha em mente o que caracteriza uma negociação ou um acréscimo de serviço. Negociar é construir soluções. Geralmente, a construção de uma negociação resulta em um ticket médio maior, enquanto adicionar um produto não trará muitos recursos de receita adicional. Por isso, construa suas negociações com cuidado. Você verá o resultado de uma negociação bem construída quando o cliente começar a utilizar a solução. Isso gerará um relacionamento de longo prazo, e você terá um comprador por muito tempo!</p>'
            },
            {
                type: 'drag_drop_sort',
                title: 'A Ordem da Produtividade Matinal',
                instruction: 'Arraste os itens para colocá-los na ordem ideal de execução no início do seu dia (do Passo 1 ao Passo 5):',
                steps: [
                    'Analisar Funil de Vendas',
                    'Organizar Retornos da Carteira',
                    'Verificar Status de Pedidos Antigos',
                    'Definir Estratégia e Perfil de Abordagem',
                    'Buscar Bater as Métricas (5 Oportunidades Quentes)'
                ]
            },
            {
                type: 'scenario',
                title: 'Desafio Prático: A Rotina do Consultor',
                context: 'O consultor João chegou na empresa às 08:30. Ele imediatamente pegou o telefone e começou a ligar para clientes novos aleatórios da sua lista, sem olhar o TIS CRM, esperando "dar sorte" para bater os R$ 2.500 do dia.',
                question: 'Segundo a nossa Pirâmide e Passos de Produtividade, qual foi o erro de João e o que ele deveria ter feito primeiro?',
                options: [
                    { text: 'A) Ele errou em ligar para clientes novos. Ele deveria ligar apenas para os mesmos clientes que compraram no mês passado.', isCorrect: false, feedback: 'Incorreto. A prospecção de novos clientes é importante.' },
                    { text: 'B) João não errou. Ligar o mais rápido possível garante que ele fale com mais pessoas.', isCorrect: false, feedback: 'Incorreto. Agir sem planejamento gera esforço sem resultado previsível.' },
                    { text: 'C) Ele pulou a base da Pirâmide (Planejamento). Antes de prospectar, ele deveria ter olhado o Funil de Vendas para ver retornos e pedidos pendentes, e então traçar uma estratégia e os R$ 2.500 de meta.', isCorrect: true, feedback: 'Exato! A Base da Pirâmide é o Planejamento. Olhar o funil, retornos e organizar a estratégia antes da ação é a chave do sucesso B2B.' }
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
