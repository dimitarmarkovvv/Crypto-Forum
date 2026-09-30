import { supabase } from "../supabase/supabaseClient"

export const getCommentsByPostId = async (postId, sort = 'newest') => {
    const { data, error } = await supabase
        .from('comments')
        .select('*, profiles(username)')
        .eq('post_id', postId)
        .order('created_at', { ascending: sort === 'oldest' });

    if (error) {
        throw error;
    }

    return data ?? [];
};

export const createComment = async (content, postId, authorId, parentCommentId = null) => {
    const cleanContent = normalizeCommentContent(content);

    const { data, error } = await supabase.
        from('comments')
        .insert({
            content: cleanContent,
            post_id: postId,
            author_id: authorId,
            parent_comment_id: parentCommentId,
        })
        .select('*, profiles(username)')
        .single()

    if (error) {
        throw error;
    };

    return data ?? null;
};

export const updateComment = async (commentId, content) => {
    const cleanContent = normalizeCommentContent(content);

    const { data, error } = await supabase
        .from('comments')
        .update({
            content: cleanContent
        })
        .eq('id', commentId)
        .select('*, profiles(username)')
        .single();

    if (error) {
        throw error;
    }

    return data;
}

export const deleteComment = async (commentId) => {

    const { count, error: countError } = await supabase
        .from('comments')
        .select('id', {
            count: 'exact',
            head: true,
        })
        .eq('parent_comment_id', commentId)

    if (countError) {
        throw countError;
    }


    //comment has replies --> soft delete
    if (count > 0) {
        const { data, error } = await supabase
            .from('comments')
            .update({
                content: '[deleted]',
                is_deleted: true,
                deleted_at: new Date().toISOString(),
            })
            .eq('id', commentId)
            .select('*, profiles(username)')
            .single();

        if (error) {
            throw error;
        }

        return data;
    }

    //comment has no replies --> physically delete it
    const { data, error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .select()
        .single()

    if (error) {
        throw error
    }

    return data
}


const normalizeCommentContent = (content) => {
    const cleanContent = content.trim();

    if (!cleanContent) {
        throw new Error('Comment cannot be empty.')
    }

    return cleanContent;
};