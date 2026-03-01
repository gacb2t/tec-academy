/**
 * Integrou-se com o Make.com via Webhooks para não depender de banco de dados.
 * O RH receberá as notificações no Teams ou Excel através da automação Make.
 */

// INSIRA SUA URL DO MAKE WEBHOOK AQUI:
const MAKE_WEBHOOK_URL = '';

export const sendToWebhook = async (resultData) => {
    // Se não houver webhook configurado, simula sucesso para fins de demonstração visual
    if (!MAKE_WEBHOOK_URL) {
        console.warn('Webhook URL não configurada. Simulando envio bem-sucedido...');
        return new Promise((resolve) => {
            setTimeout(() => resolve({ success: true }), 1500);
        });
    }

    try {
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(resultData),
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        // Algumas integrações de Webhook retornam texto em vez de JSON puro (Make muitas vezes retorna "Accepted")
        const textResponse = await response.text();
        console.log('Resposta do Webhook Make:', textResponse);

        return { success: true };
    } catch (error) {
        console.error('Falha ao enviar dados para a integração Make:', error);
        return { success: false, error };
    }
};
