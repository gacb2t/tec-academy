import { supabase } from './supabaseClient';

export const auditService = {
    /**
     * Recupera as configurações (ex: lista de qualificações)
     */
    async getSettings() {
        const defaultSettings = {
            qualifications: ["Venda Fechada", "Acompanhamento (Follow-up)"],
            promptWhisper: "Olá, bom dia! Meu nome é consultor da TEC-B2, Parceira Autorizada Vivo Empresas. Por gentileza, eu conseguiria falar com o responsável ou titular que cuida das linhas telefônicas e da internet do CNPJ? O motivo do meu contato B2B é apresentar uma redução de custos para o seu plano móvel corporativo, além de soluções como aparelhos, Link Dedicado, IP, licenças Microsoft, McAfee e linhas 0800.",
            promptOrientado: `Você é um auditor sênior especialista em Qualidade e Atendimento Comercial B2B, atuando na TEC-B2 (Parceira Autorizada Vivo Empresas). 
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
        };

        const { data, error } = await supabase
            .from('audit_settings')
            .select('settings')
            .limit(1)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') { // Ignora erro se não existir linha
            console.error("Erro ao buscar configurações de auditoria:", error);
            // Fallback gracefully se a tabela não existir ainda
            return defaultSettings;
        }

        if (data && data.settings) {
            return { ...defaultSettings, ...data.settings };
        }

        return defaultSettings;
    },

    /**
     * Salva as configurações de auditoria
     */
    async saveSettings(settingsObj) {
        // Verifica se já existe uma linha
        const { data: existing } = await supabase.from('audit_settings').select('id').limit(1).maybeSingle();

        if (existing) {
            const { error } = await supabase
                .from('audit_settings')
                .update({ settings: settingsObj, updated_at: new Date().toISOString() })
                .eq('id', existing.id);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('audit_settings')
                .insert([{ settings: settingsObj }]);
            if (error) throw error;
        }
    },

    /**
     * Recupera todas as pastas com contagem de auditorias, respeitando a visibilidade
     */
    async getFolders(userId) {
        let isAdmin = false;

        if (userId) {
            const { data: profile } = await supabase.from('user_profiles').select('role').eq('user_id', userId).maybeSingle();
            if (profile && profile.role === 'admin') {
                isAdmin = true;
            }
        }

        // Devido às limitações de agregar no cliente, faremos 2 queries (Pastas e Auditorias)
        const { data: folders, error: foldersErr } = await supabase
            .from('audit_folders')
            .select('*')
            .order('created_at', { ascending: false });

        if (foldersErr) {
            console.error("Erro ao buscar pastas:", foldersErr);
            return []; // Retorna vazio se a tabela ainda não existir
        }

        // Filtra as pastas se não for admin
        let filteredFolders = folders;
        if (!isAdmin && userId) {
            filteredFolders = folders.filter(f => 
                (f.collaborators && f.collaborators.some(c => c.id === userId)) ||
                (f.managers && f.managers.some(m => m.id === userId))
            );
        }

        const { data: audits, error: auditsErr } = await supabase
            .from('audits')
            .select('id, folder_id, created_at, status');

        if (auditsErr) {
            console.error("Erro ao buscar auditorias para contagem:", auditsErr);
        }

        // Mapear contagens
        return filteredFolders.map(folder => {
            const folderAudits = (audits || []).filter(a => a.folder_id === folder.id);
            folderAudits.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            return {
                ...folder,
                auditCount: folderAudits.length,
                lastAudit: folderAudits.length > 0 ? folderAudits[0].created_at : null
            };
        });
    },

    /**
     * Busca usuários no Supabase pelo nome
     */
    async searchUsers(term) {
        if (!term || term.length < 3) return [];
        
        const { data, error } = await supabase
            .from('user_profiles')
            .select('user_id, name, role')
            .ilike('name', `%${term}%`)
            .limit(10);
            
        if (error) {
            console.error("Erro ao buscar usuários:", error);
            return [];
        }
        
        // Retorna mapeado para facilitar
        return data.map(u => ({ id: u.user_id, name: u.name, role: u.role }));
    },

    /**
     * Cria uma nova pasta
     */
    async createFolder({ name, collaborators, managers }) {
        const { data, error } = await supabase
            .from('audit_folders')
            .insert([{ name, collaborators, managers }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Busca as auditorias de uma pasta específica
     */
    async getAuditsByFolder(folderId) {
        const { data, error } = await supabase
            .from('audits')
            .select('*')
            .eq('folder_id', folderId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Erro ao buscar auditorias da pasta:", error);
            return [];
        }
        return data;
    },

    /**
     * Cria um novo registro de auditoria
     */
    async createAudit({ folder_id, qualification, audio_file_name, collaborator_id, collaborator_name, call_date, client_phone, audio_url }) {
        const { data, error } = await supabase
            .from('audits')
            .insert([{ 
                folder_id, 
                qualification, 
                audio_file_name,
                collaborator_id,
                collaborator_name,
                call_date,
                client_phone,
                audio_url,
                status: 'transcrevendo'
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Atualiza o status e resultado de uma auditoria
     */
    async updateAuditResult(auditId, { status, result }) {
        const updatePayload = { status };
        if (result) {
            updatePayload.result = result;
            updatePayload.completed_at = new Date().toISOString();
        }

        const { error } = await supabase
            .from('audits')
            .update(updatePayload)
            .eq('id', auditId);

        if (error) throw error;
    },

    /**
     * Faz o upload do áudio para o Supabase Storage
     */
    async uploadAudio(file) {
        if (!file) throw new Error("Arquivo não fornecido.");
        
        // Gerar nome único para evitar conflitos
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
            .from('audit_audios')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error("Erro no upload do áudio:", error);
            throw new Error(`Falha no upload do áudio: ${error.message}`);
        }

        // Recuperar a URL pública do arquivo
        const { data: publicUrlData } = supabase.storage
            .from('audit_audios')
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
    },
    
    /**
     * Deleta uma auditoria
     */
    async deleteAudit(auditId) {
        const { error } = await supabase
            .from('audits')
            .delete()
            .eq('id', auditId);
        
        if (error) throw error;
    }
};
