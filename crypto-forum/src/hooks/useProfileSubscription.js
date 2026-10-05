import { useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";

export function useProfileSubscription(userId, setProfile) {
    useEffect(() => {
        if (!userId) {
            return;
        }

        const channel = supabase
            .channel(`profile-${userId}`)
            .on(
                'postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'profiles',
                filter: `id=eq.${userId}`,
            },
                (payload) => {
                    setProfile(payload.new)
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    }, [userId, setProfile])
}