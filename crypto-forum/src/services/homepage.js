import { supabase } from "../supabase/supabaseClient";


export const getForumStats = async () => {
    const { data, error} = await supabase.rpc('get_forum_stats');

    if(error) {
        throw error;
    }

    const stats = data?.[0];

    return {
        totalUsers: Number(stats?.total_users ?? 0),
        totalPosts: Number(stats?.total_posts ?? 0),
        totalComments: Number(stats?.total_comments ?? 0)
    };
};

// TODO: replace with real supabase query (issue #9)
export const getRecentPosts = async () => {
    return [
        { id: 1, title: 'Example post title one', author: 'testuser1', created_at: '2026-09-18' },
        { id: 2, title: 'Example post title two', author: 'testuser2', created_at: '2026-09-17' }
    ];
};