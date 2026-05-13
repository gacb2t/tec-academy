/**
 * Script utilitário para definir role de admin no Supabase
 * 
 * INSTRUÇÕES:
 * Execute o seguinte SQL no painel do Supabase (SQL Editor):
 * 
 * UPDATE user_profiles 
 * SET role = 'admin' 
 * WHERE email = 'gac.b2t@gmail.com';
 * 
 * OU se preferir usar este script via Node.js:
 * 1. Instale dotenv: npm install dotenv
 * 2. Execute: node src/scripts/setAdminRole.js
 * 
 * NOTA: Este script usa a anon key que já está no .env.
 * A coluna 'role' precisa existir na tabela user_profiles.
 * Se não existir, execute antes:
 * ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'colaborador';
 */

// Para uso direto no navegador console (dev tools):
// Copie e cole no console do browser quando estiver logado na app:
/*
import { supabase } from './services/supabaseClient';

const { data, error } = await supabase
  .from('user_profiles')
  .update({ role: 'admin' })
  .eq('email', 'gac.b2t@gmail.com');

console.log('Resultado:', data, error);
*/

console.log(`
╔══════════════════════════════════════════════════╗
║  DEFINIR ROLE ADMIN - TEC-B2 Academy             ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  Execute no SQL Editor do Supabase:              ║
║                                                  ║
║  UPDATE user_profiles                            ║
║  SET role = 'admin'                              ║
║  WHERE email = 'gac.b2t@gmail.com';              ║
║                                                  ║
║  URL: https://rdyjekrrpzbphsxjrvbn.supabase.co  ║
║                                                  ║
╚══════════════════════════════════════════════════╝
`);
