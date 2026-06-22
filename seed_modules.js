import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// IMPORTANTE: Para inserir dados com permissão total, usamos a SERVICE_ROLE_KEY
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const MODULES_DATA = [
    {
        id: 'mod-welcome',
        title: 'Bem-vindo(a) a TEC-B2',
        icon: '🏢',
        materials: [
            {
                id: 'mat-rh',
                title: '01 - Recursos Humanos',
                embedSrc: 'https://www.canva.com/design/DAGaarY_2jE/TyEellWU6VpH8NSSWXSnGQ/view?embed',
                type: 'presentation',
            },
        ],
    },
    {
        id: 'mod-sistemas',
        title: 'Sistemas e Negociações',
        icon: '💻',
        materials: [
            {
                id: 'mat-sistemas',
                title: '01 - Sistemas, Ferramentas e Diário de Bordo',
                embedSrc: 'https://www.canva.com/design/DAHJkJ0W-wQ/PraOlv0XggvUIbRP5R2HBA/view?embed',
                type: 'presentation',
            },
            {
                id: 'mat-carteira',
                title: '02 - Carteira de Clientes e CRM',
                embedSrc: 'https://www.canva.com/design/DAHJmIIH8yw/Nx24AbZtVDpUXagwfE-Rfg/view?embed',
                type: 'presentation',
            },
            {
                id: 'mat-funis',
                title: '03 - Funis de Venda e Contratos',
                embedSrc: 'https://www.canva.com/design/DAHJmDa3H-8/aDQFHYmEkjFJOhacJQpLSw/view?embed',
                type: 'presentation',
            },
        ],
    },
    {
        id: 'mod-rotina',
        title: 'Rotina e Funil de Vendas',
        icon: '📈',
        materials: [
            {
                id: 'mat-basico',
                title: '01 - Módulo Básico',
                embedSrc: 'https://www.canva.com/design/DAHJmLwPUpc/EF8GdtkHaDG3ldethhVNZQ/view?embed',
                type: 'presentation',
            },
            {
                id: 'mat-avancado',
                title: '02 - Módulo Avançado',
                embedSrc: 'https://www.canva.com/design/DAHJmEbjk2I/3JuztyVS--8ilj0oUQ6Cvg/view?embed',
                type: 'presentation',
            },
        ],
    },
    {
        id: 'mod-produtos',
        title: 'Produtos',
        icon: '📦',
        materials: [
            {
                id: 'mat-ftth',
                title: '01 - FTTH (Banda Larga)',
                embedSrc: 'https://www.canva.com/design/DAGaa9yUmzo/yiYUdpPKq1qiW8yP3Zx5Qw/view?embed',
                type: 'presentation',
            },
            {
                id: 'mat-moveis',
                title: '02 - Móveis',
                embedSrc: 'https://www.canva.com/design/DAGaa4a3TYQ/M9nxuRzdJvC6Mj7LemzVtw/view?embed',
                type: 'presentation',
            },
            {
                id: 'mat-vvn',
                title: '03 - Vivo Voz Negócio (VVN)',
                embedSrc: 'https://www.canva.com/design/DAGaaz4K1NY/9KvtsWK2E48B3MjR1UHRyw/view?embed',
                type: 'presentation',
            },
        ],
    },
    {
        id: 'mod-manual-dados',
        title: 'Serviços Avançados Dados',
        icon: '🌐',
        materials: [
            {
                id: 'mat-manual-dados',
                title: '01 - Serviços Avançados Dados',
                embedSrc: 'https://www.canva.com/design/DAHJjxD52qA/nxen8DPvqy21caqBuQu5Tw/view?embed',
                type: 'presentation',
            },
        ],
    },
    {
        id: 'mod-manual-licencas',
        title: 'Licenças Digitais',
        icon: '🔑',
        materials: [
            {
                id: 'mat-manual-licencas',
                title: '01 - Licenças Digitais',
                embedSrc: 'https://www.canva.com/design/DAHJeNnWg88/9f-azxxxuo85jZeiefDliw/view?embed',
                type: 'presentation',
            },
        ],
    },
    {
        id: 'mod-manual-0800',
        title: '0800 e 0300',
        icon: '📞',
        materials: [
            {
                id: 'mat-manual-0800',
                title: '01 - 0800 e 0300',
                embedSrc: 'https://www.canva.com/design/DAHJwIbkyro/Zmyes03e87nZe130QxNjIw/view?embed',
                type: 'presentation',
            },
        ],
    },
];

async function seed() {
    console.log("🚀 Iniciando migração de Módulos e Materiais...");

    for (let i = 0; i < MODULES_DATA.length; i++) {
        const mod = MODULES_DATA[i];
        
        console.log(`Inserindo módulo: ${mod.title}`);
        const { error: errMod } = await supabase.from('modules').upsert({
            id: mod.id,
            title: mod.title,
            icon: mod.icon,
            order_index: i
        });

        if (errMod) {
            console.error("❌ Erro ao inserir módulo:", errMod);
            continue;
        }

        for (let j = 0; j < mod.materials.length; j++) {
            const mat = mod.materials[j];
            console.log(`  -> Inserindo material: ${mat.title}`);
            const { error: errMat } = await supabase.from('materials').upsert({
                id: mat.id,
                module_id: mod.id,
                title: mat.title,
                embed_src: mat.embedSrc,
                type: mat.type,
                order_index: j
            });

            if (errMat) {
                console.error("  ❌ Erro ao inserir material:", errMat);
            }
        }
    }

    console.log("✅ Concluído com sucesso!");
}

seed();
