import { useEffect, useState } from "react";
import { getPosts } from "../services/posts";
import { formatDate } from "../utils/formatDate";

function PostsPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadPosts = async () => {
            try{
                const postsData = await getPosts();
                setPosts(postsData);
            } catch(error){
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadPosts();

    }, []);

    if(loading){
        return <p>Loading posts...</p>
    }

    if(error){
        return <p>{error}</p>
    }

    return (
        <div>
            <h1>Posts</h1>

            {posts.length === 0 ? (
                <p>No posts available.</p>
            ) : (
                posts.map((post) => (
                    <article key={post.id}>
                        <h2>{post.title}</h2>

                        <p>{post.content}</p>

                        <p>
                            by {post.author} - {formatDate(post.created_at)}
                        </p>
                    </article>
                ))
            )}
        </div>
    )
}

export default PostsPage;