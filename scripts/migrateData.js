import { createClient } from '@supabase/supabase-js';
import { coursesData } from '../src/data/coursesData.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// We need the service role key to bypass RLS if needed, but Anon key works if RLS policies allow INSERT
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase URL or Anon Key in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateCourses() {
    console.log('🚀 Starting course migration to Supabase...');

    // Since you already created 2 dummy ones in the SQL, let's just wipe and replace so we have 
    // exactly the 4 real courses from the file with their full content.
    console.log('🧹 Clearing existing test courses...');
    await supabase.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    for (const course of coursesData) {
        console.log(`⏳ Migrating: ${course.title}`);

        // We generate a proper UUID or let Supabase generate it if we omit the ID.
        // However, since some relationships or users might depend on the ID string from JS, 
        // it's safer to let Supabase create new pure UUIDs and use those from now on.

        const coursePayload = {
            title: course.title,
            description: course.description,
            duration: course.duration,
            icon: course.icon,
            thumbnail: course.thumbnail || null,
            departments: course.departments,
            modules: course.modules,
            status: 'Published'
        };

        const { data, error } = await supabase
            .from('courses')
            .insert([coursePayload]);

        if (error) {
            console.error(`❌ Error migrating ${course.title}:`, error.message);
        } else {
            console.log(`✅ Success: ${course.title}`);
        }
    }

    console.log('🎉 Migration complete!');
}

migrateCourses();
