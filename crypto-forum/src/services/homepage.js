import { supabase } from "../supabase/supabaseClient";


export const getForumStats = async () => {
    const { data, error } = await supabase.rpc('get_forum_stats');

    if (error) {
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
    const { data, error } = await supabase.rpc('get_recent_posts');

    if (error) {
        throw error;
    }

    return data ?? []
};