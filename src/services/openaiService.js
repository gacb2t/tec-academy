import { supabase } from './supabaseClient';

export const openaiService = {
    /**
     * Transcreve o áudio usando a Edge Function segura (Whisper-1)
     * @param {File} audioFile 
     * @returns {Promise<string>} Transcrição bruta
     */
    async transcribeAudio(audioFile) {
        const formData = new FormData();
        formData.append('file', audioFile);
        
        // As Edge Functions do Supabase podem ser invocadas diretamente pelo cliente 
        // configurado com o token do Clerk, garantindo que apenas usuários autenticados a chamem.
        const { data, error } = await supabase.functions.invoke('audit-call?action=transcribe', {
            body: formData,
        });

        if (error) {
            console.error("Supabase Edge Function Error (Transcribe):", error);
            throw new Error(error.message || "Falha ao transcrever o áudio.");
        }

        return data.text;
    },

    /**
     * Analisa a transcrição bruta via Edge Function segura (GPT-4o)
     * @param {string} rawTranscription 
     * @param {string} collaboratorName 
     * @returns {Promise<Object>} JSON estruturado com a auditoria
     */
    async analyzeTranscription(rawTranscription, collaboratorName) {
        const { data, error } = await supabase.functions.invoke('audit-call?action=analyze', {
            body: {
                rawTranscription,
                collaboratorName
            }
        });

        if (error) {
            console.error("Supabase Edge Function Error (Analyze):", error);
            throw new Error(error.message || "Falha ao analisar a transcrição.");
        }
        
        try {
            // A IA já retorna os dados formatados em JSON pela Edge Function
            const jsonResult = JSON.parse(data.choices[0].message.content);
            
            // Recalcular a nota geral com base na média dos critérios avaliados
            if (jsonResult.criterios_vendedor) {
                let total = 0;
                let count = 0;
                for (const key in jsonResult.criterios_vendedor) {
                    const criterio = jsonResult.criterios_vendedor[key];
                    if (criterio && criterio.nota !== undefined) {
                        const parsedNota = parseFloat(criterio.nota);
                        // Notas 0 significam "Não Aplicável" segundo nosso novo prompt
                        if (!isNaN(parsedNota) && parsedNota > 0) {
                            total += parsedNota;
                            count++;
                        }
                    }
                }
                if (count > 0) {
                    jsonResult.nota_geral_vendedor = Math.round((total / count) * 10) / 10;
                } else {
                    jsonResult.nota_geral_vendedor = 0;
                }
            }
            
            return jsonResult;
        } catch (e) {
            console.error("Erro ao fazer parse do JSON da Edge Function", e);
            throw new Error("O formato retornado pela IA não é um JSON válido.");
        }
    }
};
