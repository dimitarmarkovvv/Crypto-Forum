import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from 'react';
import { createPost } from '../services/posts';
import { Button, Container, Field, Heading, Input, Stack, Textarea } from '@chakra-ui/react';
import { toaster } from '../components/ui/toast-store.js';

function CreatPostPage() {
    const { user } = useAuth();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (trimmedTitle.length < 16 || trimmedTitle.length > 64) {
            toaster.create({ title: 'Title must be between 16 and 64 characters.', type: 'error' });
            return;
        }

        if (trimmedContent.length < 32 || trimmedContent.length > 8192) {
            toaster.create({ title: 'Content must be between 32 and 8192 characters.', type: 'error' });
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
            toaster.create({ title: error.message, type: 'error' })
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxW="2xl" py={10}>
            <Heading mb={6}>Create Post</Heading>

            <form onSubmit={handleSubmit}>
                <Stack gap={4}>
                    <Field.Root required>
                        <Field.Label>Title</Field.Label>
                        <Input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            minLength={16}
                            maxLength={64}
                            required
                        />
                    </Field.Root>

                    <Field.Root required>
                        <Field.Label>Content</Field.Label>

                        <Textarea
                            id="content"
                            value={content}
                            onChange={(event) => setContent(event.target.value)}
                            minLength={32}
                            maxLength={8192}
                            required
                        />
                    </Field.Root>

                    <Button type="submit" loading={loading} loadingText="Creating...">
                        Create Post
                    </Button>
                </Stack>
            </form>
        </Container>
    )
}

export default CreatPostPage;
