// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// @ts-ignore
const CLERK_SECRET_KEY = Deno.env.get('CLERK_SECRET_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Tratar preflight request (CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, email, password } = await req.json()

    if (!CLERK_SECRET_KEY) {
      throw new Error('A variável CLERK_SECRET_KEY não está configurada no Supabase Edge Functions')
    }

    if (!userId) {
      throw new Error('O ID do usuário no Clerk (userId) é obrigatório')
    }

    // Preparar os dados para atualização (apenas os fornecidos)
    const updatePayload: Record<string, any> = {}
    
    if (password && password.length >= 8) {
      updatePayload.password = password
    }

    // Se quisermos atualizar o email primário (isso requer a criação de um novo Email Address no Clerk)
    // Para simplificar, o Clerk permite criar um email e associá-lo ao usuário:
    let emailsResponse = null
    if (email) {
      const createEmailReq = await fetch(`https://api.clerk.com/v1/email_addresses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          email_address: email,
          verified: true,
          primary: true
        })
      })
      emailsResponse = await createEmailReq.json()
    }

    // Atualiza a senha se fornecida
    let userResponse = null
    if (updatePayload.password) {
      const updateUserReq = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatePayload)
      })
      userResponse = await updateUserReq.json()
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Usuário atualizado com sucesso no Clerk",
        clerkUpdate: userResponse,
        emailUpdate: emailsResponse
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    const err = error as Error;
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
