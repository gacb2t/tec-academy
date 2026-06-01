import { supabase } from './supabaseClient';

export const auditService = {
    /**
     * Recupera as configurações (ex: lista de qualificações)
     */
    async getSettings() {
        const { data, error } = await supabase
            .from('audit_settings')
            .select('settings')
            .limit(1)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') { // Ignora erro se não existir linha
            console.error("Erro ao buscar configurações de auditoria:", error);
            // Fallback gracefully se a tabela não existir ainda
            return { qualifications: ["Venda Fechada", "Acompanhamento (Follow-up)"] };
        }

        if (data && data.settings) {
            return data.settings;
        }

        return { qualifications: ["Venda Fechada", "Acompanhamento (Follow-up)"] };
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
