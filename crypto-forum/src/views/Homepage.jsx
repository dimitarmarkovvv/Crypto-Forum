import { useAuth } from '../hooks/useAuth';
import { logoutUser } from '../services/auth';
import { useNavigate, Link as RouterLink} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getForumStats, getMostCommentedPosts, getRecentPosts } from '../services/homepage';
import { formatDate } from '../utils/formatDate.js'
import { Box, Button, Card, Center, Container, Flex, Heading, SimpleGrid, Spinner, Stack, Text, Link } from '@chakra-ui/react';
import { CryptoTicker } from '../components/ui/CryptoTicker.jsx';
import { LuNewspaper, LuUsers, LuShield, LuLogOut } from 'react-icons/lu';

function HomePage() {
    const { user, profile, loading } = useAuth();
    const [stats, setStats] = useState(null);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();

    const handleLogout = async (userId) => {
        try {
            await logoutUser(userId);
            navigate('/login')
        } catch (error) {
            console.error(error.message);
        };
    };

    useEffect(() => {
        const loadHomePageData = async () => {
            const statsData = await getForumStats();
            const postData = await getRecentPosts();
            const commentData = await getMostCommentedPosts();

            setPosts(postData);
            setStats(statsData);
            setComments(commentData);
        };

        loadHomePageData();
    }, []);

    if (loading) {
        return (
            <Center py={20}>
                <Spinner size='lg' />
            </Center>
        );
    };

    return (
        <Container maxW="6xl" py={10}>
            <Flex
                as="header"
                justify="space-between"
                align="center"
                gap="4"
                pb="4"
                mb="2"
                borderBottomWidth="1px"
            >
                <Heading>LearnCrypto</Heading>

                {user ? (
                    <Stack direction="row" align="center" gap="1">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/posts')}>
                            <LuNewspaper /> Posts
                        </Button>

                        <Button variant="ghost" size="sm" onClick={() => navigate('/users/search')}>
                            <LuUsers /> Search Users
                        </Button>

                        {profile?.role === 'admin' && (
                            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
                                <LuShield /> Admin Dashboard
                            </Button>
                        )}

                        <Button variant="ghost" size="sm" onClick={() => handleLogout(user.id)}>
                            <LuLogOut /> Logout
                        </Button>
                    </Stack>
                ) : (
                    <Text color="fg.muted">You are logged out</Text>
                )}
            </Flex>

            <Card.Root as="section" mt={8}>
                <Card.Body>
                    <Text color="fg.muted">LearnCrypto is a community for discussing cryptocurrency news, trading strategies, and blockchain technology.</Text>
                </Card.Body>
            </Card.Root>

            {stats && (
                <Card.Root as="section" mt={8}>
                    <Card.Body>
                        <Text color="fg.muted">Users: {stats.totalUsers}</Text>
                        <Text color="fg.muted">Posts: {stats.totalPosts}</Text>
                        <Text color="fg.muted">Comments: {stats.totalComments}</Text>
                    </Card.Body>
                </Card.Root>
            )}

            <CryptoTicker />

            <SimpleGrid columns={{ base: 1, md: 2 }} gap="8" mt={8}>
                <Card.Root as="section">
                    <Card.Header>
                        <Heading size="lg">Recent Posts</Heading>
                    </Card.Header>
                    <Card.Body>
                        <Stack gap={4}>
                            {posts.map((post) => (
                                <Box key={post.id}>
                                    <Heading size="md" asChild>
                                    <RouterLink to={`/posts/${post.id}`}>{post.title}</RouterLink>
                                    </Heading>
                                    <Text color="fg.muted"> by {' '}
                                    <Link asChild>
                                    <RouterLink to={`/users/${post.author_id}`}>{post.author}</RouterLink>
                                    </Link>
                                    {' - '} {formatDate(post.created_at)}</Text>
                                </Box>
                            ))}
                        </Stack>
                    </Card.Body>
                </Card.Root>

                <Card.Root as="section">
                    <Card.Header>
                        <Heading size="lg">Most commented posts</Heading>
                    </Card.Header>
                    <Card.Body>
                        <Stack gap={4}>
                            {comments.map((comment) => (
                                <Box key={comment.id}>
                                    <Heading size="md" asChild>
                                    <RouterLink to={`/posts/${comment.id}`}>{comment.title}</RouterLink>
                                    </Heading>
                                    <Text color="fg.muted"> by {' '}
                                        <Link asChild>
                                        <RouterLink to={`/users/${comment.author_id}`}>{comment.author}</RouterLink>
                                        </Link>
                                        {' - '} {formatDate(comment.created_at)}</Text>
                                </Box>
                            ))}
                        </Stack>
                    </Card.Body>
                </Card.Root>
            </SimpleGrid>
        </Container>
    );
};

export default HomePage;
