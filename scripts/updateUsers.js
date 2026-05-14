import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase URL or Anon Key in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateDatabase() {
    console.log('🚀 Starting database cleanup and user profiles update...');

    // Delete records from tables that we want to clear out
    const tablesToClear = ['candidates', 'course_answers', 'course_completion_history', 'course_evaluations', 'course_progress', 'courses'];
    
    for (const table of tablesToClear) {
        console.log(`🧹 Clearing table: ${table}...`);
        const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
        // fallback if table has no 'id' column or if it's user_id
        if (error) {
            console.log(`Warning clearing ${table}: ${error.message}`);
            // Let's try with user_id just in case
            await supabase.from(table).delete().neq('user_id', '00000000-0000-0000-0000-000000000000').catch(() => {});
        } else {
            console.log(`✅ Cleared ${table}`);
        }
    }

    // Now update user profiles
    console.log('🔄 Updating user profiles...');

    // First set EVERYONE to 'Consultor de Vendas' and 'colaborador'
    const { error: resetError } = await supabase
        .from('user_profiles')
        .update({ department: 'Consultor de Vendas', role: 'colaborador' })
        .neq('user_id', 'invalid-id-to-update-all'); // updating all essentially
    
    if (resetError) {
        console.error('❌ Error resetting users:', resetError);
    } else {
        console.log('✅ Reset all users to Consultor de Vendas / colaborador');
    }

    // Now set the specific admins
    const admins = [
        'gac.b2t@gmail.com', 
        'gabriel.albuquerque@tecb2.com.br', // Just in case, both Gabriel emails
        'guilherme@tecb2.com.br',
        'ane.caroline@tecb2.com.br'
    ];

    const { error: adminError } = await supabase
        .from('user_profiles')
        .update({ department: 'Administrativo', role: 'admin' })
        .in('email', admins);

    if (adminError) {
        console.error('❌ Error updating admins:', adminError);
    } else {
        console.log('✅ Updated admins to Administrativo / admin');
    }

    console.log('🎉 Done!');
}

updateDatabase();
