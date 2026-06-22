import { supabase } from './supabaseClient';

export const moduleService = {
    /**
     * Fetch all modules and their materials, structured like the old MODULES_DATA array.
     */
    async getModulesWithMaterials() {
        // Fetch modules
        const { data: modules, error: modError } = await supabase
            .from('modules')
            .select('*')
            .order('order_index', { ascending: true });

        if (modError) {
            console.error('Error fetching modules:', modError);
            throw modError;
        }

        // Fetch materials
        const { data: materials, error: matError } = await supabase
            .from('materials')
            .select('*')
            .order('order_index', { ascending: true });

        if (matError) {
            console.error('Error fetching materials:', matError);
            throw matError;
        }

        // Combine them
        const structuredData = modules.map(mod => {
            const modMaterials = materials
                .filter(mat => mat.module_id === mod.id)
                .map(mat => ({
                    id: mat.id,
                    title: mat.title,
                    embedSrc: mat.embed_src,
                    type: mat.type,
                    orderIndex: mat.order_index
                }));

            return {
                id: mod.id,
                title: mod.title,
                icon: mod.icon,
                materialsCount: modMaterials.length,
                progress: 0, // This will be calculated in the component based on user progress
                firstMaterialId: modMaterials.length > 0 ? modMaterials[0].id : null,
                materials: modMaterials
            };
        });

        return structuredData;
    }
};
