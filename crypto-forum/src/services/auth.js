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

export const registerUser = async (email, password, {username, first_name, last_name}) => {
    const { data, error } = await supabase.auth.signUp({email,password, options: {data: {username, first_name, last_name}}});

    if(error) throw error;

    return data;
}