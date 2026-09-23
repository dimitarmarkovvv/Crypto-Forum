import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from 'react';
import { createPost } from '../services/posts';

function CreatPostPage() {
    const { user } = useAuth();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async () => {
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

            await createPost(
                {
                    title: trimmedTitle,
                    content: trimmedContent,
                },
                user.id
            )

            navigate('/posts');
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Create Post</h1>

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
                    {loading ? 'Creating...' : 'Create Post'}
                </button>
            </form>
        </div>
    )
}

export default CreatPostPage;