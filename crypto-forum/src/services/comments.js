import { supabase } from "../supabase/supabaseClient"

export const getCommentsByPostId = async (postId) => {
    const { data, error } = await supabase
        .from('comments')
        .select('*, profiles(username)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

    if (error) {
        throw error;
    }

    return data ?? [];
};

export const createComment = async (content, postId, authorId) => {
    const { data, error } = await supabase.
        from('comments')
        .insert({ content, post_id: postId, author_id: authorId })
        .select('*, profiles(username)')
        .single()

    if (error) {
        throw error;
    };

    return data ?? null;
};

export const updateComment = async (commentId, content) => {
    const { data, error } = await supabase
        .from('comments')
        .update({ content })
        .eq('id', commentId)
        .select('*, profiles(username)')
        .single();

    if (error) {
        throw error;
    }

    return data;
}

export const deleteComment = async (commentId) => {
    const { data, error } = await supabase
    .froom('comments')
    .delete()
    .eq('id', commentId)
    .select()
    .single();

    if(error) {
        throw error;
    }

    return data;
}