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
        .select('id, parent_comment_id')
        .single()

    if (error) {
        throw error
    }


    await cleanupDeletedParent(data.parent_comment_id)
    
    return data
}

export const getCommentsByAuthorId = async (authorId) => {
    const { data, error } = await supabase
        .from('comments')
        .select(`
        *,
        posts(
        id,
        title
        )
        `)
        .eq('author_id', authorId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })

    if (error) {
        throw error
    }

    return data ?? [];
}


const normalizeCommentContent = (content) => {
    const cleanContent = content.trim();

    if (!cleanContent) {
        throw new Error('Comment cannot be empty.')
    }

    return cleanContent;
};

const cleanupDeletedParent = async (commentId) => {
    if(!commentId) {
        return;
    }

    const {data: parent, error: parentError} = await supabase
    .from('comments')
    .select('id, parent_comment_id, is_deleted')
    .eq('id', commentId)
    .maybeSingle();

    if(parentError) {
        throw parentError;
    }

    if(!parent || !parent.is_deleted) {
        return;
    }

    const {count, error: countError} = await supabase
    .from('comments')
    .select('id', {
        count: 'exact',
        head: true,
    })
    .eq('parent_comment_id', parent.id)

    if(countError){
        throw countError;
    }

    // Deleted parent still has replies, so keep the tombstone.
    if(count > 0) {
        return;
    }

    const {data: deletedParent, error: deletedError} = await supabase
    .from('comments')
    .delete()
    .eq('id', parent.id)
    .eq('is_deleted', true)
    .select('id, parent_comment_id')
    .maybeSingle();

    if(deletedError) {
        throw deletedError;
    }

    if(!deletedParent) {
        return;
    }

    // Check whether its parent is now also an unused tombstone.
    await cleanupDeletedParent(deletedParent.parent_comment_id);
}