export const coursesData = [
    {
        id: "intro-recursos-humanos",
        title: "Introdu├º├úo RH: Bem-vindo ├á TEC-B2",
        description: "Nossa Empresa, Banco de Horas, Benef├¡cios, ├ëtica e LGPD.",
        duration: "40 min",
        icon: "­ƒÅó",
        departments: ["Todos"], // Libera para todos
        modules: [
            {
                type: 'carousel',
                title: 'Nossa Empresa e Vis├úo',
                slides: [
                    {
                        title: 'Seja Bem-vindo!',
                        text: 'Somos a Tec-B2, um parceiro autorizado Vivo Empresas. Fazemos parte de uma das maiores empresas de telecomunica├º├Áes do mundo.\n\nAo entrar em nosso universo, voc├¬ descobrir├í um mundo de solu├º├Áes e inova├º├Áes, oferecendo desde op├º├Áes b├ísicas como mobilidade e banda larga, at├® solu├º├Áes robustas de TI e produtividade.'
                    },
                    {
                        title: 'Nosso Prop├│sito Juntos',
                        text: 'Agora que voc├¬ chegou para somar ao nosso time e fazer parte de um mercado em constante crescimento, a Tec-B2, como parceiro estrat├®gico da Vivo, quer seguir ao seu lado sendo refer├¬ncia em qualidade.\n\nJuntos, queremos fortalecer e crescer, acreditando que as pessoas s├úo o motor do sucesso.'
                    }
                ]
            },
            {
                type: 'content',
                title: 'Manuais e Termos',
                content: 'Nossa empresa possui termos de ci├¬ncia que devem ser assinados por todos os colaboradores, os quais abordam o uso adequado de ferramentas e equipamentos, al├®m do Manual do Colaborador. Esses documentos t├¬m como objetivo assegurar que todos estejam cientes das responsabilidades associadas ao uso dos recursos da empresa, das pol├¡ticas internas e dos procedimentos de seguran├ºa.'
            },
            {
                type: 'content',
                title: 'Identidade Visual e Canais',
                html: true,
                content: 'Nossa Identidade Visual reflete nossa marca e presen├ºa digital. Acompanhe nossos canais oficiais para ficar por dentro das novidades:\n\n<div style="display:flex; flex-direction:column; align-items:center; gap: 1rem; margin-top:2rem;"><div>­ƒîÉ <a href="http://TECB2.COM.BR" target="_blank" style="color:var(--primary-color);text-decoration:none;font-weight:bold;">TECB2.COM.BR</a></div><div>­ƒô© <a href="https://instagram.com/TECB2B" target="_blank" style="color:var(--primary-color);text-decoration:none;font-weight:bold;">@TECB2B</a></div></div>'
            },
            {
                type: 'accordion',
                title: 'Regras de Ponto e Pagamentos',
                instruction: 'Clique nos itens para ler as regras fundamentais de aus├¬ncias e recebimentos.',
                items: [
                    { icon: 'ÔÅ│', title: 'Banco de Horas', content: 'Em casos de horas extras ou de saldo de horas deliberado pela empresa, os mesmos ser├úo computados no banco de horas.' },
                    { icon: '­ƒôä', title: 'Falta Justificada', content: 'Em casos de falta justificada (conforme a lei de abono), o documento comprobat├│rio dever├í ser enviado ao RH em at├® 48 horas.' },
                    { icon: 'ÔÜá´©Å', title: 'Falta N├úo Justificada', content: 'Ocorre quando um funcion├írio se ausenta sem apresentar motivo v├ílido ou atestado. Gera descontos de: Vale Transporte, Vale Refei├º├úo, DSR e reflexos nas F├®rias.' },
                    { icon: '­ƒÆ░', title: 'Pagamento de Sal├írio', content: 'Ocorre sempre no 5┬║ DIA ├ÜTIL. A conta banc├íria da empresa ├® vinculada ao Ita├║.' },
                    { icon: '­ƒì¢´©Å', title: 'Benef├¡cios (VR/VT)', content: 'Os cr├®ditos de Vale Refei├º├úo (Alelo) e Vale Transporte s├úo depositados no DIA 10.' },
                    { icon: '­ƒÅå', title: 'Premia├º├Áes', content: 'A apura├º├úo e pagamento das Premia├º├Áes tamb├®m ocorrem no DIA 10.' },
                    { icon: '­ƒÆ╗', title: 'Equipamentos', content: '├ë responsabilidade do colaborador zelar pelo cuidado e uso adequado dos equipamentos fornecidos.' }
                ]
            },
            {
                type: 'timeline',
                title: 'Cart├úo Ponto: A Jornada de Trabalho',
                instruction: 'Os quatro registros do cart├úo-ponto s├úo fundamentais para garantir o controle eficiente da jornada (CLT). Acompanhe a ordem di├íria:',
                steps: [
                    {
                        title: '1. Entrada (In├¡cio da Jornada)',
                        description: 'Marca o in├¡cio exato do seu expediente.',
                        imageUrl: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=400&q=80' // Office entry/morning
                    },
                    {
                        title: '2. Sa├¡da para Intervalo',
                        description: 'Indica o in├¡cio da pausa para o seu almo├ºo ou descanso.',
                        imageUrl: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&q=80' // Lunch break / relax
                    },
                    {
                        title: '3. Retorno do Intervalo',
                        description: 'Marca o fim do intervalo e o seu retorno efetivo ao trabalho.',
                        imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&q=80' // Back to desk
                    },
                    {
                        title: '4. Sa├¡da (T├®rmino da Jornada)',
                        description: 'Registra o fim do seu expediente di├írio e encerra as horas do dia.',
                        imageUrl: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=400&q=80' // Leaving office / sunset
                    }
                ]
            },
            {
                type: 'content',
                title: 'Ferramentas de Uso Di├írio',
                content: 'Em nosso dia a dia organizat├│rio, voc├¬ lidar├í diretamente com o Microsoft Teams, que ├® nossa plataforma mandat├│ria para agilizar a comunica├º├úo di├íria, permitindo tamb├®m o compartilhamento de informativos, alinhamentos e o registro de Feedbacks.\n\nAl├®m disso, voc├¬ utilizar├í o CRM TIS, que ├® o sistema pr├│prio da TEC-B2 (para o qual voc├¬ ter├í um treinamento exclusivo e detalhado em breve, pois estamos desenvolvendo uma nova vers├úo otimizada).\n\nPara o atendimento direto aos clientes e conversas atrav├®s dos nossos n├║meros oficiais, utilizamos a plataforma SimplesDesk.'
            },
            {
                type: 'webhook_form',
                title: 'Solicita├º├úo de E-mail Corporativo',
                instruction: 'Preencha os dados abaixo. Eles ser├úo enviados diretamente para nossa equipe de tecnologia para a cria├º├úo da sua conta oficial.',
                webhookUrl: 'https://hook.us2.make.com/e7e0otybmp16gv7wnklulwuav583w1h1'
            },
            {
                type: 'content',
                title: 'O Ambiente de Trabalho (Responsabilidade)',
                content: 'A Responsabilidade Coletiva trata da preserva├º├úo do ambiente e patrim├┤nio da empresa. Zelar pelos objetos, equipamentos e im├│veis evita preju├¡zos e reflete em benef├¡cios para n├│s mesmos. Por├®m, existem proibi├º├Áes claras sobre atitudes nas esta├º├Áes de trabalho e uso de celulares.'
            },
            {
                type: 'scenario',
                title: 'Simula├º├úo - Atitude e Celular',
                context: 'No meio do seu expediente, o seu projeto atual sofreu um atraso brusco na comunica├º├úo do cliente. Voc├¬ est├í ocioso h├í 30 min aguardando resposta. Seu colega da mesa ao lado o convida para ver um v├¡deo engra├ºado no celular rapidamente.',
                question: 'Qual atitude voc├¬ deve tomar?',
                options: [
                    { text: 'Concordar em ver o v├¡deo rapidamente, contanto que ambos mantenham o volume baixo para n├úo perturbar a esta├º├úo de trabalho.', isCorrect: false, feedback: 'Errado! O uso do celular e distra├º├Áes nas esta├º├Áes de trabalho s├úo proibidos, independentemente do volume.' },
                    { text: 'Sair da esta├º├úo de trabalho e ir para o refeit├│rio com o colega para fazer um lanche, retornando assim que o cliente responder o e-mail.', isCorrect: false, feedback: 'Incorreto. Abandonar a esta├º├úo de trabalho fora do hor├írio de intervalo agrava o problema.' },
                    { text: 'Excepcionalmente, usar o computador da empresa para ler not├¡cias at├® o cliente responder, j├í que o uso do celular na baia ├® irregular.', isCorrect: false, feedback: 'Falso. O computador da empresa ├® ferramenta exclusiva de trabalho e n├úo deve ser usado para entretenimento.' },
                    { text: 'Declinar gentilmente o convite e aproveitar a ociosidade do gargalo para adiantar ou revisar outras demandas via Teams.', isCorrect: true, feedback: 'Perfeito. Essa atitude reflete responsabilidade coletiva e prioriza├º├úo do uso correto dos equipamentos.' },
                ]
            },
            {
                type: 'avatar_balloons',
                title: 'Nossos 10 Princ├¡pios da ├ëtica',
                instruction: 'Avance os cards para interagir com a Mentoria Virtual e aprender sobre Nossos Princ├¡pios de ├ëtica em detalhes.',
                avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
                balloons: [
                    { icon: '­ƒñØ', title: 'Ser Honesto e Transparente', content: 'Falar a verdade e agir com clareza em todas as situa├º├Áes.' },
                    { icon: 'Ô£ö´©Å', title: 'Assumir Responsabilidades', content: 'Reconhecer os pr├│prios erros e aprender com eles, buscando sempre melhorar.' },
                    { icon: '­ƒæÑ', title: 'Respeitar os Outros', content: 'Tratar todos com dignidade, independ├¬ncia de posi├º├úo, ra├ºa, g├¬nero ou cren├ºas.' },
                    { icon: 'ÔÜû´©Å', title: 'Agir com Justi├ºa', content: 'Ser imparcial e justo nas decis├Áes, sem favorecimento ou discrimina├º├úo.' },
                    { icon: '­ƒöÆ', title: 'Confidencialidade', content: 'Manter em sigilo as informa├º├Áes pessoais e profissionais, respeitando a privacidade e seguran├ºa dos dados.' },
                    { icon: '­ƒøí´©Å', title: 'Demonstrar Lealdade', content: 'Cumprir com os deveres e compromissos assumidos com a organiza├º├úo, clientes e colegas.' },
                    { icon: '­ƒÜ½', title: 'Evitar Conflitos', content: 'N├úo se envolver em situa├º├Áes onde interesses pessoais possam comprometer decis├Áes profissionais.' },
                    { icon: '­ƒîƒ', title: 'Promover Bem Comum', content: 'Agir para o benef├¡cio coletivo e tomar decis├Áes que tragam impactos positivos.' },
                    { icon: '­ƒô£', title: 'Respeitar as Leis', content: 'Seguir as normas estabelecidas e cumprir todas as leis aplic├íveis ao setor e ├á sociedade.' },
                    { icon: '­ƒÜÇ', title: 'Desenvolvimento', content: 'Manter-se atualizado e capacitado para agir de forma ├®tica e competente em um ambiente em constante mudan├ºa.' }
                ]
            },
            {
                type: 'video',
                title: 'Reflex├úo Importante: ├ëtica',
                description: 'Assista ao v├¡deo do fil├│sofo Mario Sergio Cortella sobre ├ëtica e Integridade (Obrigat├│rio).',
                videoId: 'SOY2BIapESA',
                requireDelay: 180
            },
            {
                type: 'carousel',
                title: 'Dicas Importantes & LGPD',
                slides: [
                    {
                        title: 'Pontualidade e Proatividade',
                        text: '1. Cumprir hor├írios demonstra responsabilidade e respeito pelos colegas e pela organiza├º├úo. Planejar-se antecipadamente evita atrasos e imprevistos.\n\n2. Antecipar-se ├ás necessidades da equipe, sugerindo solu├º├Áes e melhorias mostra comprometimento e fortalece a confian├ºa da equipe.'
                    },
                    {
                        title: 'Seguran├ºa e LGPD',
                        text: '3. A LGPD estabelece diretrizes rigorosas para coletar, armazenar e tratar dados. Todos t├¬m um papel essencial. Evite compartilhar informa├º├Áes sens├¡veis em ambientes inseguros.\n\n4. Sigilo e Discri├º├úo: Manter a confidencialidade de informa├º├Áes pessoais e profissionais garante a confian├ºa. N├úo discutir assuntos do trabalho em p├║blico.'
                    },
                    {
                        title: 'Postura e Ferramentas',
                        text: '5. Autocontrole: Saber gerenciar emo├º├Áes, evitar impulsividade e manter a calma.\n\n6. Contatos: N├úo fornecer contatos pessoais (celular/whatsapp) a clientes ou times fora do c├¡rculo necess├írio para preservar sua privacidade.\n\n7. Comunica├º├úo: Uso EXCLUSIVO pelo Microsoft Teams garante seguran├ºa. N├úo crie grupos de WhatsApp para o trabalho!'
                    }
                ]
            },
            {
                type: 'swipecards',
                title: 'Mito ou Verdade? (Deslize)',
                instruction: 'Arraste as cartas para a ESQUERDA se for um Mito/Falso, ou para a DIREITA se for Verdade/Correto.',
                cards: [
                    { text: 'A comunica├º├úo de trabalho deve ser concentrada no WhatsApp porque ├® mais r├ípido.', isCorrect: false },
                    { text: 'Tratar dados ├® uma op├º├úo de cada departamento, o Microsoft Teams n├úo ├® obrigat├│rio.', isCorrect: false },
                    { text: 'Nunca fornecer telefones pessoais, zelar pelas senhas e usar o Teams ├® regra.', isCorrect: true },
                    { text: 'Se um colega me pedir a senha para resolver uma pend├¬ncia urgente, devo passar.', isCorrect: false },
                    { text: 'O Vale Refei├º├úo (VR) e Vale Transporte (VT) s├úo depositados sempre no dia 10.', isCorrect: true }
                ]
            },
            {
                type: 'open_question',
                title: 'Desafio Descritivo (Parte 1: O Fato)',
                context: 'Imagine o seguinte cen├írio na TEC-B2:\nVoc├¬ est├í almo├ºando em um restaurante pr├│ximo ├á empresa, cheio de clientes e outras pessoas.\n\nDe repente, voc├¬ ouve dois colegas de outro setor discutindo abertamente em voz alta sobre os dados salariais e de benef├¡cios de um colaborador espec├¡fico rec├®m-contratado.',
                question: 'Considerando as regras de LGPD e Confidencialidade, qual o grande risco que esses colegas est├úo trazendo para a imagem da empresa e a privacidade do funcion├írio neste exato momento?'
            },
            {
                type: 'open_question',
                title: 'Desafio Descritivo (Parte 2: A Atitude)',
                context: 'Ainda no mesmo cen├írio do restaurante, voc├¬ percebe que um desses dois colegas tem o celular aberto, em cima da mesa, mostrando exatamente um trecho do sistema interno que eles esqueceram de fechar.',
                question: 'Sendo um colaborador ├®tico, como voc├¬ lidaria ativamente com essa situa├º├úo? Descreva qual seria a sua atitude ali na hora ou como voc├¬ levaria isso para a lideran├ºa deles.'
            }
        ]
    },
    {
        id: "onboarding-rh",
        title: "Onboarding Especialista RH",
        description: "Processos internos, folha e gest├úo de benef├¡cios da TEC-B2.",
        duration: "20 min",
        icon: "­ƒæÑ",
        departments: ["RH"], // Apenas para quem logar como RH
        modules: [
            {
                type: 'content',
                title: 'Gest├úo de Benef├¡cios',
                content: 'Todos os benef├¡cios devem ser solicitados via sistema centralizado at├® o dia 15 de cada m├¬s.'
            },
            {
                type: 'quiz',
                question: 'At├® que dia os benef├¡cios devem ser solicitados?',
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
        description: 'Domine a m├®trica R$ FRESH, conhe├ºa as Torres de Venda da Vivo (M├│vel, FTTH, Avan├ºada, etc) e a L├│gica de Atendimento B2B.',
        duration: '15 min',
        icon: '­ƒôê',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400',
        departments: ['Todos'], // Aberto para todos conforme solicitado
        modules: [
            {
                type: 'content',
                title: 'Introdu├º├úo: A B├║ssola do Vendedor',
                content: 'Os indicadores para um vendedor s├úo ferramentas essenciais para medir o desempenho e auxiliar na melhoria cont├¡nua das vendas. Eles oferecem informa├º├Áes precisas sobre diferentes aspectos da atua├º├úo e ajudam a tomar decis├Áes informadas para atingir suas metas financeiras e premia├º├Áes.'
            },
            {
                type: 'accordion',
                title: 'As 8 Finalidades dos Indicadores',
                instruction: 'Acesse cada finalidade para compreender a import├óncia do monitoramento.',
                items: [
                    { title: 'Avaliar Desempenho', content: 'Mede como o vendedor atinge metas de vendas, capta├º├úo de clientes, valor total e taxa de convers├úo.' },
                    { title: 'Padr├Áes e Tend├¬ncias', content: 'Identifica produtos mais vendidos, melhores estrat├®gias e per├¡odos mais produtivos.' },
                    { title: 'Melhorar a Performance', content: 'Otimiza tempo e abordagem acompanhando tempo de fechamento e taxas de follow-up.' },
                    { title: 'Foco nas Metas', content: 'Garante que as a├º├Áes di├írias estejam focadas nas metas de faturamento e leads.' },
                    { title: '├üreas de Melhoria', content: 'Aponta o que deve melhorar quando algo n├úo atinge a expectativa.' },
                    { title: 'Crescimento Profissional', content: 'O aumento do ticket m├®dio ajuda a reconhecer virtudes e a indicar necessidade de treinamentos.' },
                    { title: 'Decis├Áes Estrat├®gicas', content: 'Baseia as mudan├ºas e escolhas dos vendedores e gestores em fatos e dados concretos.' },
                    { title: 'Motiva├º├úo', content: 'Acompanhar seus pr├│prios resultados motiva e ├® base para o sistema de remunera├º├úo e pr├¬mios.' }
                ]
            },
            {
                type: 'content',
                title: 'O Gatilho da Premia├º├úo: R$ FRESH',
                html: true,
                content: 'O pilar do nosso neg├│cio ├® a R$ FRESH (Novas Receitas), com um par├ómetro de R$ 1.800,00. Este indicador ├® o gatilho da sua pol├¡tica de premia├º├úo; em resumo, ele ├® o ponto de partida para voc├¬ faturar. No entanto, realizar receita sem o cumprimento dos indicadores pode se transformar em um processo sem rentabiliza├º├úo, pois, assim como o seu modelo de premia├º├úo, a TEC-B2 tamb├®m necessita entregar torres de produtos para gerar rentabilidade.<br/><br/>Neste indicador, as vendas de novos produtos nas torres s├úo indispens├íveis. Portanto, fique atento ├ás torres necess├írias para o cumprimento da R$ FRESH e esteja alinhado com seu gestor para manter sua premia├º├úo com as melhores porcentagens.<br/><br/>Nem todos os processos realizados com os clientes geram R$ FRESH. Um exemplo disso ├® a renova├º├úo, que, apesar de ser um indicador, n├úo conta como R$ FRESH, mas gera oportunidades para captar novas receitas.<br/><br/>Dessa forma, ├® importante que voc├¬ fique atento ├ás oportunidades e ├á R$ FRESH gerada. Veja nos pr├│ximos slides as torres e tipos de clientes que geram R$ FRESH:'
            },
            {
                type: 'carousel',
                title: 'As Torres de Venda (Parte 1)',
                slides: [
                    { title: '­ƒô▒ ALTA M├ôVEL', text: 'Movimento no incremento e/ou venda de novas linhas m├│veis, sempre que a venda ocorrer nas modalidades de NOVO, INCREMENTO e PORTABILIDADE, seguindo as premissas de Segmento e DDD. A linha ir├í rentabilizar como R$ FRESH e Pontua├º├úo. Acompanhe este indicador, pois ele ├® fundamental no seu simulador de premia├º├úo. Entregar este indicador lhe trar├í rentabiliza├º├úo, aumentar├í seu parque m├│vel e proporcionar├í maior rentabiliza├º├úo no m├®dio e longo prazo!<br/><br/><ul style="padding-left: 20px; text-align: left; list-style-type: disc;"><li><b>TORRE:</b> M├ôVEL</li><li><b>CLIENTE:</b> NOVO, INCREMENTO, PORTABILIDADE</li><li><b>SEGMENTO:</b> PME (Pequenas e M├®dias Empresas)</li><li><b>DDD:</b> 51, 53, 54, 55</li><li><b>TCM (Ticket Central M├®dio/Ticket M├®dio) PRODUTO:</b> R$ 52,50</li><li><b>MELHOR PERFIL:</b> 1 a 2 at├® ACIMA DE 500 COLABORADORES</li></ul><p style="text-align: left; font-size: 0.9em; margin-top: 10px;"><i>*CLIENTE QUE S├ô POSSUI B├üSICA ├ë OPORTUNIDADE EXTRA</i></p>' },
                    { title: '­ƒîÉ FTTH', text: 'A "menina dos olhos" da VIVO nos ├║ltimos 5 anos foi o investimento em tecnologia de fibra (Fiber To The Home - Fibra at├® a empresa). O que possibilitou a amplia├º├úo da viabilidade e se tornou uma fonte de rentabiliza├º├úo para vendedores e parceiros. Este indicador ├® pe├ºa-chave na sua pol├¡tica de premia├º├úo e deve receber um cuidado especial. N├úo trabalhe com o limite da meta, pois poder├í ocorrer desist├¬ncias ou inviabilidades. Dessa forma, voc├¬ n├úo comprometer├í seu m├¬s.<br/><br/><ul style="padding-left: 20px; text-align: left; list-style-type: disc;"><li><b>TORRE:</b> FTTH</li><li><b>CLIENTE:</b> NOVO, INCREMENTO</li><li><b>SEGMENTO:</b> PME</li><li><b>DDD:</b> 51, 53, 54, 55</li><li><b>TCM PRODUTO:</b> R$ 91,50</li><li><b>MELHOR PERFIL:</b> 1 a 2 at├® ACIMA DE 500 COLABORADORES</li></ul><p style="text-align: left; font-size: 0.9em; margin-top: 10px;"><i>*CLIENTE QUE S├ô POSSUI M├ôVEL ├ë OPORTUNIDADE EXTRA</i></p>' },
                    { title: '­ƒùú´©Å VVN (Voz na Nuvem)', text: 'Uma solu├º├úo revolucion├íria que n├úo depende de barreiras estruturais e est├í dispon├¡vel em mais de 75% do territ├│rio ga├║cho. Al├®m de ser inovadora, a solu├º├úo ├® um grande aliado para o seu faturamento. Com modula├º├Áes e descontos por volume, o produto possibilita, em uma ├║nica negocia├º├úo, alcan├ºar sua meta e rentabilizar clientes que n├úo possuem oportunidade de venda de Mobilidade e FTTH.<br/><br/><ul style="padding-left: 20px; text-align: left; list-style-type: disc;"><li><b>TORRE:</b> VVN</li><li><b>CLIENTE:</b> NOVO, INCREMENTO, PORTABILIDADE</li><li><b>SEGMENTO:</b> PME</li><li><b>DDD:</b> 51, 53, 54, 55</li><li><b>TCM PRODUTO:</b> R$ 47,80</li><li><b>TURBINE:</b> GRAVA├ç├âO, URA (Unidade de Resposta Aud├¡vel), M├ôDULO TEAMS</li><li><b>MELHOR PERFIL:</b> 1 a 2 at├® ACIMA DE 500 COLABORADORES</li></ul>' }
                ]
            },
            {
                type: 'carousel',
                title: 'As Torres de Venda (Parte 2)',
                slides: [
                    { title: '­ƒÆ╗ DIGITAL', text: 'Uma das torres com o maior n├║mero de possibilidades. Apesar de um ticket m├®dio baixo, as solu├º├Áes da MICROSOFT, GOOGLE, MDM (Mobile Device Management) e outras s├úo produtos eficientes para a composi├º├úo da R$ FRESH. Sem contar a possibilidade de encontrar projetos com alto valor agregado, abrindo portas para grandes negocia├º├Áes. Descubra o que seu cliente realmente utiliza!<br/><br/><ul style="padding-left: 20px; text-align: left; list-style-type: disc;"><li><b>TORRE:</b> DIGITAL</li><li><b>CLIENTE:</b> NOVO</li><li><b>SEGMENTO:</b> PME</li><li><b>DDD:</b> 51, 53, 54, 55</li><li><b>TCM PRODUTO:</b> R$ 15,60</li><li><b>TURBINE:</b> MICROSOFT/GOOGLE, MDM, GEST├âO DE EQUIPE</li></ul>' },
                    { title: '­ƒÜÇ AVAN├çADA', text: 'Quer faturar alto? Este ├® um produto que lhe possibilitar├í ultrapassar v├írios limites, com um ticket m├®dio elevado e diversas solu├º├Áes de LINK (Link Dedicado Exclusivo), VOZ (SIP - Operadora IP) e SEGURAN├çA (SDWAN). Aqui, voc├¬ tem uma excelente oportunidade de colocar a "cereja no bolo". Os produtos avan├ºados j├í fazem parte de muitas empresas.<br/><br/><ul style="padding-left: 20px; text-align: left; list-style-type: disc;"><li><b>TORRE:</b> AVAN├çADA VOZ E DADOS</li><li><b>CLIENTE:</b> NOVO, PORTABILIDADE</li><li><b>SEGMENTO:</b> PME</li><li><b>DDD:</b> 51, 53, 54, 55</li><li><b>TCM PRODUTO:</b> R$ 680,00</li><li><b>TURBINE:</b> LINK DEDICADO, SIP, 0800, SDWAN</li><li><b>MELHOR PERFIL:</b> A partir de 3 COLABORADORES, AT├ë ACIMA DE 500 COLABORADORES</li></ul>' },
                    { title: '­ƒöä RENOVA├ç├âO', text: 'A renova├º├úo ├® um dos pilares da atividade da equipe Farm, sendo um excelente caminho para estreitar rela├º├Áes. Uma das premissas ├® fidelizar 85% ou mais do seu parque. Mantenha aten├º├úo nos processos, pois renova├º├Áes com DOWNGRADE (redu├º├úo do plano) afetam negativamente sua premia├º├úo e n├úo geram nenhum tipo de pontua├º├úo. Seu foco deve ser rentabilizar renovando o parque buscando UPGRADE (aumento de valor da receita em +6%).<br/><br/><ul style="padding-left: 20px; text-align: left; list-style-type: disc;"><li><b>TORRE:</b> M├ôVEL, FTTH, AVAN├çADA</li><li><b>TIPOS:</b> RENOVA├ç├âO (ANTECIPADA, DOWN, PADR├âO, COM UP)</li><li><b>SEGMENTO:</b> PME</li><li><b>DDD:</b> 51 a 55</li><li><b>TCM PRODUTO:</b> R$ 41,00</li></ul>' },
                    { title: '­ƒøÆ EQUIPAMENTOS', text: 'Venda de equipamentos ├® um excelente caminho para gerar relacionamento e facilidades ao cliente, com possibilidade de parcelar em at├® 24x diretamente na fatura. Quando bem utilizada pode gerar diversas oportunidades como atrav├®s da venda Alta m├│vel, ser o determinante para o sucesso da sua negocia├º├úo.<br/><br/><ul style="padding-left: 20px; text-align: left; list-style-type: disc;"><li><b>TORRE:</b> EQUIPAMENTOS</li><li><b>CLIENTE:</b> TODOS (MENOS TT - Troca de titularidade CNPJ p/ CNPJ)</li><li><b>SEGMENTO:</b> PME</li><li><b>DDD:</b> TODOS</li><li><b>TCM PRODUTO:</b> R$ 1.450,00</li><li><b>TURBINE:</b> MDM, MICROSOFT, GEST├âO DA EQUIPE, ALTA M├ôVEL</li></ul>' }
                ]
            },
            {
                type: 'swipecards',
                title: 'Verdade ou Mito: R$ FRESH',
                instruction: 'Deslize para a direita (Correto) ou esquerda (Mito) nas afirma├º├Áes sobre as regras da R$ FRESH.',
                cards: [
                    { id: 'c1', text: 'Independentemente do DDD (seja 51 ou 41), uma venda robusta de Linhas M├│veis ou Equipamento TT conta integralmente para a R$ FRESH.', correctIsRight: false, explanation: 'Mito cl├íssico! Outros DDDs n├úo listados como foco geram apenas 30%. E Troca de Titularidade (TT) n├úo foca na m├®trica de Torres Equipamentos.' },
                    { id: 'c2', text: 'Para faturar 100% da R$ FRESH, a regra mais valiosa indica que os produtos devem ser vendidos para o Segmento PME nos DDDs 51, 53, 54 e 55.', correctIsRight: true, explanation: 'Fato! Esta ├® a principal regra de ouro que garante sua comiss├úo m├íxima.' }
                ]
            },
            {
                type: 'drag_drop_sort',
                title: 'Desafio Pr├ítico: A L├│gica do TCM',
                instruction: 'Com base no Ticket Central M├®dio (TCM) dos produtos, ordene as Torres de Venda da Vivo posicionando o produto de MAIOR VALOR FINANCEIRO (topo) at├® o de MENOR VALOR:',
                steps: [
                    'Avan├ºada Voz e Dados (Link Dedicado, SIP, SDWAN)',
                    'FTTH (A "menina dos olhos" da Vivo em Banda Larga)',
                    'Alta M├│vel (Novas linhas e Portabilidade)',
                    'Digital (A "porta de entrada": Microsoft, Google, MDM)'
                ]
            },
            {
                type: 'scenario',
                title: 'Simula├º├úo - L├│gica do Impacto',
                context: 'Ap├│s mapear com ├¬xito os 4 primeiros passos avaliados, voc├¬ percebeu que um cliente, pertencente ├á regi├úo de Rio Grande (DDD 53) no Segmento PME, optou apenas pela Renova├º├úo DOWNGRADE e recusou a proposta de VVN em novos pontos de servi├ºo.',
                question: 'Considerando a pol├¡tica da equipe Farm e o foco das metas, o que acontece com a sua performance imediata e ganhos R$ FRESH com este cliente?',
                options: [
                    { text: 'A Renova├º├úo em DOWNGRADE ir├í afetar negativamente sua premia├º├úo final perdendo a fidelidade base, e voc├¬ n├úo somar├í nenhum R$ FRESH para o novo ciclo.', isCorrect: true, feedback: 'Excelente interpreta├º├úo! Renovar por si mesmo n├úo gera R$ FRESH, e como foi em DOWNGRADE, voc├¬ afeta diretamente a fatia de rentabiliza├º├úo!' },
                    { text: 'Apesar de n├úo levar VVN que geraria R$ 47,80 de TCM, voc├¬ ganhar├í R$ FRESH parcial devido ao cliente ser do Rio Grande.', isCorrect: false, feedback: 'Incorreto. Servi├ºos de renova├º├Áes n├úo geram nem contam R$ FRESH de forma direta baseada no DDD.' },
                    { text: 'Sua R$ FRESH render├í 30% do valor porque a Renova├º├úo conta como uma venda de torre tradicional.', isCorrect: false, feedback: 'Incorreto. O conceito de render apenas 30% vale para Vendas de Novos Produtos que caem *fora* do enquadramento dos DDDs Oficiais e PME. Renova├º├úo N├âO ├® R$ FRESH.' }
                ]
            },
            {
                type: 'content',
                title: 'Conclus├úo: A Matem├ítica Final',
                content: 'Tudo o que voc├¬ vende gera uma pontua├º├úo baseada na torre e no tipo de cliente. Acompanhe ativamente sua placa de pontua├º├úo! Vender com estrat├®gia eleva a base, fideliza a carteira e multiplica a sua pr├│pria recompensa.'
            }
        ]
    },
    {
        id: 3,
        title: 'Processo de Venda',
        description: 'Treinamento Supremo de Vendas B2B: Atendimento Humanizado, Metodologia SPIN Selling, TIS, Processo de Sondagem e as 8 Etapas do Relacionamento.',
        duration: '45 min',
        icon: '­ƒñØ',
        thumbnail: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=400',
        departments: ['Todos'],
        modules: [
            {
                type: 'content',
                title: 'O que ├® Atendimento Humanizado?',
                html: true,
                content: 'O <b>atendimento humanizado</b> foca na empatia e na personaliza├º├úo, valorizando o cliente como indiv├¡duo e n├úo apenas como comprador. O objetivo ├® proporcionar uma experi├¬ncia completa.<br/><br/>Ele ├® caracterizado por um di├ílogo atento e emp├ítico, focado em resolver problemas de forma acolhedora. Rompe com o tradicional modelo de telemarketing de roteiros r├¡gidos, promovendo comunica├º├úo pr├│xima e genu├¡na.'
            },
            {
                type: 'content',
                title: 'Por que a Humaniza├º├úo ├® Importante?',
                html: true,
                content: 'Em um mercado onde a impessoalidade predomina, o tratamento diferenciado destaca voc├¬ da concorr├¬ncia.<br/><br/>De acordo com o Relat├│rio Zendesk:<br/>- <b>66%</b> dos consumidores afirmam que uma intera├º├úo ruim estraga o dia.<br/>- <b>52%</b> sentem-se exaustos ap├│s suportes ruins.<br/>- <b>73%</b> mudar├úo para um concorrente ap├│s v├írias experi├¬ncias ruins.<br/>- <b>Mais da metade</b> abandonar├í a empresa ap├│s UMA ├ÜNICA intera├º├úo insatisfat├│ria.'
            },
            {
                type: 'content',
                title: 'A Empatia como Pe├ºa-Chave',
                html: true,
                content: 'Ter empatia ├® fundamental no atendimento, onde lidamos com emo├º├Áes como frustra├º├úo e raiva. A capacidade de ajustar a abordagem e <b>oferecer desculpas genu├¡nas ├® insubstitu├¡vel</b>.<br/><br/>Daniel Kahneman destaca: 70% das experi├¬ncias de compra s├úo influenciadas pela percep├º├úo de como o consumidor ├® tratado. Mesmo quando voc├¬ n├úo pode resolver o problema naquele segundo, demonstrar empatia faz o cliente se sentir ouvido e valorizado.'
            },
            {
                type: 'video',
                title: 'A Magia da Disney e a Empatia',
                description: 'A Disney ├® refer├¬ncia mundial em atendimento (encantamento) pois empodera os funcion├írios a sentirem o que ├® felicidade.',
                videoId: 'M8sQwMZiBfM',
                requireDelay: 0
            },
            {
                type: 'accordion',
                title: 'O Conceito H.E.A.R.D (Disney)',
                instruction: 'Clique nas letras para aprender o m├®todo aplicado pelos "Cast Members" dos parques:',
                items: [
                    { title: 'H - Hear (Ouvir)', content: 'Escute ativamente o cliente, sem interromper, permitindo que ele expresse toda a sua frustra├º├úo.' },
                    { title: 'E - Empathize (Empatizar)', content: 'Valide os sentimentos do cliente. Mostre que voc├¬ entende o peso do problema dele ("Eu entendo perfeitamente como isso ├® frustrante").' },
                    { title: 'A - Apologize (Pedir Desculpas)', content: 'Pe├ºa desculpas sinceras, n├úo apenas de forma mec├ónica. Pe├ºa desculpas pela situa├º├úo, mesmo que a culpa "t├®cnica" n├úo seja unicamente sua.' },
                    { title: 'R - Resolve (Resolver)', content: 'D├¬ uma solu├º├úo r├ípida e eficiente. Se n├úo puder resolver o problema raiz na hora, ofere├ºa uma alternativa paliativa ou prazo real.' },
                    { title: 'D - Diagnose (Diagnosticar)', content: 'Entenda por que o problema ocorreu e trabalhe nos bastidores (processos internos) para que n├úo aconte├ºa de novo com outro cliente.' }
                ]
            },
            {
                type: 'content',
                title: 'Customer Centric e P├│s-Tratativa',
                html: true,
                content: 'Acredite: <i>"A minha empresa s├│ existe por causa dos clientes"</i>.<br/>Isso ├® <b>Customer Centric</b> - garantir que todas as decis├Áes sejam feitas pensando na experi├¬ncia de sucesso do cliente.<br/><br/><b>Dica de Ouro: Entre em contato DEPOIS que o problema foi resolvido!</b><br/>Ligue dizendo apenes "Posso ajudar com mais alguma coisa?". Isso demonstra compromisso absurdamente raro no Brasil e gera indica├º├Áes (vendas adicionais).'
            },
            {
                type: 'content',
                title: 'Al├®m do Script Fixo',
                html: true,
                content: 'Embora n├úo sigamos scripts r├¡gidos para n├úo parecermos rob├┤s, <b>n├úo podemos ignorar Processos</b>.<br/>O nosso processo de relacionamento substitui o "script inflex├¡vel" por um Quadrado M├ígico: <b>Processos + Empatia + Aten├º├úo + Personalizado</b>.<br/>Isso permite, por exemplo, ouvir uma contesta├º├úo de fatura e transformar a bronca em uma renegocia├º├úo amig├ível de amplia├º├úo de plano.'
            },
            {
                type: 'carousel',
                title: 'Introdu├º├úo ao SPIN Selling',
                slides: [
                    { title: 'O Que ├ë?', text: 'T├®cnica focada em fazer boas perguntas, na ordem certa, para traduzir dores em vendas B2B.' },
                    { title: 'Como Surgiu?', text: 'Criada em 1988 por Neil Rackham ap├│s estudar 35 mil liga├º├Áes de vendas da Xerox/IBM. A conclus├úo? N├úo se "empurra" o produto. Voc├¬ diagnostica e o cliente pede para comprar.' }
                ]
            },
            {
                type: 'carousel',
                title: 'Mergulho: As 4 Letras do SPIN',
                slides: [
                    { title: '1. S - Situa├º├úo', text: 'Coleta de Dados ("Fase de Investiga├º├úo").<br/><br/>Exemplo Vivo: "Como est├í sua infra atual?", "Usam PABX?", "Quantos da equipe tem Home Office?"' },
                    { title: '2. P - Problema', text: 'Investigar dores que talvez nem o cliente saiba nomear.<br/><br/>Exemplo Vivo: "Voc├¬ enfrenta quedas do link ├á tarde?", "Sua equipe fica sem dados m├│veis no dia 15?"' },
                    { title: '3. I - Implica├º├úo', text: 'Tocar na ferida. O que acontece se N├âO resolver hoje?<br/><br/>Exemplo Vivo: "Se a internet de voc├¬s parar 2 horas, quanto se perde de nota fiscal?", "Sem dados, sua equipe deixa de bater metas externas?"' },
                    { title: '4. N - Necessidade de Solu├º├úo', text: 'Apresentar o produto como rem├®dio. Fazer ele imaginar a cura.<br/><br/>Exemplo Vivo: "Se eu colocasse uma VPN para sua equipe trabalhar seguro de casa, isso impactaria quantos % nas vendas?"' }
                ]
            },
            {
                type: 'content',
                title: 'SPIN Selling: Pontos de Aten├º├úo',
                html: true,
                content: '<b>Aten├º├úo:</b> O SPIN exige n├¡vel de profici├¬ncia, sondagem aprofundada, personaliza├º├úo (n├úo leia regras como um rob├┤) e acompanhamento.<br/><br/>Use o sistema <b>TIS</b> para incorporar estrat├®gia! Veja redes sociais, ramo de atua├º├úo (CNAE) e entenda quais solu├º├Áes concorrentes podem ser atacadas. O TIS revela comportamentos e d├í muni├º├úo real para suas perguntas.'
            },
            {
                type: 'content',
                title: 'O Fechamento no SPIN',
                html: true,
                content: 'O Fechamento <b>N├âO</b> deve ser o momento de mais tens├úo!<br/>No passo "Necessidade de Solu├º├úo", o cliente j├í concordou que precisa de voc├¬. No fechamento, voc├¬ apenas consolida tudo o que foi conversado nas letras S, P e I.<br/><br/>Fa├ºa perguntas abertas e suaves: <i>"Com base nas nossas conversas, qual o pr├│ximo passo que podemos seguir para implementar isso?"</i>.'
            },
            {
                type: 'swipecards',
                title: 'Mito ou Verdade: A Venda Consultiva',
                instruction: 'Deslize para a direita (Correto) ou esquerda (Mito) sobre Atendimento e SPIN Selling.',
                cards: [
                    { id: 'sv_1', text: 'Ao ouvir um cliente reclamar muito da fatura alta (P: Problema), devo jogar a tabela de pre├ºos do Vivo Total na cara dele.', correctIsRight: false, explanation: 'Mito! Entendemos a dor, mas falta fazer a Implica├º├úo. E se o pre├ºo estiver caro porque a equipe dele gasta desordenadamente? Analise primeiro.' },
                    { id: 'sv_2', text: 'O "S"itua├º├úo ├® a hora onde lemos o CNAE e o TIS para sabermos com quem estamos falando antes da dor aparecer.', correctIsRight: true, explanation: 'Correto! Fazer o "Dever de casa" no TIS te deixa pronto para a fase S do SPIN.' },
                    { id: 'sv_3', text: 'Um atendimento humanizado n├úo pode envolver scripts, nem processos internos organizacionais.', correctIsRight: false, explanation: 'Mito! O material deixa claro: fugir do r├│tulo de telemarketing n├úo isenta a TEC-B2 de seguir PROCESSOS r├¡gidos com organiza├º├úo.' }
                ]
            },
            {
                type: 'accordion',
                title: 'A L├│gica Visual do Funil de Relacionamento',
                instruction: 'Como dividimos o Funil B2B internamente:',
                items: [
                    { title: '1. Oportunidade (Leads / Fresh / Carteira)', content: 'Clientes do Fresh (est├úo em outra operadora e ativaremos) ou da Carteira (estouraram dados mensais e d├úo sinal para upgrade).' },
                    { title: '2. Relacionamento (SPIN)', content: 'Fase de SONDAGEM. Entender se a oportunidade ├® latente ou para o futuro. Classificar o cliente de forma correta e conversar.' },
                    { title: '3. Negocia├º├úo', content: 'Identificamos a dor formalizando a Proposta e Enviando Contrato. O sucesso aqui ├® reflexo de ter escutado bem no Relacionamento.' },
                    { title: '4. Fechamento', content: 'A fase mais esperada. ├ë o "Case de Sucesso", pois provou o v├¡nculo de confian├ºa construcionado nas etapas anteriores.' }
                ]
            },
            {
                type: 'content',
                title: 'O Funil: Metas de Registro da TEC-B2',
                html: true,
                content: 'A finalidade do CRM e Funil ├® dar <b>previsibilidade de receitas</b> e garantir seguran├ºa LGPD das conversas.<br/><br/><b>A REGRA DOS 90 DIAS:</b> Nossa expectativa ├® que 100% dos clientes da Carteira recebam contato de relacionamento pelo menos uma vez a cada 90 dias.<br/><br/>Isso significa que o vendedor deve bater <b>33% da sua carteira mensalmente</b> apenas gerando relacionamento proativo!'
            },
            {
                type: 'accordion',
                title: 'O Processo Oculto da Sondagem',
                instruction: 'O que o cliente fala X O que o cliente n├úo percebe:',
                items: [
                    { title: 'Necessidades Expl├¡citas', content: 'As f├íceis. Cen├írios onde o cliente expressa sua dor de forma clara.\n\nExemplo: "O celular da chefia quebrou." ou "Preciso de pacote maior pois acabou a cota do office."' },
                    { title: 'Necessidades Impl├¡citas', content: 'Cuidado extra! Dores subentendidas ou latentes.\n\nExemplo: O cliente liga insatisfeito com o setor de SAC da loja que trava. A necessidade Impl├¡cita = Ele precisa modernizar com PABX (Voz na Nuvem Vivo) no setor dele.' }
                ]
            },
            {
                type: 'carousel',
                title: 'As 8 Etapas do Processo: 1 a 4',
                slides: [
                    { title: '1. Pesquisa e Prepara├º├úo', text: 'Uso do CNAE, Quantidade de Colaboradores e Planta de Produtos. Ter objetivo do contato definido na cabe├ºa.' },
                    { title: '2. Primeiro Contato', text: 'Nome do cliente na ponta da l├¡ngua! Ser breve. IMPORTANTE: Envie tamb├®m o seu cart├úo de visita, sua carta de apresenta├º├úo e deixe o WhatsApp vis├¡vel.' },
                    { title: '3. Escuta Ativa', text: 'Fa├ºa perguntas relevantes. "Qual sua expectativa com meu atendimento?", "H├í melhorias que eu posso puxar para voc├¬s?"' },
                    { title: '4. Ofere├ºa Valor (Solu├º├Áes!)', text: 'Voc├¬ sabe as dores, atire as solu├º├Áes! Temos Mobilidade, FTTH B2B (20GB+, ticket rico), VVN, PACOTE OFFICE GoogleWorkspace, Link Dedicado (99.6% / 4h SLA) e Seguran├ºa MDM/LGPD.' }
                ]
            },
            {
                type: 'carousel',
                title: 'As 8 Etapas do Processo: 5 a 8',
                slides: [
                    { title: '5. Manuten├º├úo', text: 'O Erro Crasso ├® ser Reativo (responder s├│ quando ele liga bravo). Seja PROATIVO: informe o status do pedido, avise uso alto de dados, seja o "Guardi├úo" da conta dele.' },
                    { title: '6. Fideliza├º├úo', text: 'Comunique de forma respeitosa (sem invadir a caixa de emails). Promova o programa Vivo Valoriza B2B.' },
                    { title: '7. Resolu├º├úo de Conflitos', text: 'Seja Emp├ítico e Resolva r├ípido! Um conflito resolvido em minutos fixa um cliente. N├│s da TEC-B2 possu├¡mos Analistas T├®cnicos Exclusivos para voc├¬ chamar e mitigar dores grandes!' },
                    { title: '8. Relacionamento a Longo Prazo', text: 'A Evolu├º├úo Conjunta do B2B. A empresa dele vai crescer, precisar├í de Link IP maior, de Data Center, de IoT. Cres├ºa junto com o CNPJ dele!' }
                ]
            },
            {
                type: 'drag_drop_sort',
                title: 'Desafio Pr├ítico: Sondando Necessidades',
                instruction: 'Organize a l├│gica impec├ível da Etapa de Sondagem. O que voc├¬ faz antes de abrir a boca at├® a consolida├º├úo da venda?',
                steps: [
                    'Pesquisa Pr├®via: Leio o CNAE e o TIS do cliente antes de discar.',
                    'Escuta Ativa: Fa├ºo o cliente expor as Necessidades (Expl├¡citas ou Impl├¡citas).',
                    'Oferta de Valor: Conecto um MDM/Link Dedicado na dor que ele confessou.',
                    'Manuten├º├úo: Ligo para ele s├│ pra avisar que a instala├º├úo foi sucesso e gerar Fideliza├º├úo.'
                ]
            },
            {
                type: 'scenario',
                title: 'Simula├º├úo - Sala de Guerra B2B',
                context: 'A Imobili├íria AlugaR├ípido ligou hoje. A Gerente Joana est├í uma fera. Ela perdeu duas negocia├º├Áes porque o sistema dela travou por queda de internet, ao mesmo tempo o telefone f├¡sico parou. Ela acusa: "A internet b├ísica da loja atual n├úo resolve nada. Preciso cancelar tudo ou me mudem!".',
                question: 'Como aplicar a empatia H.E.A.R.D aliada ├á Metodologia SPIN para converter o estresse em um Upgrade Gigante?',
                options: [
                    { text: 'A: Focar em Necessidade Expl├¡cita: Dizer "Mil desculpas, vamos arrumar a sua internet" e pedir abertura de chamado na Anatel ou na base de TI para consertar o plano dela de internet.', isCorrect: false, feedback: 'Incorreto. Voc├¬ foi reativo e deixou a cliente com a mesma dor central. Ela poder├í rescindir se der defeito de novo m├¬s que vem.' },
                    { text: 'B: Listar o Cat├ílogo de Pre├ºos: Falar "A culpa ├® do seu roteador antigo. Por 1.990 Reais ao m├¬s eu te indico uma nova infra IP."', isCorrect: false, feedback: 'Incorreto. Voc├¬ pulou a letram "E" (Empatia) e j├í fez Oferta antes de rodar o SPIN (Situa├º├úo e Problema). O cliente ficar├í ofendido!' },
                    { text: 'C: Empregar o H.E.A.R.D para ouvir a dor. Em seguida, aplicar SPIN mostrando a Implica├º├úo Financeira. Escutar a Necessidade Impl├¡cita (Telefone parado? Pode ser Voz Na Nuvem) (Quedas? Linha de Link Dedicado). Ofertar VVN B├ísico + Link Avan├ºado SLA 4h para fechar a empresa num escudo.', isCorrect: true, feedback: 'Obra Prima B2B! Voc├¬ acolheu a emo├º├úo, aplicou o SPIN e achou Dores Impl├¡citas de Backup e Telefonia IP, dobrando a receita da cliente blindando a imobili├íria dela contra preju├¡zos.' }
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
