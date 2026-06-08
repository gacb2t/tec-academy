import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ Supabase Credentials missing from .env.local")
}

let currentClerkSession = null;

export const setClerkSession = (session) => {
    currentClerkSession = session;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
        fetch: async (url, options) => {
            const headers = new Headers(options?.headers);
            
            // Se tivermos uma sessão do Clerk, buscamos o token usando o template 'supabase'
            if (currentClerkSession) {
                try {
                    const clerkToken = await currentClerkSession.getToken({ template: 'supabase' });
                    if (clerkToken) {
                        headers.set('Authorization', `Bearer ${clerkToken}`);
                    }
                } catch (e) {
                    console.warn("Erro ao buscar token do Clerk para o Supabase", e);
                }
            }
            
            return fetch(url, { ...options, headers });
        }
    }
});
