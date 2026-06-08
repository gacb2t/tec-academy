import { supabase } from './supabaseClient';

export const campaignService = {
    /**
     * Busca todas as campanhas ativas filtradas por departamento
     */
    async getCampaigns(userId) {
        let isAdminOrRH = false;
        let department = null;

        if (userId) {
            const { data: profile } = await supabase.from('user_profiles').select('role, department').eq('user_id', userId).maybeSingle();
            if (profile) {
                department = profile.department;
                if (profile.role === 'admin' || profile.role === 'rh') {
                    isAdminOrRH = true;
                }
            }
        }

        const { data, error } = await supabase
            .from('campaigns')
            .select(`
                *,
                campaign_interactions (id, user_id, interaction_type),
                campaign_comments (id, user_id, user_name, comment, created_at, likes),
                campaign_sales (id, product_name, quantity, criteria_id, status, sale_value)
            `)
            .eq('is_active', true)
            .order('is_pinned', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao buscar campanhas:', error);
            return [];
        }

        // Filtra no cliente pelo departamento (se não for admin/rh)
        return data.filter(c => 
            isAdminOrRH || 
            !c.departments || 
            c.departments.length === 0 || 
            c.departments.includes('Todos') || 
            (department && c.departments.includes(department))
        );
    },

    /**
     * Cria uma nova campanha
     */
    async createCampaign(campaignData) {
        const { data, error } = await supabase
            .from('campaigns')
            .insert([campaignData])
            .select()
            .single();

        if (error) {
            console.error('Create campaign error', error);
            throw error;
        }
        return data;
    },

    /**
     * Atualiza uma campanha existente
     */
    async updateCampaign(campaignId, campaignData) {
        const { data, error } = await supabase
            .from('campaigns')
            .update(campaignData)
            .eq('id', campaignId)
            .select()
            .single();

        if (error) {
            console.error('Update campaign error', error);
            throw error;
        }
        return data;
    },

    /**
     * Interage com a campanha (Curtir/Palmas)
     * Tipo pode ser 'like' ou 'clap'
     */
    async interact(campaignId, userId, type) {
        // Primeiro tenta buscar se já existe
        const { data: existing } = await supabase
            .from('campaign_interactions')
            .select('*')
            .eq('campaign_id', campaignId)
            .eq('user_id', userId)
            .eq('interaction_type', type)
            .maybeSingle();

        if (existing) {
            // Se já curtiu, remove a curtida (toggle)
            await supabase
                .from('campaign_interactions')
                .delete()
                .eq('id', existing.id);
            return false; // Retorna false indicando que removeu
        } else {
            // Se não curtiu, adiciona
            const { error } = await supabase
                .from('campaign_interactions')
                .insert([{ campaign_id: campaignId, user_id: userId, interaction_type: type }]);
            
            if (error) throw error;
            return true; // Retorna true indicando que adicionou
        }
    },

    /**
     * Adiciona comentário a uma campanha
     */
    async addComment(campaignId, userId, userName, comment) {
        const { data, error } = await supabase
            .from('campaign_comments')
            .insert([{ campaign_id: campaignId, user_id: userId, user_name: userName, comment, likes: [] }])
            .select()
            .single();
            
        if (error) throw error;
        return data;
    },

    /**
     * Fixa ou desfixa uma campanha
     */
    async togglePin(campaignId, currentPinned) {
        const { error } = await supabase
            .from('campaigns')
            .update({ is_pinned: !currentPinned })
            .eq('id', campaignId);
        if (error) throw error;
    },

    /**
     * Exclui uma campanha
     */
    async deleteCampaign(campaignId) {
        const { error } = await supabase
            .from('campaigns')
            .delete()
            .eq('id', campaignId);
        if (error) throw error;
    },

    /**
     * Curte um comentário
     */
    async likeComment(commentId, userId, currentLikes = []) {
        const hasLiked = currentLikes.includes(userId);
        let newLikes = [...currentLikes];
        
        if (hasLiked) {
            newLikes = newLikes.filter(id => id !== userId);
        } else {
            newLikes.push(userId);
        }

        const { error } = await supabase
            .from('campaign_comments')
            .update({ likes: newLikes })
            .eq('id', commentId);
            
        if (error) throw error;
    },

    /**
     * Registra uma venda (Pendente de aprovação)
     */
    async registerSale(campaignId, userId, userName, saleId, cnpj, productName, quantity, saleValue, criteriaId = null, proofUrl = null) {
        const { error: saleError } = await supabase
            .from('campaign_sales')
            .insert([{ 
                campaign_id: campaignId, 
                user_id: userId, 
                user_name: userName, 
                client_name: '', // Mantendo pra n dar erro no schema antigo, caso n tenha sido deletada a coluna
                sale_id: saleId,
                cnpj: cnpj,
                product_name: productName,
                criteria_id: criteriaId ? String(criteriaId) : null,
                quantity: quantity,
                sale_value: saleValue, 
                proof_url: proofUrl,
                status: 'pending'
            }]);

        if (saleError) throw saleError;
    },

    /**
     * Aprova uma venda pendente (Apenas gestor/admin)
     */
    async approveSale(sale) {
        // 1. Muda o status para approved
        const { error: updateError } = await supabase
            .from('campaign_sales')
            .update({ status: 'approved' })
            .eq('id', sale.id);

        if (updateError) throw updateError;

        // 2. Atualiza o progresso da campanha e carteira
        const { data: campaign } = await supabase
            .from('campaigns')
            .select('*')
            .eq('id', sale.campaign_id)
            .single();

        if (campaign) {
            const newProgress = Number(campaign.progress_value || 0) + Number(sale.sale_value);
            
            let earnedPoints = 0;
            let criteriaUpdated = false;
            let updatedCriteria = campaign.criteria;

            // --- 3. Calcular Recompensas de Produtos (Metas de Produtos) ---
            if (updatedCriteria && Array.isArray(updatedCriteria)) {
                updatedCriteria = updatedCriteria.map(crit => {
                    let newCrit = { ...crit };
                    if (!newCrit.current_qty) newCrit.current_qty = 0;

                    const matchesId = sale.criteria_id === String(crit.id);
                    const matchesName = !sale.criteria_id && (!crit.objective || crit.objective.trim() === '' || (sale.product_name || '').toLowerCase().includes(crit.objective.toLowerCase()));

                    if (matchesId || matchesName) {
                        let oldQty = Number(newCrit.current_qty);
                        let targetQty = Number(crit.qty) || 1;
                        let critReward = Number(crit.reward) || 0;
                        let newQty = oldQty + Number(sale.quantity);
                        
                        if (crit.criteriaType === 'Única') {
                            if (oldQty < targetQty && newQty >= targetQty) {
                                earnedPoints += critReward;
                            }
                        } else {
                            // Recorrente (Padrão)
                            let oldRewards = Math.floor(oldQty / targetQty);
                            let newRewards = Math.floor(newQty / targetQty);
                            let rewardsToGive = newRewards - oldRewards;
                            earnedPoints += rewardsToGive * critReward;
                        }

                        newCrit.current_qty = newQty;
                        criteriaUpdated = true;
                    }
                    return newCrit;
                });
            }

            const updatePayload = { progress_value: newProgress };
            if (criteriaUpdated) {
                updatePayload.criteria = updatedCriteria;
            }

            await supabase
                .from('campaigns')
                .update(updatePayload)
                .eq('id', sale.campaign_id);

            // Adiciona pontos da meta de produto ao usuário atual
            if (earnedPoints > 0) {
                const { data: wallet } = await supabase.from('user_wallets').select('balance').eq('user_id', sale.user_id).maybeSingle();
                if (wallet) {
                    await supabase.from('user_wallets').update({ balance: Number(wallet.balance) + earnedPoints, updated_at: new Date().toISOString() }).eq('user_id', sale.user_id);
                } else {
                    await supabase.from('user_wallets').insert([{ user_id: sale.user_id, balance: earnedPoints }]);
                }
            }

            // --- 4. Processar Super Meta ---
            if (campaign.super_goal_type && campaign.super_goal_value > 0 && campaign.super_goal_reward > 0) {
                let query = supabase.from('campaign_sales').select('quantity, sale_value, user_profiles!inner(department)').eq('campaign_id', sale.campaign_id).eq('status', 'approved');
                
                let userDept = null;
                if (campaign.super_goal_type === 'Departamento' || campaign.super_goal_type === 'Individual') {
                    const { data: userProfile } = await supabase.from('user_profiles').select('department').eq('user_id', sale.user_id).single();
                    userDept = userProfile?.department;
                }

                if (campaign.super_goal_type === 'Individual') {
                    query = query.eq('user_id', sale.user_id);
                } else if (campaign.super_goal_type === 'Departamento' && userDept) {
                    query = query.eq('user_profiles.department', userDept);
                }

                const { data: pastSales } = await query;
                if (pastSales) {
                    const isUnit = campaign.super_goal_unit === 'Unidades';
                    
                    // Como a venda já foi aprovada no passo 1, pastSales inclui a venda atual.
                    let totalProgress = pastSales.reduce((acc, s) => acc + (isUnit ? Number(s.quantity) : Number(s.sale_value)), 0);
                    let prevProgress = totalProgress - (isUnit ? Number(sale.quantity) : Number(sale.sale_value));
                    let target = Number(campaign.super_goal_value);
                    
                    // Se acabou de bater a Super Meta
                    if (prevProgress < target && totalProgress >= target) {
                        let targetUsers = [];
                        
                        if (campaign.super_goal_type === 'Individual') {
                            targetUsers = [{ user_id: sale.user_id }];
                        } else if (campaign.super_goal_type === 'Departamento' && userDept) {
                            const { data: deptUsers } = await supabase.from('user_profiles').select('user_id').eq('department', userDept);
                            targetUsers = deptUsers || [];
                        } else if (campaign.super_goal_type === 'Global') {
                            const { data: allUsers } = await supabase.from('user_profiles').select('user_id');
                            targetUsers = allUsers || [];
                        }

                        if (targetUsers.length > 0) {
                            const reward = Number(campaign.super_goal_reward);
                            const userIds = targetUsers.map(u => u.user_id);
                            
                            // Buscar carteiras existentes desses usuários
                            const { data: existingWallets } = await supabase.from('user_wallets').select('user_id, balance').in('user_id', userIds);
                            const walletMap = new Map((existingWallets || []).map(w => [w.user_id, w.balance]));
                            
                            const upserts = targetUsers.map(u => ({
                                user_id: u.user_id,
                                balance: (walletMap.get(u.user_id) || 0) + reward,
                                updated_at: new Date().toISOString()
                            }));
                            
                            // Executa upsert em lote para performance (até milhares de registros suportados no Supabase RPC/REST)
                            await supabase.from('user_wallets').upsert(upserts);
                        }
                    }
                }
            }
        }
    },

    /**
     * Reprova uma venda
     */
    async rejectSale(saleId, reason) {
        const { error } = await supabase
            .from('campaign_sales')
            .update({ status: 'rejected', rejection_reason: reason })
            .eq('id', saleId);

        if (error) throw error;
    },

    /**
     * Busca todas as vendas pendentes de todas as campanhas (Gestor/Admin)
     */
    async getAllPendingSales() {
        const { data, error } = await supabase
            .from('campaign_sales')
            .select(`
                *,
                campaigns (title)
            `)
            .eq('status', 'pending')
            .order('created_at', { ascending: false });
            
        if (error) {
            console.error('Erro ao buscar vendas pendentes:', error);
            return [];
        }
        return data;
    },

    /**
     * Upload de mídias (imagens, vídeos, áudios) da campanha
     */
    async uploadMedia(file) {
        if (!file) throw new Error("Arquivo não fornecido.");
        
        const fileExt = file.name ? file.name.split('.').pop() : 'bin';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('campaign_media')
            .upload(fileName, file, { cacheControl: '3600', upsert: false });

        if (error) {
            console.error("Erro no upload da mídia:", error);
            throw new Error(`Falha no upload: ${error.message}`);
        }

        const { data: publicUrlData } = supabase.storage
            .from('campaign_media')
            .getPublicUrl(fileName);

        return publicUrlData.publicUrl;
    }
};
