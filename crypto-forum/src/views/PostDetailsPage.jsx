import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { deletePost, getPostById } from "../services/posts";
import { useEffect, useState } from "react";
import { Button, Center, Container, Heading, Spinner, HStack, Text, Stack, Textarea, Box, NativeSelect } from '@chakra-ui/react';
import { toaster } from '../components/ui/toast-store.js';
import { formatDate } from "../utils/formatDate.js";
import { useAuth } from "../hooks/useAuth.js";
import { getCommentsByPostId } from "../services/comments.js";
import { castVote, getPostVotes, removeVote, } from "../services/votes.js";
import { buildCommentTree } from '../utils/buildCommentTree.js';
import Comment from '../components/ui/comments/Comment.jsx'
import DeleteCommentDialog from '../components/ui/comments/DeleteCommentDialog.jsx';
import { useComments } from '../hooks/useComments.js';
import { useCommentVotes } from '../hooks/useCommentVotes.js';

function PostDetailsPage() {
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const { id } = useParams();
    const [pageLoading, setPageLoading] = useState(true);
    const { user, profile } = useAuth();
    const [score, setScore] = useState(0);
    const [userVote, setUserVote] = useState(0);
    const [sort, setSort] = useState('newest');

    const {
        comments,
        setComments,

        newComments,
        setNewComments,

        replyingTo,
        setReplyingTo,

        replyContent,
        setReplyContent,

        editingCommentId,
        setEditingCommentId,

        editCommentContent,
        setEditCommentContent,

        commentToDelete,
        setCommentToDelete,

        handleComment,
        handleEditComment,
        handleDeleteComment,
    } = useComments({
        postId: id,
        user,
        profile,
        sort,
    });

    const {
        commentVotes,
        handleCommentVote,
    } = useCommentVotes({
        comments,
        userId: user.id,
    });

    const commentTree = buildCommentTree(comments);


    const handleDelete = async () => {
        try {
            await deletePost(id);
            navigate('/posts');
        } catch (error) {
            toaster.create({ title: error.message, type: 'error' });
        };
    };

    const handleVoteValue = async (value) => {
        try {
            if (userVote === value) {
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
                const commentData = await getCommentsByPostId(id, sort);
                setComments(commentData);

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
    }, [id, user.id, sort, setComments]);

    if (pageLoading) {
        return (
            <Center><Spinner /></Center>
        );
    };

    return (
        <Container maxW="3xl" py={10}>
            <Heading mb={6}>{post.title}</Heading>

            <Text mb={4} color="fg.muted">
                by{' '}
                <Text
                    as="span"
                    cursor="pointer"
                    _hover={{ textDecoration: 'underline' }}
                    onClick={() => navigate(`/users/${post.author_id}`)}
                >
                    {post.profiles.username}
                </Text>
                {' — '}
                {formatDate(post.created_at)}
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

            <NativeSelect.Root maxW="200px" mb={4}>
                <NativeSelect.Field
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
            </NativeSelect.Root>

            <Heading size="md" mt={8} mb={4}>Comments</Heading>

            <Stack gap={4}>
                {commentTree.length === 0 ? (
                    <Text>No comments yet.</Text>
                ) : (
                    commentTree.map((comment) => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            userId={user.id}
                            isBlocked={profile?.is_blocked}
                            commentVotes={commentVotes}

                            editingCommentId={editingCommentId}
                            editCommentContent={editCommentContent}
                            setEditingCommentId={setEditingCommentId}
                            setEditCommentContent={setEditCommentContent}
                            handleEditComment={handleEditComment}

                            replyingTo={replyingTo}
                            replyContent={replyContent}
                            setReplyingTo={setReplyingTo}
                            setReplyContent={setReplyContent}
                            handleComment={handleComment}

                            handleCommentVote={handleCommentVote}
                            setCommentToDelete={setCommentToDelete}
                        />
                    ))
                )}
            </Stack>

            {profile?.is_blocked ? (
                <Box
                    mt={4}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    bg="bg.subtle"
                >
                    <Text fontWeight="medium" fontSize="sm">
                        Commenting disabled
                    </Text>

                    <Text fontSize="sm" color="fg.muted" mt={1}>
                        You cannot post comments or replies while your account is blocked.
                    </Text>
                </Box>
            ) : (
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleComment();
                    }}
                >
                    <Textarea
                        mt={4}
                        placeholder="Write a comment..."
                        value={newComments}
                        onChange={(event) => setNewComments(event.target.value)}
                        required
                    />

                    <Button mt={2} type="submit">
                        Post Comment
                    </Button>
                </form>
            )}

            <DeleteCommentDialog
                commentToDelete={commentToDelete}
                setCommentToDelete={setCommentToDelete}
                handleDeleteComment={handleDeleteComment}
            />
        </Container>
    );
};

export default PostDetailsPage;