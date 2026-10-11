import { useAuth } from '../hooks/useAuth';
import { Link as RouterLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getForumStats, getMostCommentedPosts, getRecentPosts } from '../services/homepage';
import { formatDate } from '../utils/formatDate.js'
import { Badge, Box, Card, Center, Container, Flex, Grid, Heading, SimpleGrid, Spinner, Stack, Text, Link } from '@chakra-ui/react';
import { CryptoTicker } from '../components/ui/CryptoTicker.jsx';
import { Header } from '../components/ui/Header.jsx';
import { LuNewspaper, LuUsers, LuMessageSquare, LuChartNoAxesColumn } from 'react-icons/lu';

function StatRow({ icon, color, label, value }) {
    return (
        <Flex justify="space-between" align="center">
            <Flex align="center" gap="3">
                <Box color={color} fontSize="lg">{icon}</Box>
                <Text color="fg.muted">{label}</Text>
            </Flex>

            <Text fontSize="1xl" fontWeight="bold" color={color}>
                {value}
            </Text>
        </Flex>
    );
}

function HomePage() {
    const { loading } = useAuth();
    const [stats, setStats] = useState(null);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);


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
            <Header />

            <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap="6" mt={8}>
                {stats && (
                    <Card.Root as="section">
                        <Card.Header borderBottomWidth="1px" py="4">
                            <Flex justify="space-between" align="center">
                                <Flex align="center" gap="2">
                                    <Box color="brand.400"><LuChartNoAxesColumn /></Box>
                                    <Heading
                                        size="sm"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                    >
                                        Live statistics
                                    </Heading>
                                </Flex>

                                <Badge colorPalette="green" variant="outline" borderRadius="full" px="3" size="sm">
                                    ● LIVE
                                </Badge>
                            </Flex>
                        </Card.Header>

                        <Card.Body>
                            <Stack gap="5">
                                <StatRow
                                    icon={<LuUsers />}
                                    color="blue.400"
                                    label="Users"
                                    value={stats.totalUsers}
                                />
                                <StatRow
                                    icon={<LuNewspaper />}
                                    color="green.400"
                                    label="Posts"
                                    value={stats.totalPosts}
                                />
                                <StatRow
                                    icon={<LuMessageSquare />}
                                    color="purple.400"
                                    label="Comments"
                                    value={stats.totalComments}
                                />
                            </Stack>
                        </Card.Body>
                    </Card.Root>
                )}

                <Card.Root as="section">
                    <Card.Body>
                        <Text color="fg.muted">LearnCrypto is a community for discussing cryptocurrency news, trading strategies, and blockchain technology.</Text>
                    </Card.Body>
                </Card.Root>
            </Grid>

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
