// TODO: replace with real supabase query (issue #9)
export const getForumStats = async () => {
    return {
        totalUsers: 128,
        totalPosts: 342,
        totalComments: 891
    };
};

// TODO: replace with real supabase query (issue #9)
export const getRecentPosts = async () => {
    return [
        { id: 1, title: 'Example post title one', author: 'testuser1', created_at: '2026-09-18' },
        { id: 2, title: 'Example post title two', author: 'testuser2', created_at: '2026-09-17' }
    ];
};