const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const openaiService = {
    /**
     * Transcreve o áudio usando o Whisper-1
     * @param {File} audioFile 
     * @returns {Promise<string>} Transcrição bruta
     */
    async transcribeAudio(audioFile) {
        if (!API_KEY) throw new Error("A chave da API da OpenAI não foi configurada (VITE_OPENAI_API_KEY).");

        const formData = new FormData();
        formData.append('file', audioFile);
        formData.append('model', 'whisper-1');
        formData.append('language', 'pt');
        // O prompt do Whisper serve como um glossário e direcionamento de contexto (limitado a 224 tokens)
        formData.append('prompt', 'Um atendimento de vendas B2B. A nossa empresa se chama TEC-B2. Vendedor conversando com o Cliente.');

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("OpenAI Whisper Error:", error);
            throw new Error(error.error?.message || "Falha ao transcrever o áudio.");
        }

        const data = await response.json();
        return data.text;
    },

    /**
     * Analisa a transcrição bruta, formata com as falas e gera o relatório da auditoria.
     * @param {string} rawTranscription 
     * @param {string} collaboratorName 
     * @returns {Promise<Object>} JSON estruturado com a auditoria
     */
    async analyzeTranscription(rawTranscription, collaboratorName) {
        if (!API_KEY) throw new Error("A chave da API da OpenAI não foi configurada.");

        const systemPrompt = `
Você é um auditor especialista em atendimento comercial B2B da TEC-B2 (Parceira Autorizada Vivo Empresas).
O objetivo da venda é comercializar produtos Vivo Empresas.

Sua tarefa consiste em duas partes:
PARTE 1: Formatar a transcrição bruta em um diálogo legível, separando as falas (Vendedor e Cliente).
- Corrija nomes errados como "SEC D2", "TechD2", "Téque B2" para "TEC-B2".
- Insira contexto entre colchetes inferindo pelo tom da transcrição: [interrupção], [longo silêncio], [tom de dúvida], etc.

PARTE 2: Realizar a Auditoria do Atendimento.
- Avalie o desempenho e a conduta.
- A nossa empresa é a TEC-B2 (considere que o vendedor falou corretamente, não aponte erros de dicção gerados pela transcrição bruta).
- NÃO oferecemos períodos de teste sob nenhuma hipótese.
- Se o cliente possuir fidelidade com a concorrência e quiser cancelar, o vendedor DEVE oferecer abertura de um chamado para suporte.

Regras de Preenchimento:
- Dê nota de 1 a 10 para cada critério, sendo 1 (péssimo) a 10 (excelente). Seja crítico, realista e analítico na avaliação.
- ATENÇÃO: Se um critério NÃO SE APLICAR à ligação (ex: a ligação caiu antes do fechamento), atribua OBRIGATORIAMENTE a nota 0. A nota 0 indica "Não Aplicável" e não vai prejudicar a média do vendedor.
- NENHUM campo de texto ou lista pode ficar vazio. Se não houver informação, preencha OBRIGATORIAMENTE com "Não apresentou".
- O nome do vendedor é EXATAMENTE: "${collaboratorName}". Preencha o campo nome_vendedor com este valor.
- Se a transcrição NÃO possuir contexto para um ponto de atenção, NÃO relate a ausência. Apenas preencha com "Não apresentou".

Cursos de Reforço Disponíveis (indicar APENAS para notas < 8, AGRUPANDO OS MOTIVOS se o mesmo curso for indicado para vários critérios):
- "Introdução RH: Bem-vindo à TEC-B2" (Ética, apresentação, LGPD)
- "Indicadores" (Lógica B2B, métricas, portfólio)
- "Processos de Vendas" (Sondagem, SPIN, objeções, relacionamento)
- "Sistemas TEC-B2" (Uso de ferramentas)
- "Planejamento de Tempo e Produtividade" (Follow-up, gestão de funil)

Você DEVE retornar a resposta EXATAMENTE no formato JSON descrito pelo schema, sem formatações Markdown adicionais ou blocos de código (\`\`\`json).
`;

        const jsonSchema = {
            "type": "object",
            "properties": {
                "transcricao_formatada": {
                    "type": "string",
                    "description": "O texto da transcrição devidamente formatado separando Vendedor e Cliente, com marcações de contexto."
                },
                "nome_vendedor": { "type": "string" },
                "nota_geral_vendedor": { "type": "number" },
                "nivel_dificuldade_cliente": { "type": "string", "enum": ["Baixo", "Médio", "Alto", "Não apresentou"] },
                "perfil_cliente": { "type": "string" },
                "interesse_inicial_cliente": { "type": "string", "enum": ["Baixo", "Médio", "Alto", "Não apresentou"] },
                "tipo_objecoes": { "type": "array", "items": { "type": "string" } },
                "criterios_vendedor": {
                    "type": "object",
                    "properties": {
                        "abertura": { "type": "object", "properties": { "nota": { "type": "number" }, "comentario": { "type": "string" } } },
                        "sondagem": { "type": "object", "properties": { "nota": { "type": "number" }, "comentario": { "type": "string" } } },
                        "argumentacao": { "type": "object", "properties": { "nota": { "type": "number" }, "comentario": { "type": "string" } } },
                        "conhecimento_produto": { "type": "object", "properties": { "nota": { "type": "number" }, "comentario": { "type": "string" } } },
                        "cordialidade": { "type": "object", "properties": { "nota": { "type": "number" }, "comentario": { "type": "string" } } },
                        "tratamento_objecoes": { "type": "object", "properties": { "nota": { "type": "number" }, "comentario": { "type": "string" } } },
                        "fechamento": { "type": "object", "properties": { "nota": { "type": "number" }, "comentario": { "type": "string" } } },
                        "agendamento_proximos_passos": { "type": "object", "properties": { "nota": { "type": "number" }, "comentario": { "type": "string" } } }
                    }
                },
                "analise_cliente": {
                    "type": "object",
                    "properties": {
                        "resistencia": { "type": "string" },
                        "comportamento": { "type": "string" },
                        "principais_preocupacoes": { "type": "string" },
                        "provedor_atual": { "type": "string" },
                        "perfil_decisor": { "type": "string" }
                    }
                },
                "pontos_fortes_vendedor": { "type": "string" },
                "pontos_melhoria_vendedor": { "type": "string" },
                "pontos_de_atencao": { "type": "array", "items": { "type": "object", "properties": { "ponto": { "type": "string" } } } },
                "resumo_estrategico": { "type": "string" },
                "cursos_de_reforco": { "type": "array", "items": { "type": "object", "properties": { "curso": { "type": "string" } } } }
            },
            "required": ["transcricao_formatada", "nome_vendedor", "nota_geral_vendedor", "nivel_dificuldade_cliente", "perfil_cliente", "interesse_inicial_cliente", "tipo_objecoes", "criterios_vendedor", "analise_cliente", "pontos_fortes_vendedor", "pontos_melhoria_vendedor", "pontos_de_atencao", "resumo_estrategico", "cursos_de_reforco"]
        };

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Transcrição bruta da ligação:\n\n${rawTranscription}` }
                ],
                temperature: 0.3,
                response_format: {
                    type: "json_schema",
                    json_schema: {
                        name: "auditoria_schema",
                        schema: jsonSchema,
                        strict: false
                    }
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("OpenAI Chat Error:", error);
            throw new Error(error.error?.message || "Falha ao analisar a transcrição.");
        }

        const data = await response.json();
        
        try {
            const jsonResult = JSON.parse(data.choices[0].message.content);
            
            // Recalcular a nota geral com base na média dos critérios avaliados
            if (jsonResult.criterios_vendedor) {
                let total = 0;
                let count = 0;
                for (const key in jsonResult.criterios_vendedor) {
                    const criterio = jsonResult.criterios_vendedor[key];
                    if (criterio && criterio.nota !== undefined) {
                        const parsedNota = parseFloat(criterio.nota);
                        // Notas 0 significam "Não Aplicável" segundo nosso novo prompt
                        if (!isNaN(parsedNota) && parsedNota > 0) {
                            total += parsedNota;
                            count++;
                        }
                    }
                }
                if (count > 0) {
                    jsonResult.nota_geral_vendedor = Math.round((total / count) * 10) / 10;
                } else {
                    jsonResult.nota_geral_vendedor = 0;
                }
            }
            
            return jsonResult;
        } catch (e) {
            console.error("Erro ao fazer parse do JSON da OpenAI", e);
            throw new Error("O formato retornado pela IA não é um JSON válido.");
        }
    }
};
