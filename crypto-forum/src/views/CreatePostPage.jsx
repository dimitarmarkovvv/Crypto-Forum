import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from 'react';
import { createPost } from '../services/posts';
import { Button, Container, Field, Heading, Input, Stack, Textarea, Alert} from '@chakra-ui/react';
import { toaster } from '../components/ui/toast-store.js';

function CreatePostPage() {
    const { user, profile } = useAuth();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    if (profile?.is_blocked) {
        return (
            <Container maxW="2x1" py={10}>
                <Alert.Root status="error">
                    <Alert.Indicator />

                    <Alert.Content>
                        <Alert.Title>
                            You cannot Create posts
                        </Alert.Title>

                        <Alert.Description>
                            Your account is currently blocked. You can still browse the forum,
                            but you cannot create posts until an administrator unblocks your
                            account.
                        </Alert.Description>
                    </Alert.Content>
                </Alert.Root>

                <Button mt={4} onClick={() => navigate('/posts')}>
                    Back to Posts
                </Button>
            </Container>
        )
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (trimmedTitle.length < 16 || trimmedTitle.length > 64) {
            toaster.create({ title: 'Title must be between 16 and 64 characters.', type: 'error' });
            return;
        };

        if (trimmedContent.length < 32 || trimmedContent.length > 8192) {
            toaster.create({ title: 'Content must be between 32 and 8192 characters.', type: 'error' });
            return;
        };

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

export default CreatePostPage;
