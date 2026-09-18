import { supabase } from "../supabase/supabaseClient";

export const loginUser = async (email, password) => {
    const { data, error} = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if(error) {
        throw error;
    }

    return data;
};

export const logoutUser = async () => {
    const { error } = await supabase.auth.signOut();

    if(error) {
        throw error;
    }
}