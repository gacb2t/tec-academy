import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../services/supabaseClient';

export const useUserRole = () => {
    const { user, isLoaded, isSignedIn } = useUser();
    const [role, setRole] = useState(null);
    const [isLoadingRole, setIsLoadingRole] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            if (!isLoaded) return;
            if (!isSignedIn || !user) {
                setRole(null);
                setIsLoadingRole(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('user_profiles')
                    .select('role')
                    .eq('user_id', user.id)
                    .single();

                if (error) throw error;
                setRole(data?.role || 'colaborador');
            } catch (err) {
                console.error("Error fetching user role:", err);
                setRole('colaborador'); // fallback
            } finally {
                setIsLoadingRole(false);
            }
        };

        fetchRole();
    }, [isLoaded, isSignedIn, user]);

    return { role, isLoadingRole };
};
