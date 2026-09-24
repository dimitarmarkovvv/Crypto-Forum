import { useAuth } from '../hooks/useAuth';
import { logoutUser } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getForumStats, getMostCommentedPosts, getRecentPosts } from '../services/homepage';
import { formatDate } from '../utils/formatDate.js'
import { Box, Button, Center, Container, Heading, Spinner, Stack, Text } from '@chakra-ui/react';

function HomePage() {
    const { user, loading } = useAuth();
    const [stats, setStats] = useState(null);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const navigation = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigation('/login')
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
    },[]);

    if (loading) {
        return (
            <Center py={20}>
                <Spinner size='lg' />
            </Center>
        );
    };

return (
    <Container maxW="3xl" py={10}>
        <Heading>Crypto Forum</Heading>

        {user ? (
            <Stack direction="row" align="center" gap={4} mt={4}>
                <Text>Logged in as: {user.email}</Text>
                <Button size="sm" onClick={handleLogout}>Logout</Button>
            </Stack>
        ) : (
            <Text mt={4}>You are logged out</Text>
        )}

        <Box as="section" mt={8}>
            <Text>Crypto Forum is a community for discussing cryptocurrency news, trading strategies, and blockchain technology.</Text>
        </Box>

        {stats && (
            <Box as="section" mt={8}>
                <Text>Users: {stats.totalUsers}</Text>
                <Text>Posts: {stats.totalPosts}</Text>
                <Text>Comments: {stats.totalComments}</Text>
            </Box>
        )}

        <Box as="section" mt={8}>
            <Heading size="lg" mb={4}>Recent Posts</Heading>
            <Stack gap={4}>
                {posts.map((post) => (
                    <Box key={post.id}>
                        <Heading size="md">{post.title}</Heading>
                        <Text color="fg.muted">by {post.author} — {formatDate(post.created_at)}</Text>
                    </Box>
                ))}
            </Stack>
        </Box>

        <Box as="section" mt={8}>
            <Heading size="lg" mb={4}>Most commented posts</Heading>
            <Stack gap={4}>
                {comments.map((comment) => (
                    <Box key={comment.id}>
                        <Heading size="md">{comment.title}</Heading>
                        <Text color="fg.muted">by {comment.author} — {formatDate(comment.created_at)}</Text>
                    </Box>
                ))}
            </Stack>
        </Box>
    </Container>
);
};

export default HomePage;
