import { useEffect, useState } from "react";
import { deletePost, getPosts } from "../services/posts";
import { formatDate } from "../utils/formatDate";
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from "react-router-dom";

function PostsPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);

    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('newest');
    const [filter, setFilter] = useState('all');

    const pageSize = 10;

    const handleDelete = async (postId) => {
        const confirmed = window.confirm('Are you sure you want to delete this post?');

        if (!confirmed) {
            return;
        }

        try {
            await deletePost(postId);

            setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
        } catch (error) {
            setError(error.message);
        };
    };

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true)
            setError('');

            try {
                const postsData = await getPosts({
                    page: currentPage,
                    pageSize,
                    search,
                    sort,
                    authorID: filter === 'mine' ? user.id : null,
                });

                setPosts(postsData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadPosts();

    }, [currentPage, search, sort, filter, user.id]);


    return (
        <div>
            <h1>Posts</h1>

            <div>
                <input
                    type="text"
                    placeholder="Search posts..."
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value)
                        setCurrentPage(1)
                    }}
                />

                <select
                    value={sort}
                    onChange={(event) => {
                        setSort(event.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                </select>

                <select
                    value={filter}
                    onChange={(event) => {
                        setFilter(event.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="all">All Posts</option>
                    <option value="mine">My posts</option>
                </select>
            </div>


            {loading ? (
                <p>Loading posts...</p>
            ) : error ? (
                <p>{error}</p>
            ) : posts.length === 0 ? (
                <p>No posts available.</p>
            ) : (
                posts.map((post) => (
                    <article key={post.id}>
                        <h2>{post.title}</h2>

                        <p>{post.content}</p>

                        <p>
                            by {post.profiles.username} - {formatDate(post.created_at)}
                        </p>

                        {post.author_id === user.id && (
                            <button onClick={() => navigate(`/posts/${post.id}/edit`)}>
                                Edit
                            </button>
                        )}

                        {post.author_id === user.id &&
                            <button onClick={() => handleDelete(post.id)}>Delete</button>
                        }
                    </article>
                ))
            )}
        </div>
    )
}

export default PostsPage;