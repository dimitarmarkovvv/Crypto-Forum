import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getPostById, updatePost } from "../services/posts";
import { useEffect, useState } from "react";
import { Button, Center, Container, Field, Heading, Input, Spinner, Stack, Textarea } from '@chakra-ui/react';
import { toaster } from '../components/ui/toast-store.js';

function EditPostPage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        const loadPost = async () => {
            setPageLoading(true);

            try {
                const post = await getPostById(id);
                setTitle(post.title);
                setContent(post.content);
            } catch (e) {
                toaster.create({ title: e.message, type: 'error' });
            } finally {
                setPageLoading(false);
            }
        };

        loadPost();
    }, [id]);

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

            await updatePost(
                id,
                {
                    title: trimmedTitle,
                    content: trimmedContent,
                },
            )

            navigate('/posts');
        } catch (error) {
            toaster.create({ title: error.message, type: 'error' })
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <Center py={20}>
                <Spinner size="lg" />
            </Center>
        );
    }

    return (
        <Container maxW="2xl" py={10}>
            <Heading mb={6}>Edit Post</Heading>

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

                    <Button type="submit" loading={loading} loadingText="Saving...">
                        Save changes
                    </Button>
                </Stack>
            </form>
        </Container>
    )
};

export default EditPostPage;
