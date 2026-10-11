import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from 'react';
import { createPost } from '../services/posts';
import { Alert, Box, Button, Card, Container, Field, Flex, Heading, Input, Stack, Text, Textarea } from '@chakra-ui/react';
import { toaster } from '../components/ui/toast-store.js';
import { Header } from '../components/ui/Header.jsx';
import { LuPenLine } from 'react-icons/lu';

function CreatePostPage() {
    const { user, profile } = useAuth();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    if (profile?.is_blocked) {
        return (
            <Container maxW="4xl" py={10}>
                <Header />

                <Alert.Root mt={8} status="error">
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
        <Container maxW="4xl" py={10}>
            <Header />

            <Card.Root mt={8}>
                <Card.Header borderBottomWidth="1px" py="4">
                    <Flex align="center" gap={2}>
                        <Box color="brand.400"><LuPenLine /></Box>

                        <Heading size="sm" textTransform="uppercase" letterSpacing="wider">
                            Create a post
                        </Heading>
                    </Flex>
                </Card.Header>

                <Card.Body>
                    <form onSubmit={handleSubmit}>
                        <Stack gap={6}>
                            <Field.Root required>
                                <Field.Label>Title</Field.Label>

                                <Input
                                    type="text"
                                    id="title"
                                    placeholder="Ask something the forum can actually answer"
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    minLength={16}
                                    maxLength={64}
                                    required
                                />

                                <Field.HelperText>
                                    <Text
                                        as="span"
                                        color={title.length < 16 ? 'red.500' : 'fg.muted'}
                                    >
                                        {title.length < 16
                                            ? `${16 - title.length} more characters needed`
                                            : 'Looks good'}
                                    </Text>
                                    {' · '}
                                    {title.length}/64
                                </Field.HelperText>
                            </Field.Root>

                            <Field.Root required>
                                <Field.Label>Content</Field.Label>

                                <Textarea
                                    id="content"
                                    placeholder="Give some context, then ask your question. Posts that explain the reasoning behind them get better replies."
                                    value={content}
                                    onChange={(event) => setContent(event.target.value)}
                                    minLength={32}
                                    maxLength={8192}
                                    rows={14}
                                    resize="vertical"
                                    required
                                />

                                <Field.HelperText>
                                    <Text
                                        as="span"
                                        color={content.length < 32 ? 'red.500' : 'fg.muted'}
                                    >
                                        {content.length < 32
                                            ? `${32 - content.length} more characters needed`
                                            : 'Looks good'}
                                    </Text>
                                    {' · '}
                                    {content.length}/8192
                                </Field.HelperText>
                            </Field.Root>


                            <Stack direction="row" gap={3}>
                                <Button type="submit" loading={loading} loadingText="Creating...">
                                    Create Post
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    disabled={loading}
                                    onClick={() => navigate('/posts')}
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </Card.Body>
            </Card.Root>
        </Container>
    )
}

export default CreatePostPage;
