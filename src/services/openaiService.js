import { supabase } from './supabaseClient';

export const openaiService = {
    /**
     * Helper para extrair a mensagem de erro real da Edge Function
     */
    async extractEdgeError(error, defaultMessage) {
        if (error.context && typeof error.context.json === 'function') {
            try {
                const errBody = await error.context.json();
                if (errBody.error) return errBody.error;
            } catch (e) {}
        }
        return error.message || defaultMessage;
    },

    /**
     * Transcreve o áudio usando a Edge Function segura (Whisper-1)
     * @param {File} audioFile 
     * @param {string} promptWhisper
     * @returns {Promise<string>} Transcrição bruta
     */
    async transcribeAudio(audioFile, promptWhisper) {
        const formData = new FormData();
        formData.append('file', audioFile);
        if (promptWhisper) {
            formData.append('promptWhisper', promptWhisper);
        }
        
        const { data, error } = await supabase.functions.invoke('audit-call?action=transcribe', {
            body: formData,
        });

        if (error) {
            const msg = await this.extractEdgeError(error, "Falha ao transcrever o áudio.");
            console.error("Supabase Edge Function Error (Transcribe):", msg);
            throw new Error(msg);
        }

        return data.text;
    },

    /**
     * Analisa a transcrição bruta via Edge Function segura (GPT-4o)
     * @param {string} rawTranscription 
     * @param {string} collaboratorName 
     * @param {string} promptOrientado
     * @returns {Promise<Object>} JSON estruturado com a auditoria
     */
    async analyzeTranscription(rawTranscription, collaboratorName, promptOrientado) {
        const { data, error } = await supabase.functions.invoke('audit-call?action=analyze', {
            body: {
                rawTranscription,
                collaboratorName,
                promptOrientado
            }
        });

        if (error) {
            const msg = await this.extractEdgeError(error, "Falha ao analisar a transcrição.");
            console.error("Supabase Edge Function Error (Analyze):", msg);
            throw new Error(msg);
        }
        
        try {
            const jsonResult = JSON.parse(data.choices[0].message.content);
            
            // Recalcular a nota geral com base na média dos critérios avaliados
            if (jsonResult.criterios_vendedor) {
                let total = 0;
                let count = 0;
                for (const key in jsonResult.criterios_vendedor) {
                    const criterio = jsonResult.criterios_vendedor[key];
                    if (criterio && criterio.nota !== undefined) {
                        const parsedNota = parseFloat(criterio.nota);
                        // Notas 0 significam "Não Aplicável"
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
