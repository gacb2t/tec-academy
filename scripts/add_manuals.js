import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const courseData = {
    title: "Manuais de Apoio - Serviços B2B",
    description: "Acesso rápido aos manuais de Serviços Avançados Dados, Licenças Digitais e 0800/0300.",
    icon: "📘",
    departments: ["Todos"],
    status: "Published",
    category: "Geral",
    estimated_duration: 30,
    modules: [
        {
            title: "MANUAL - SERVIÇOS AVANÇADOS DADOS",
            blocks: [
                {
                    _id: "m1_b1",
                    type: "content",
                    html: true,
                    content: `<div style="position: relative; width: 100%; height: 0; padding-top: 56.2500%; padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden; border-radius: 8px; will-change: transform;">
  <iframe loading="lazy" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;"
    src="https://www.canva.com/design/DAHJjxD52qA/nxen8DPvqy21caqBuQu5Tw/view?embed" allowfullscreen="allowfullscreen" allow="fullscreen">
  </iframe>
</div>`
                }
            ]
        },
        {
            title: "MANUAL - LICENÇAS DIGITAIS",
            blocks: [
                {
                    _id: "m2_b1",
                    type: "content",
                    html: true,
                    content: `<div style="position: relative; width: 100%; height: 0; padding-top: 56.2500%; padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden; border-radius: 8px; will-change: transform;">
  <iframe loading="lazy" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;"
    src="https://www.canva.com/design/DAHJeNnWg88/9f-azxxxuo85jZeiefDliw/view?embed" allowfullscreen="allowfullscreen" allow="fullscreen">
  </iframe>
</div>`
                }
            ]
        },
        {
            title: "MANUAL - 0800 E 0300",
            blocks: [
                {
                    _id: "m3_b1",
                    type: "content",
                    html: true,
                    content: `<div style="position: relative; width: 100%; height: 0; padding-top: 56.2500%; padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden; border-radius: 8px; will-change: transform;">
  <iframe loading="lazy" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;"
    src="https://www.canva.com/design/DAHJwIbkyro/Zmyes03e87nZe130QxNjIw/view?embed" allowfullscreen="allowfullscreen" allow="fullscreen">
  </iframe>
</div>`
                }
            ]
        }
    ]
};

async function insertCourse() {
    console.log("Inserindo curso...");
    const { data, error } = await supabase.from('courses').insert([courseData]).select();
    if (error) {
        console.error("Erro ao inserir o curso:", error);
    } else {
        console.log("Curso inserido com sucesso!", data);
    }
}

insertCourse();
