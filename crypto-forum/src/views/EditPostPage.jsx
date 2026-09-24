import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getPostById, updatePost } from "../services/posts";
import { useEffect, useState } from "react";

function EditPostPage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        const loadPost = async () => {
            setPageLoading(true);
            setError('');

            try {
                const post = await getPostById(id);
                setTitle(post.title);
                setContent(post.content);
            } catch (e) {
                setError(e.message);
            } finally {
                setPageLoading(false);
            }
        };

        loadPost();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');

        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (trimmedTitle.length < 16 || trimmedTitle.length > 64) {
            setError('Title must be between 16 and 64 characters.');
            return;
        }

        if (trimmedContent.length < 32 || trimmedContent.length > 8192) {
            setError('Content must be between 32 and 8192 characters.');
            return;
        }

        try {
            setLoading(true)

            await updatePost(
                id,
                {
                    title: trimmedTitle,
                    content: trimmedContent,
                },
            )

            navigate('/posts');
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Edit Post</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>

                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        minLength={16}
                        maxLength={64}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="content">Content</label>

                    <textarea
                        id="content"
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        minLength={32}
                        maxLength={8192}
                        required
                    />
                </div>

                {error && <p>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save changes'}
                </button>
            </form>
        </div>
    )
};

export default EditPostPage;