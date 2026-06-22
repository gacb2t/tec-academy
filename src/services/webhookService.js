import { supabase } from './supabaseClient';

export const webhookService = {
    /**
     * Dispara todos os webhooks ativos configurados para um evento específico.
     * Esta função não lança erros para o frontend, pois o disparo é "fire-and-forget".
     * 
     * @param {string} eventName Nome do evento (ex: 'curso_concluido')
     * @param {Object} payload Dados que serão enviados no corpo da requisição (JSON)
     */
    async triggerEvent(eventName, payload) {
        try {
            // Busca apenas os webhooks ativos para este evento
            const { data: webhooks, error } = await supabase
                .from('webhooks')
                .select('*')
                .eq('event', eventName)
                .eq('is_active', 1);

            if (error) {
                console.error(`Erro ao buscar webhooks para o evento ${eventName}:`, error);
                return;
            }

            if (!webhooks || webhooks.length === 0) return;

            // Dispara todos os webhooks simultaneamente
            const promises = webhooks.map(webhook => {
                return fetch(webhook.url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        event: eventName,
                        timestamp: new Date().toISOString(),
                        data: payload
                    })
                }).catch(err => {
                    console.error(`Falha no webhook ${webhook.name} (${webhook.url}):`, err);
                });
            });

            await Promise.all(promises);
            console.log(`Disparados ${webhooks.length} webhooks para o evento: ${eventName}`);

        } catch (err) {
            console.error("Erro inesperado no triggerEvent:", err);
        }
    },

    /**
     * Lista todos os webhooks (Admin)
     */
    async getWebhooks() {
        const { data, error } = await supabase
            .from('webhooks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    /**
     * Cria ou atualiza um webhook (Admin)
     */
    async saveWebhook(webhookData) {
        if (webhookData.id) {
            const { data, error } = await supabase
                .from('webhooks')
                .update(webhookData)
                .eq('id', webhookData.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } else {
            const { data, error } = await supabase
                .from('webhooks')
                .insert([webhookData])
                .select()
                .single();

            if (error) throw error;
            return data;
        }
    },

    /**
     * Deleta um webhook (Admin)
     */
    async deleteWebhook(id) {
        const { error } = await supabase
            .from('webhooks')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};
