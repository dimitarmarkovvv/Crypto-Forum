import { useNavigate, Link as RouterLink } from "react-router-dom";
import { LuPencil, LuTrash2, LuMessageSquare } from 'react-icons/lu';
import { useParams } from "react-router-dom";
import { deletePost, getPostById } from "../services/posts";
import { useEffect, useState } from "react";
import { Button, Card, Center, Container, Flex, Heading, IconButton, Spacer, Spinner, HStack, Text, Stack, Textarea, Box, NativeSelect, Link } from '@chakra-ui/react';
import { toaster } from '../components/ui/toast-store.js';
import { formatDate } from "../utils/formatDate.js";
import { useAuth } from "../hooks/useAuth.js";
import { Header } from '../components/ui/Header.jsx';
import { getCommentsByPostId } from "../services/comments.js";
import { castVote, getPostVotes, removeVote, } from "../services/votes.js";
import { buildCommentTree } from '../utils/buildCommentTree.js';
import Comment from '../components/ui/comments/Comment.jsx'
import DeleteCommentDialog from '../components/ui/comments/DeleteCommentDialog.jsx';
import DeletePostDialog from '../components/ui/DeletePostDialog.jsx';
import { useComments } from '../hooks/useComments.js';
import { useCommentVotes } from '../hooks/useCommentVotes.js';

function PostDetailsPage() {
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const { id } = useParams();
    const [pageLoading, setPageLoading] = useState(true);
    const { user, profile } = useAuth();
    const isAdmin = profile?.role === 'admin';
    const [score, setScore] = useState(0);
    const [userVote, setUserVote] = useState(0);
    const [sort, setSort] = useState('newest');
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

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
        setDeleting(true);

        try {
            await deletePost(id);
            navigate('/posts');
        } catch (error) {
            toaster.create({ title: error.message, type: 'error' });
            setDeleteOpen(false);
        } finally {
            setDeleting(false);
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
        <Container maxW="4xl" py={10}>
            <Header />

            <Card.Root as="article" mt={8}>
                <Card.Body>
                    <Heading mb={3}>{post.title}</Heading>

                    <Text mb={5} color="fg.muted" fontSize="sm">
                        by{' '}
                        <Link asChild color="inherit">
                            <RouterLink to={`/users/${post.author_id}`}>
                                {post.profiles.username}
                            </RouterLink>
                        </Link>
                        {' · '}
                        {formatDate(post.created_at)}
                    </Text>

                    <Text whiteSpace="pre-wrap">{post.content}</Text>
                </Card.Body>

                <Card.Footer borderTopWidth="1px" pt="4">
                    <HStack gap={1}>
                        <IconButton
                            aria-label="Upvote"
                            size="sm"
                            variant={userVote === 1 ? 'subtle' : 'ghost'}
                            colorPalette={userVote === 1 ? 'green' : 'gray'}
                            onClick={() => handleVoteValue(1)}
                        >
                            ▲
                        </IconButton>

                        <Text fontWeight="bold" minW="8" textAlign="center">
                            {score}
                        </Text>

                        <IconButton
                            aria-label="Downvote"
                            size="sm"
                            variant={userVote === -1 ? 'subtle' : 'ghost'}
                            colorPalette={userVote === -1 ? 'red' : 'gray'}
                            onClick={() => handleVoteValue(-1)}
                        >
                            ▼
                        </IconButton>
                    </HStack>

                    <Spacer />

                    {(post.author_id === user.id || isAdmin) && (
                        <HStack gap={2}>
                            <Button
                                size="sm"
                                variant="ghost"
                                disabled={profile?.is_blocked}
                                onClick={() => navigate(`/posts/${id}/edit`)}
                            >
                                <LuPencil /> Edit
                            </Button>

                            <Button
                                size="sm"
                                variant="ghost"
                                colorPalette="red"
                                onClick={() => setDeleteOpen(true)}
                            >
                                <LuTrash2 /> Delete
                            </Button>
                        </HStack>
                    )}
                </Card.Footer>
            </Card.Root>

            <Card.Root as="section" mt={8}>
                <Card.Header borderBottomWidth="1px" py="4">
                    <Flex justify="space-between" align="center" gap="4">
                        <Flex align="center" gap={2}>
                            <Box color="brand.400"><LuMessageSquare /></Box>

                            <Heading size="sm" textTransform="uppercase" letterSpacing="wider">
                                Comments
                            </Heading>

                            <Text color="fg.muted" fontSize="sm">
                                ({commentTree.length})
                            </Text>
                        </Flex>

                        <NativeSelect.Root size="sm" maxW="140px">
                            <NativeSelect.Field
                                value={sort}
                                onChange={(event) => setSort(event.target.value)}
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Flex>
                </Card.Header>

                <Card.Body>

            <Stack gap={4}>
                {commentTree.length === 0 ? (
                    <Text>No comments yet.</Text>
                ) : (
                    commentTree.map((comment) => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            userId={user.id}
                            isAdmin={isAdmin}
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
                </Card.Body>
            </Card.Root>

            <DeletePostDialog
                open={deleteOpen}
                setOpen={setDeleteOpen}
                handleDeletePost={handleDelete}
                loading={deleting}
            />

            <DeleteCommentDialog
                commentToDelete={commentToDelete}
                setCommentToDelete={setCommentToDelete}
                handleDeleteComment={handleDeleteComment}
            />
        </Container>
    );
};

export default PostDetailsPage;