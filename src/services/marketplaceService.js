import { supabase } from './supabaseClient';

export const marketplaceService = {
    /**
     * Busca o saldo de pontos do usuário
     */
    async getWalletBalance(userId) {
        if (!userId) return 0;
        
        const { data, error } = await supabase
            .from('user_wallets')
            .select('balance')
            .eq('user_id', userId)
            .maybeSingle();

        if (error || !data) return 0;
        return data.balance;
    },

    /**
     * Busca os itens do marketplace
     * Se isAdmin for false, retorna apenas os itens ativos
     */
    async getItems(isAdmin = false) {
        let query = supabase.from('marketplace_items').select('*').order('created_at', { ascending: false });
        
        if (!isAdmin) {
            query = query.eq('is_active', true);
        }

        const { data, error } = await query;
        if (error) {
            console.error('Erro ao buscar itens do marketplace:', error);
            return [];
        }
        return data;
    },

    /**
     * Cria ou atualiza um item no marketplace
     */
    async saveItem(itemData) {
        if (itemData.id) {
            // Update
            const { data, error } = await supabase
                .from('marketplace_items')
                .update(itemData)
                .eq('id', itemData.id)
                .select()
                .single();
            if (error) throw error;
            return data;
        } else {
            // Insert
            const { data, error } = await supabase
                .from('marketplace_items')
                .insert([itemData])
                .select()
                .single();
            if (error) throw error;
            return data;
        }
    },

    /**
     * Ativa ou desativa um item (Admin)
     */
    async toggleItemStatus(itemId, isActive) {
        const { error } = await supabase
            .from('marketplace_items')
            .update({ is_active: isActive })
            .eq('id', itemId);
        if (error) throw error;
    },

    /**
     * Deleta um item (Admin)
     */
    async deleteItem(itemId) {
        const { error } = await supabase
            .from('marketplace_items')
            .delete()
            .eq('id', itemId);
        if (error) throw error;
    },

    /**
     * Realiza o resgate de um item pelo usuário
     */
    async redeemItem(userId, itemId, itemPrice) {
        // 0. Verifica o item para ver se é unitário
        const { data: itemData, error: itemErr } = await supabase
            .from('marketplace_items')
            .select('is_recurring')
            .eq('id', itemId)
            .single();

        if (itemErr) throw new Error("Item não encontrado.");

        if (!itemData.is_recurring) {
            // Verifica se já resgatou
            const { data: existing, error: existErr } = await supabase
                .from('marketplace_redemptions')
                .select('id')
                .eq('user_id', userId)
                .eq('item_id', itemId)
                .maybeSingle();

            if (existing) {
                throw new Error("Este prêmio é de resgate único e você já o resgatou.");
            }
        }

        // 1. Checa o saldo atual para evitar fraude
        const balance = await this.getWalletBalance(userId);
        if (balance < itemPrice) {
            throw new Error("Saldo insuficiente.");
        }

        // 2. Deduz o saldo
        const newBalance = balance - itemPrice;
        const { error: walletErr } = await supabase
            .from('user_wallets')
            .update({ balance: newBalance, updated_at: new Date().toISOString() })
            .eq('user_id', userId);
            
        if (walletErr) throw walletErr;

        // 3. Registra o resgate
        const { error: redeemErr } = await supabase
            .from('marketplace_redemptions')
            .insert([{
                user_id: userId,
                item_id: itemId,
                price_paid: itemPrice,
                status: 'pending' // Fica pendente até o gestor/RH entregar/pagar
            }]);

        if (redeemErr) throw redeemErr;
        
        return newBalance;
    },

    /**
     * Busca todos os resgates (Admin/RH)
     */
    async getAllRedemptions() {
        const { data, error } = await supabase
            .from('marketplace_redemptions')
            .select(`
                *,
                marketplace_items (title, type, image_url),
                user_profiles (user_name, department)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao buscar resgates:', error);
            return [];
        }
        return data;
    },

    /**
     * Atualiza o status de um resgate (Admin/RH)
     */
    async updateRedemptionStatus(redemptionId, status) {
        const { error } = await supabase
            .from('marketplace_redemptions')
            .update({ status })
            .eq('id', redemptionId);

        if (error) throw error;
    }
};
