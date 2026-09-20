import { useAuth } from '../hooks/useAuth';
import { logoutUser } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getForumStats, getRecentPosts } from '../services/homepage';

function TempHomePage() {
    const { user, loading } = useAuth();
    const [stats, setStats] = useState(null);
    const [posts, setPosts] = useState([]);
    const navigation = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigation('/login')
        } catch (error) {
            console.error(error.message);
        };
    };

    useEffect(() => {
    const loadHomePageData = async () => {
        const statsData = await getForumStats();
        const postData = await getRecentPosts();

        setPosts(postData);
        setStats(statsData);
    };

        loadHomePageData();
    },[]);

    if (loading) {
        return <p>Loading...</p>;
    };

return (
    <div>
        <h1>Crypto Forum</h1>

        {user ? (
            <>
                <p>Logged in as:  {user.email}</p>
                <button onClick={handleLogout}>Logout</button>
            </>
        ) : (
            <p>You are logged out</p>
        )}

        <section>
            <p>Crypto Forum is a community for discussing cryptocurrency news, trading strategies, and blockchain technology.</p>
        </section>

        {stats && (
            <section>
                <p>Users: {stats.totalUsers}</p>
                <p>Posts: {stats.totalPosts}</p>
                <p>Comments: {stats.totalComments}</p>
            </section>
        )}

        <section>
            <h2>Recent Posts</h2>
            {posts.map((post) => (
                <div key={post.id}>
                    <h3>{post.title}</h3>
                    <p>by {post.author} — {post.created_at}</p>
                </div>
            ))}
        </section>
    </div>
);
};

export default TempHomePage;