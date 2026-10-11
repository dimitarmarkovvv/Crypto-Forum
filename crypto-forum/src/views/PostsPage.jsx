import { useEffect, useState } from "react";
import { deletePost, getPosts } from "../services/posts";
import { formatDate } from "../utils/formatDate";
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
    Box,
    Button,
    Center,
    Container,
    Heading,
    HStack,
    Input,
    Link,
    NativeSelect,
    Spinner,
    Stack,
    Text,
} from "@chakra-ui/react";
import { toaster } from '../components/ui/toast-store.js';
import { Header } from '../components/ui/Header.jsx';
import { LuPencil, LuTrash2 } from 'react-icons/lu';
import DeletePostDialog from '../components/ui/DeletePostDialog.jsx';

function PostsPage() {
    const { user, profile } = useAuth();
    const isAdmin = profile?.role === 'admin';
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);

    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('newest');
    const [filter, setFilter] = useState('all');
    const [postToDelete, setPostToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const pageSize = 10;

    const handleDelete = async () => {
        setDeleting(true);

        try {
            await deletePost(postToDelete);

            setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postToDelete));
        } catch (error) {
            toaster.create({ title: error.message, type: 'error' });
        } finally {
            setDeleting(false);
            setPostToDelete(null);
        };
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
        <Container maxW="6xl" py={10}>
            <Header />

            <HStack justify="space-between" mb={6}>
                <Heading>Posts</Heading>

                <Button
                    onClick={() => navigate('/posts/create')}
                    disabled={profile?.is_blocked}
                >
                    Create Post
                </Button>
            </HStack>

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
                            <Heading size="md" asChild>
                                <RouterLink to={`/posts/${post.id}`}>{post.title}</RouterLink>
                            </Heading>

                            <Text mt={2}>{post.content}</Text>

                            <Text mt={2} color="fg.muted">
                                by{' '}
                                <Link asChild>
                                    <RouterLink to={`/users/${post.author_id}`}>
                                        {post.profiles.username}
                                    </RouterLink>
                                </Link>
                                {' - '}
                                {formatDate(post.created_at)}
                            </Text>
                            <Text mt={1} color="fg.muted" fontSize="sm">
                                {post.commentCount} {post.commentCount === 1 ? 'comment' : 'comments'}
                            </Text>

                            {(post.author_id === user.id || isAdmin) && (
                                <HStack mt={4}>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        disabled={profile?.is_blocked}
                                        onClick={() => navigate(`/posts/${post.id}/edit`)}
                                    >
                                        <LuPencil /> Edit
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        colorPalette="red"
                                        onClick={() => setPostToDelete(post.id)}
                                    >
                                        <LuTrash2 /> Delete
                                    </Button>
                                </HStack>
                            )}
                        </Box>
                    ))}
                </Stack>
            )}

            <DeletePostDialog
                open={postToDelete !== null}
                setOpen={() => setPostToDelete(null)}
                handleDeletePost={handleDelete}
                loading={deleting}
            />
        </Container>
    )
}

export default PostsPage;
