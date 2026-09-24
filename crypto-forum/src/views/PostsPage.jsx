import { useEffect, useState } from "react";
import { deletePost, getPosts } from "../services/posts";
import { formatDate } from "../utils/formatDate";
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Center,
    Container,
    Heading,
    HStack,
    Input,
    NativeSelect,
    Spinner,
    Stack,
    Text,
} from "@chakra-ui/react";
import { toaster } from '../components/ui/toast-store.js';

function PostsPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);

    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('newest');
    const [filter, setFilter] = useState('all');

    const pageSize = 10;

    const handleDelete = (postId) => {
        const toastId = toaster.create({
            title: 'Delete this post?',
            description: 'This action cannot be undone.',
            type: 'warning',
            duration: Infinity,
            closable: true,
            action: {
                label: 'Delete',
                onClick: async () => {
                    toaster.dismiss(toastId);

                    try {
                        await deletePost(postId);

                        setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
                    } catch (error) {
                        toaster.create({ title: error.message, type: 'error' });
                    };
                },
            },
        });
    };

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true)

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
                toaster.create({ title: error.message, type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        loadPosts();

    }, [currentPage, search, sort, filter, user.id]);


    return (
        <Container maxW="3xl" py={10}>
            <Heading mb={6}>Posts</Heading>

            <HStack mb={6} gap={4} wrap="wrap">
                <Input
                    type="text"
                    placeholder="Search posts..."
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value)
                        setCurrentPage(1)
                    }}
                    maxW="sm"
                />

                <NativeSelect.Root maxW="200px">
                    <NativeSelect.Field
                        value={sort}
                        onChange={(event) => {
                            setSort(event.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                </NativeSelect.Root>

                <NativeSelect.Root maxW="200px">
                    <NativeSelect.Field
                        value={filter}
                        onChange={(event) => {
                            setFilter(event.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="all">All Posts</option>
                        <option value="mine">My posts</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                </NativeSelect.Root>
            </HStack>

            {loading ? (
                <Center py={10}>
                    <Spinner size="lg" />
                </Center>
            ) : posts.length === 0 ? (
                <Text>No posts available.</Text>
            ) : (
                <Stack gap={6}>
                    {posts.map((post) => (
                        <Box key={post.id} as="article" borderWidth="1px" borderRadius="md" p={4}>
                            <Heading size="md">{post.title}</Heading>

                            <Text mt={2}>{post.content}</Text>

                            <Text mt={2} color="fg.muted">
                                by {post.profiles.username} - {formatDate(post.created_at)}
                            </Text>

                            {post.author_id === user.id && (
                                <HStack mt={4}>
                                    <Button size="sm" onClick={() => navigate(`/posts/${post.id}/edit`)}>
                                        Edit
                                    </Button>

                                    <Button size="sm" colorPalette="red" onClick={() => handleDelete(post.id)}>
                                        Delete
                                    </Button>
                                </HStack>
                            )}
                        </Box>
                    ))}
                </Stack>
            )}
        </Container>
    )
}

export default PostsPage;
