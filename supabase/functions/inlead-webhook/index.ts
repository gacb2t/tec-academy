import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS pré-flight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const team = url.searchParams.get('team') || 'Não Especificado'

    const payload = await req.json()
    
    // Extração dos campos principais
    const { nome, email, telefone, score } = payload;
    const responses: Record<string, any> = {};

    // Coletar as respostas dinâmicas (opcoes_* ou pergunta_*)
    for (const [key, value] of Object.entries(payload)) {
      if ((key.startsWith('opcoes_') || key.startsWith('pergunta_')) && 
          !key.startsWith('score.') && 
          !key.startsWith('responses.')) {
        responses[key] = value;
      }
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from('job_applications')
      .insert({
        team,
        name: nome || 'Candidato sem nome',
        email,
        phone: telefone,
        score: score ? parseInt(score as string) : null,
        responses,
        stage: 'Inscrição realizada'
      })
      .select()
      .single()

    if (error) throw error

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
