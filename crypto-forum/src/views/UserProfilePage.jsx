import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Center, Container, Heading, Avatar, Spinner, Stack, Text, Box, Grid, Button
} from '@chakra-ui/react';
import { getAvatarUrl, getUserProfileById } from '../services/profiles';
import { getPosts } from '../services/posts.js';
import { formatDate } from '../utils/formatDate.js';
import { getCommentsByAuthorId } from '../services/comments.js';
import { useAuth } from '../hooks/useAuth.js';

function UserProfilePage() {
    const { id } = useParams();
    const { user} = useAuth();

    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                setError('');

                const profile = await getUserProfileById(id);
                if (!profile) {
                    setUserProfile(null);
                    return;
                }
                setUserProfile(profile)

                const userPosts = await getPosts({
                    authorID: id,
                    pageSize: 100,
                });

                setPosts(userPosts);

                const userComments = await getCommentsByAuthorId(id);
                setComments(userComments);
                console.log(userComments)
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false)
            }
        };

        loadProfile()
    }, [id])

    if (loading) {
        return (
            <Center py={10}>
                <Spinner size="lg" />
            </Center>
        );
    }

    if (error) {
        return (
            <Container maxW="2x1" py={10}>
                <Text color="red.500">
                    Failed to load profile: {error}
                </Text>
            </Container>
        )
    }

    if (!userProfile) {
        return (
            <Center minH="70vh">
                <Stack align="center" gap={6}>
                    <Heading size="2xl">
                        User not found.
                    </Heading>

                    <Text color="fg.muted" fontSize="lg">
                        The user you are looking for does not exist.
                    </Text> 

                    <Button
                        size="lg"
                        onClick={() => navigate('/')}
                    >
                        Go to Home
                    </Button>
                </Stack>
            </Center>
        )
    }

    return (
        <Container maxW="6xl" py={10}>
            <Grid
                templateColumns={{
                    base: '1fr',
                    md: '280px 1fr',
                }}
                gap={10}
                alignItems="start"
            >
                <Box>
                    <Stack gap={4}>
                        <Avatar.Root
                            w="120px"
                            h="120px"
                            borderRadius="full"
                            overflow="hidden"
                        >
                            <Avatar.Fallback
                                name={`${userProfile.first_name} ${userProfile.last_name}`}
                            />

                            {userProfile.avatar_url && (
                                <Avatar.Image
                                    src={getAvatarUrl(userProfile.avatar_url)}
                                    alt={`${userProfile.username}'s avatar`}
                                />
                            )}
                        </Avatar.Root>
                        <Heading size="md">
                            {userProfile.username}
                        </Heading>

                        <Text>
                            {userProfile.first_name} {userProfile.last_name}
                        </Text>

                        {userProfile.location && (
                            <Text color="fg.muted">
                                Location: {userProfile.location}
                            </Text>
                        )}

                        {userProfile.gender && (
                            <Text color="fg.muted">
                                Gender: {userProfile.gender}
                            </Text>
                        )}

                        {userProfile.signature && (
                            <Text fontStyle="italic">
                                {userProfile.signature}
                            </Text>
                        )}

                        {user.id === userProfile.id && (
                            <Button onClick={() => navigate('/profile/edit')}>
                                Edit Profile
                            </Button>
                        )}
                    </Stack>
                </Box>

                <Box>
                    <Heading size="md" mb={4}>
                        Posts
                    </Heading>

                    {posts.length === 0 ? (
                        <Text color="fg.muted">
                            This user has not created any posts yet.
                        </Text>
                    ) : (
                        <Stack gap={4}>
                            {posts.map((post) => (
                                <Box
                                    key={post.id}
                                    borderWidth="1px"
                                    borderRadius="md"
                                    p={4}
                                >
                                    <Heading
                                        size="sm"
                                        cursor="pointer"
                                        _hover={{ textDecoration: 'underline' }}
                                        onClick={() => navigate(`/posts/${post.id}`)}
                                    >
                                        {post.title}
                                    </Heading>

                                    <Text mt={2}>
                                        {post.content}
                                    </Text>

                                    <Text
                                        mt={2}
                                        fontSize="sm"
                                        color="fg.muted"
                                    >
                                        {formatDate(post.created_at)}
                                    </Text>
                                </Box>
                            ))}
                        </Stack>
                    )}

                    <Heading size="md" mt={10} mb={4}>
                        Comments
                    </Heading>

                    {comments.length === 0 ? (
                        <Text color="fg.muted">
                            This user has not created any comments yet.
                        </Text>
                    ) : (
                        <Stack gap={4}>
                            {comments.map((comment) => (
                                <Box
                                    key={comment.id}
                                    borderWidth="1px"
                                    borderRadius="md"
                                    p={4}
                                >
                                    <Text>
                                        {comment.content}
                                    </Text>

                                    <Text
                                        as="span"
                                        cursor="pointer"
                                        _hover={{ textDecoration: 'underline' }}
                                        onClick={() => navigate(`/posts/${comment.posts.id}`)}
                                    >
                                        on {comment.posts.title}
                                    </Text>

                                    <Text
                                        mt={1}
                                        fontSize="sm"
                                        color="fg.muted"
                                    >
                                        {formatDate(comment.created_at)}
                                    </Text>
                                </Box>
                            ))}
                        </Stack>
                    )}
                </Box>
            </Grid>
        </Container>
    );
}

export default UserProfilePage;
