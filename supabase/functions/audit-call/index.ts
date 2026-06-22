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
      formData.set('model', 'whisper-1')
      formData.set('language', 'pt')
      formData.set('prompt', 'Um atendimento de vendas B2B. A nossa empresa se chama TEC-B2. Vendedor conversando com o Cliente.')

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
      const { rawTranscription, collaboratorName } = bodyParams

      if (!rawTranscription || !collaboratorName) {
        throw new Error('Parâmetros incompletos (rawTranscription e collaboratorName são obrigatórios)')
      }

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

Você DEVE retornar a resposta EXATAMENTE no formato JSON descrito pelo schema.
`

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
