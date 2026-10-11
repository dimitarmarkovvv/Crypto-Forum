import { supabase } from "../supabase/supabaseClient";

export const loginUser = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw error;
    }

    return data;
};

export const logoutUser = async (userId) => {
    const { error } = await supabase.auth.signOut();

    if (userId) {
        sessionStorage.removeItem(
            `blocked-notice-${userId}`
        );
    }

    if (error) {
        throw error;
    }
}

export const registerUser = async (email, password, { username, first_name, last_name }) => {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { username, first_name, last_name } } });

    if (error) throw error;

    return data;
}
export const sendPasswordReset = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
        throw error;
    }
};

export const updatePassword = async (password) => {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
        throw error;
    }
};
