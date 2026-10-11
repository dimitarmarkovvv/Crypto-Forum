import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { LuMapPin, LuUser, LuPencil, LuNewspaper, LuMessageSquare } from 'react-icons/lu';
import {
    Card, Center, Container, Flex, Heading, Avatar, Spinner, Stack, Text, Box, Grid, Button, Link
} from '@chakra-ui/react';
import { getAvatarUrl, getUserProfileById } from '../services/profiles';
import { getPosts } from '../services/posts.js';
import { formatDate } from '../utils/formatDate.js';
import { getCommentsByAuthorId } from '../services/comments.js';
import { useAuth } from '../hooks/useAuth.js';
import { Header } from '../components/ui/Header.jsx';

function MetaRow({ icon, text }) {
    return (
        <Flex align="center" gap={2} color="fg.muted" fontSize="sm">
            <Box>{icon}</Box>
            <Text textTransform="capitalize">{text}</Text>
        </Flex>
    );
}

function SectionTitle({ icon, title, count }) {
    return (
        <Flex align="center" gap={2}>
            <Box color="brand.400">{icon}</Box>

            <Heading size="sm" textTransform="uppercase" letterSpacing="wider">
                {title}
            </Heading>

            <Text color="fg.muted" fontSize="sm">({count})</Text>
        </Flex>
    );
}

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
            <Header />

            <Grid
                templateColumns={{ base: '1fr', md: '300px 1fr' }}
                gap={8}
                alignItems="start"
                mt={8}
            >
                <Card.Root as="aside">
                    <Card.Body>
                        <Stack gap={5} align="center" textAlign="center">
                            <Avatar.Root w="120px" h="120px" borderRadius="full" overflow="hidden">
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

                            <Stack gap={1}>
                                <Heading size="lg">{userProfile.username}</Heading>

                                <Text color="fg.muted">
                                    {userProfile.first_name} {userProfile.last_name}
                                </Text>
                            </Stack>

                            {(userProfile.location || userProfile.gender) && (
                                <Stack gap={2} width="full" borderTopWidth="1px" pt={4}>
                                    {userProfile.location && (
                                        <MetaRow icon={<LuMapPin />} text={userProfile.location} />
                                    )}

                                    {userProfile.gender && (
                                        <MetaRow icon={<LuUser />} text={userProfile.gender} />
                                    )}
                                </Stack>
                            )}

                            {userProfile.signature && (
                                <Text fontStyle="italic" color="fg.muted" fontSize="sm">
                                    &ldquo;{userProfile.signature}&rdquo;
                                </Text>
                            )}

                            {user.id === userProfile.id && (
                                <Button
                                    size="sm"
                                    width="full"
                                    onClick={() => navigate('/profile/edit')}
                                >
                                    <LuPencil /> Edit Profile
                                </Button>
                            )}
                        </Stack>
                    </Card.Body>
                </Card.Root>

                <Stack gap={8}>
                    <Card.Root as="section">
                        <Card.Header borderBottomWidth="1px" py="4">
                            <SectionTitle
                                icon={<LuNewspaper />}
                                title="Posts"
                                count={posts.length}
                            />
                        </Card.Header>

                        <Card.Body>
                            {posts.length === 0 ? (
                                <Text color="fg.muted">
                                    This user has not created any posts yet.
                                </Text>
                            ) : (
                                <Stack gap={0}>
                                    {posts.map((post) => (
                                        <Box
                                            key={post.id}
                                            py={4}
                                            borderBottomWidth="1px"
                                            _last={{ borderBottomWidth: 0, pb: 0 }}
                                            _first={{ pt: 0 }}
                                        >
                                            <Heading size="sm" asChild>
                                                <RouterLink to={`/posts/${post.id}`}>
                                                    {post.title}
                                                </RouterLink>
                                            </Heading>

                                            <Text mt={2} color="fg.muted" lineClamp={2}>
                                                {post.content}
                                            </Text>

                                            <Text mt={2} fontSize="sm" color="fg.muted">
                                                {formatDate(post.created_at)}
                                            </Text>
                                        </Box>
                                    ))}
                                </Stack>
                            )}
                        </Card.Body>
                    </Card.Root>

                    <Card.Root as="section">
                        <Card.Header borderBottomWidth="1px" py="4">
                            <SectionTitle
                                icon={<LuMessageSquare />}
                                title="Comments"
                                count={comments.length}
                            />
                        </Card.Header>

                        <Card.Body>
                            {comments.length === 0 ? (
                                <Text color="fg.muted">
                                    This user has not created any comments yet.
                                </Text>
                            ) : (
                                <Stack gap={0}>
                                    {comments.map((comment) => (
                                        <Box
                                            key={comment.id}
                                            py={4}
                                            borderBottomWidth="1px"
                                            _last={{ borderBottomWidth: 0, pb: 0 }}
                                            _first={{ pt: 0 }}
                                        >
                                            <Text>{comment.content}</Text>

                                            <Text mt={2} fontSize="sm" color="fg.muted">
                                                on{' '}
                                                <Link asChild color="inherit">
                                                    <RouterLink to={`/posts/${comment.posts.id}`}>
                                                        {comment.posts.title}
                                                    </RouterLink>
                                                </Link>
                                                {' · '}
                                                {formatDate(comment.created_at)}
                                            </Text>
                                        </Box>
                                    ))}
                                </Stack>
                            )}
                        </Card.Body>
                    </Card.Root>
                </Stack>
            </Grid>
        </Container>
    );
}

export default UserProfilePage;
