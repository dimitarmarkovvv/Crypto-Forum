import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { deletePost, getPostById } from "../services/posts";
import { useEffect, useState } from "react";
import { Button, Center, Container, Heading, Spinner, HStack, Text, Box, Stack, Textarea } from '@chakra-ui/react';
import { toaster } from '../components/ui/toast-store.js';
import { formatDate } from "../utils/formatDate.js";
import { useAuth } from "../hooks/useAuth.js";
import { getCommentsByPostId, createComment } from "../services/comments.js";
import { castVote, getPostVotes, removeVote } from "../services/votes.js";

function PostDetailsPage() {
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const { id } = useParams();
    const [pageLoading, setPageLoading] = useState(true);
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComments, setNewComments] = useState('');
    const [score, setScore] = useState(0);
    const [userVote, setUserVote] = useState(0);

    const handleComment = async () => {
        try {
            const comment = await createComment(newComments, id, user.id);
            setComments((prev) => [...prev, comment]);
            setNewComments('');
        } catch (error) {
            toaster.create({ title: error.message, type: 'error' });
        }
    }

    const handleDelete = async () => {
        try {
            await deletePost(id);
            navigate('/posts');
        } catch (error) {
            toaster.create({ title: error.message, type: 'error' });
        };
    };

    const handleVoteValue = async (value) => {
        try{
        if(userVote === value){
            await removeVote(id, user.id, value);
        } else {
            await castVote(id, user.id, value);
        };

        const { score: fetchedScore, userVote: fetchedUserVote } = await getPostVotes(id, user.id);
        setScore(fetchedScore);
        setUserVote(fetchedUserVote);

        } catch (error) {
            toaster.create({ title: error.message, type: 'error' });
        }
    };

    useEffect(() => {
        const loadPost = async () => {
            setPageLoading(true);

            try {
                const post = await getPostById(id);
                setPost(post);
                const comment = await getCommentsByPostId(id);
                setComments(comment);
                const { score: fetchedScore, userVote: fetchedUserVote } = await getPostVotes(id, user.id);
                setScore(fetchedScore);
                setUserVote(fetchedUserVote);
            } catch (e) {
                toaster.create({ title: e.message, type: 'error' });
            } finally {
                setPageLoading(false);
            };
        };

        loadPost();
    }, [id, user.id]);

    if (pageLoading) {
        return (
            <Center><Spinner /></Center>
        );
    };

    return (
        <Container maxW="3xl" py={10}>
            <Heading mb={6}>{post.title}</Heading>

            <Text mb={4} color="fg.muted">
                by {post.profiles.username} — {formatDate(post.created_at)}
            </Text>

            <Text mb={6}>{post.content}</Text>

            <HStack mb={4}>
                <Button
                    size="sm"
                    colorPalette={userVote === 1 ? 'green' : 'gray'}
                    onClick={() => handleVoteValue(1)}
                >
                    ▲
                </Button>

                <Text fontWeight="bold">{score}</Text>

                <Button
                    size="sm"
                    colorPalette={userVote === -1 ? 'red' : 'gray'}
                    onClick={() => handleVoteValue(-1)}
                >
                    ▼
                </Button>
            </HStack>

            {post.author_id === user.id && (
                <HStack>
                    <Button size="sm" onClick={() => navigate(`/posts/${id}/edit`)}>
                        Edit
                    </Button>

                    <Button size="sm" colorPalette="red" onClick={handleDelete}>
                        Delete
                    </Button>
                </HStack>
            )}

            <Heading size="md" mt={8} mb={4}>Comments</Heading>

            <Stack gap={4}>
                {comments.length === 0 ? (
                    <Text>No comments yet.</Text>
                ) : (
                    comments.map((comment) => (
                        <Box key={comment.id} borderWidth="1px" borderRadius="md" p={3}>
                            <Text>{comment.content}</Text>
                            <Text fontSize="sm" color="fg.muted">
                                by {comment.profiles.username} — {formatDate(comment.created_at)}
                            </Text>
                        </Box>
                    ))
                )}
            </Stack>

            <Textarea
                mt={4}
                placeholder="Write a comment..."
                value={newComments}
                onChange={(event) => setNewComments(event.target.value)}
            />

            <Button mt={2} onClick={handleComment}>
                Post Comment
            </Button>
        </Container>
    );
};

export default PostDetailsPage;