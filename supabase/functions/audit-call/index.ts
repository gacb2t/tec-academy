// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Acesso negado: Cabeçalho de autorização ausente')
    }

    // @ts-ignore
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      throw new Error('Erro interno: Chave da OpenAI não configurada no servidor')
    }

    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    if (action === 'transcribe') {
      const formData = await req.formData()
      const customPromptWhisper = formData.get('promptWhisper');
      
      formData.set('model', 'whisper-1')
      formData.set('language', 'pt')
      formData.set('prompt', customPromptWhisper ? customPromptWhisper.toString() : 'Olá, bom dia! Meu nome é consultor da TEC-B2, Parceira Autorizada Vivo Empresas. Por gentileza, eu conseguiria falar com o responsável ou titular que cuida das linhas telefônicas e da internet do CNPJ? O motivo do meu contato B2B é apresentar uma redução de custos para o seu plano móvel corporativo, além de soluções como aparelhos, Link Dedicado, IP, licenças Microsoft, McAfee e linhas 0800.')

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: formData
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error?.message || 'Falha ao transcrever o áudio na OpenAI.')

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    } 
    
    if (action === 'analyze') {
      const bodyParams = await req.json()
      const { rawTranscription, collaboratorName, promptOrientado } = bodyParams

      if (!rawTranscription || !collaboratorName) {
        throw new Error('Parâmetros incompletos (rawTranscription e collaboratorName são obrigatórios)')
      }

      let systemPrompt = promptOrientado || `Você é um auditor sênior especialista em Qualidade e Atendimento Comercial B2B, atuando na TEC-B2 (Parceira Autorizada Vivo Empresas). 
Sua missão é analisar transcrições brutas de ligações de vendas, extrair inteligência do perfil do cliente e avaliar o desempenho do vendedor com base nas melhores práticas de vendas B2B (SPIN Selling, contorno de objeções) e portfólio Vivo Empresas.

A transcrição fornecida pode conter erros gerados pela inteligência artificial de reconhecimento de voz (Whisper). A nossa empresa é a TEC-B2. Considere que o vendedor pronunciou perfeitamente e NUNCA aponte erros de dicção caso leia "SEC D2", "TechD2", "Téque B2", etc.

Sua tarefa consiste em 3 partes, e a saída final deve ser EXATAMENTE no formato JSON exigido pelo schema.

--- PARTE 1: RECONSTRUÇÃO DA TRANSCRIÇÃO ---
Formate a transcrição bruta em um diálogo legível.
- Separe claramente as falas entre "Vendedor:" e "Cliente:".
- Mantenha o diálogo estritamente em Português do Brasil (PT-BR). Sob nenhuma hipótese traduza as falas para o inglês.
- Insira contexto comportamental entre colchetes deduzindo pelo fluxo da conversa: [interrupção], [longo silêncio], [tom de dúvida], [risos], etc.

--- PARTE 2: ANÁLISE DE PERFIL E ESTRATÉGIA ---
Extraia e defina as seguintes informações do cliente e do atendimento:
- Dificuldade do Atendimento: (Fácil, Médio, Difícil)
- Interesse Inicial: (Baixo, Médio, Alto)
- Perfil Decisor: (É o decisor, Não é o decisor, Decisão conjunta, etc.)
- Provedor Atual: (Ex: Tim, Claro, Algar, Nenhum, Não informado)
- Perfil do Cliente: (Breve resumo textual sobre quem é o cliente e seu cenário)
- Resistência Apresentada: (Motivos de hesitação, ex: fidelidade, preço, precisa consultar sócio)
- Comportamento: (Receptivo, Cauteloso, Hostil, Apressado, etc.)
- Visão Geral Estratégica: (Resumo analítico do atendimento, o que foi ofertado e o desfecho)
- Pontos Fortes: (O que o vendedor fez de melhor)
- Pontos de Melhoria: (Onde o vendedor falhou ou deixou dinheiro na mesa)
- Pontos de Atenção (Violações): Relate quebras de regra de negócio ou erros graves.

REGRA DE NEGÓCIO INEGOCIÁVEL TEC-B2:
1. NÃO oferecemos períodos de teste sob nenhuma hipótese.
2. Se o cliente possuir fidelidade com a concorrência e desejar cancelar, o vendedor DEVE oferecer abertura de um chamado para suporte no cancelamento.

--- PARTE 3: AVALIAÇÃO POR ETAPAS (NOTAS 1 A 10) ---
Dê uma nota de 1 (péssimo) a 10 (excelente) e uma justificativa crítica para as 8 etapas abaixo.
ATENÇÃO: Se a ligação caiu ou um critério não teve tempo de ocorrer, dê nota 0 (Zero). A nota 0 significa "Não Aplicável" e não prejudicará a média.

1. ABERTURA: Avalie a saudação, tom de voz inicial, apresentação da TEC-B2 Vivo Empresas e se garantiu a atenção do cliente.
2. SONDAGEM: Avalie se fez perguntas abertas, investigou o cenário atual (telefonia móvel, fixa, dados), dores e necessidades (SPIN).
3. ARGUMENTAÇÃO: Avalie se conectou as dores do cliente aos benefícios reais das soluções Vivo Empresas, gerando valor antes do preço.
4. TRATAMENTO DE OBJEÇÕES: Avalie a resiliência. Lidou bem com a fidelidade da concorrência? Contornou problemas de decisor ou preço?
5. FECHAMENTO: Avalie se tentou o fechamento lógico. Conseguiu o "sim" ou deixou a decisão solta?
6. CORDIALIDADE: Empatia, escuta ativa (sem interromper o cliente) e postura profissional do início ao fim.
7. CONHECIMENTO DO PRODUTO: Segurança ao falar dos planos, linhas, aparelhos, links de internet ou licenças.
8. AGENDAMENTO PRÓXIMOS PASSOS: Se a venda não fechou na hora, o vendedor cravou uma data/hora para o follow-up ou deixou solto via WhatsApp?

--- RECOMENDAÇÃO DE CURSOS DA ACADEMIA TEC-B2 ---
Se o vendedor tirar nota menor que 8 em algum critério, recomende OBRIGATORIAMENTE cursos de reforço. Agrupe os motivos se o mesmo curso servir para vários erros. 
Use EXATAMENTE e APENAS os nomes destes cursos disponíveis:
- "Bem-vindo(a) a TEC-B2" (Para notas baixas em: Abertura, Cordialidade, Postura)
- "Sistemas e Negociações" (Para falhas em processos de negociação B2B sistêmica)
- "Rotina e Funil de Vendas" (Para notas baixas em: Sondagem, Argumentação, Tratamento de Objeções, Fechamento e Agendamento)
- "Produtos" (Para notas baixas em Conhecimento do Produto: planos móveis, aparelhos, fixa básica)
- "Serviços Avançados Dados" (Para falta de conhecimento em Links Dedicados, Fibra B2B corporativa, IP)
- "Licenças Digitais" (Para dúvidas sobre Microsoft, McAfee, construtores de site em pacotes Vivo)
- "0800 e 0300" (Para falhas na oferta ou conhecimento de linhas receptivas/0800)

Regras Finais de Preenchimento:
- NENHUM campo de texto ou lista pode ficar vazio. Se não houver informação, preencha com "Não apresentou".
- O nome do vendedor é EXATAMENTE: "{NOME_DO_COLABORADOR}".`
      
      // Injeta o nome do colaborador
      systemPrompt = systemPrompt.replace(/\{NOME_DO_COLABORADOR\}/g, collaboratorName)


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
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${OPENAI_API_KEY}`
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
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error?.message || 'Falha ao analisar a transcrição na OpenAI.')

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    throw new Error('Ação inválida. Especifique ?action=transcribe ou ?action=analyze')
  } catch (error) {
    const err = error as Error;
    return new Response(
      JSON.stringify({ error: err.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
