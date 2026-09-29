import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { deletePost, getPostById } from "../services/posts";
import { useEffect, useState } from "react";
import { Button, Center, Container, Heading, Spinner, HStack, Text, Box, Stack, Textarea, Dialog, Portal } from '@chakra-ui/react';
import { toaster } from '../components/ui/toast-store.js';
import { formatDate } from "../utils/formatDate.js";
import { useAuth } from "../hooks/useAuth.js";
import { getCommentsByPostId, createComment, updateComment, deleteComment } from "../services/comments.js";
import { castVote, getPostVotes, removeVote } from "../services/votes.js";
import { buildCommentTree } from '../utils/buildCommentTree.js';

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
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentContent, setEditCommentContent] = useState('');
    const [commentToDelete, setCommentToDelete] = useState(null);

    const commentTree = buildCommentTree(comments)

    const handleComment = async (parentCommentId = null) => {
        const content = parentCommentId ? replyContent : newComments;
        try {
            const comment = await createComment(
                content,
                id,
                user.id,
                parentCommentId
            );

            setComments((prev) => [...prev, comment])

            if (parentCommentId) {
                setReplyContent('')
                setReplyingTo(null);
            } else {
                setNewComments('');
            }
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

    const handleEditComment = async (commentId) => {
        try {
            const updatedComment = await updateComment(
                commentId,
                editCommentContent
            );

            setComments((prev) =>
                prev.map((comment) =>
                    comment.id === commentId
                        ? updatedComment
                        : comment
                )
            );

            setEditingCommentId(null);
            setEditCommentContent('');
        } catch (error) {
            console.error(error);

            toaster.create({
                title: error.message,
                type: 'error',
            });
        }
    };

    const handleDeleteComment = async () => {
        try {
            await deleteComment(commentToDelete);

            const updatedComments = await getCommentsByPostId(id);
            setComments(updatedComments);

            setCommentToDelete(null)

            toaster.create({
                title: 'Comment deleted',
                type: 'success',
            });
        } catch (error) {
            toaster.create({
                title: error.message,
                type: 'error',
            });
        }
    }

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

    const renderComment = (comment, depth = 0, parentComment = null) => {
        const isRootComment = depth === 0;
        const shouldIndent = depth > 0 && depth <= 3;
        const isDeepReply = depth > 3;
        const isOwner = comment.author_id === user.id;

        return (
            <Box
                key={comment.id}
                ml={shouldIndent ? 6 : 0}
                mt={depth > 0 ? 2 : 0}
            >
                <Box
                    borderWidth={isRootComment ? '1px' : '0'}
                    borderRadius={isRootComment ? 'md' : '0'}
                    borderLeftWidth={
                        !isRootComment && depth <= 3 ? '1px' : '0'
                    }
                    p={isRootComment ? 4 : 0}
                    pl={!isRootComment && depth <= 3 ? 3 : 0}
                    py={!isRootComment ? 2 : undefined}
                >
                    {isDeepReply && parentComment && (
                        <Text
                            fontSize="xs"
                            color="fg.muted"
                            mb={1}
                        >
                            Replying to {parentComment.profiles.username}
                        </Text>
                    )}

                    {editingCommentId === comment.id ? (
                        <Box>
                            <Textarea
                                size="sm"
                                value={editCommentContent}
                                onChange={(event) =>
                                    setEditCommentContent(event.target.value)
                                }
                            />

                            <HStack mt={2}>
                                <Button
                                    size="xs"
                                    type="button"
                                    onClick={() =>
                                        handleEditComment(comment.id)
                                    }
                                >
                                    Save
                                </Button>

                                <Button
                                    size="xs"
                                    variant="ghost"
                                    type="button"
                                    onClick={() => {
                                        setEditingCommentId(null);
                                        setEditCommentContent('');
                                    }}
                                >
                                    Cancel
                                </Button>
                            </HStack>
                        </Box>
                    ) : (
                        <Text>{comment.content}</Text>
                    )}

                    <Text
                        fontSize="sm"
                        color="fg.muted"
                        mt={1}
                    >
                        by {comment.profiles.username} —{' '}
                        {formatDate(comment.created_at)}
                    </Text>

                    <HStack w="full" mt={1}>
                        <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => {
                                setReplyingTo(comment.id);
                                setReplyContent('');
                            }}
                        >
                            Reply
                        </Button>

                        {isOwner && (
                            <HStack ml="auto">
                                <Button
                                    size="xs"
                                    variant="ghost"
                                    onClick={() => {
                                        setEditingCommentId(comment.id);
                                        setEditCommentContent(
                                            comment.content
                                        );
                                    }}
                                >
                                    Edit
                                </Button>

                                <Button
                                    type="button"
                                    size="xs"
                                    variant="ghost"
                                    colorPalette="red"
                                    onClick={() =>
                                        setCommentToDelete(comment.id)
                                    }
                                >
                                    Delete
                                </Button>
                            </HStack>
                        )}
                    </HStack>

                    {replyingTo === comment.id && (
                        <Box mt={2}>
                            <Textarea
                                size="sm"
                                placeholder={`Reply to ${comment.profiles.username}...`}
                                value={replyContent}
                                onChange={(event) =>
                                    setReplyContent(event.target.value)
                                }
                            />

                            <HStack mt={2}>
                                <Button
                                    size="xs"
                                    onClick={() =>
                                        handleComment(comment.id)
                                    }
                                >
                                    Reply
                                </Button>

                                <Button
                                    size="xs"
                                    variant="ghost"
                                    onClick={() => {
                                        setReplyingTo(null);
                                        setReplyContent('');
                                    }}
                                >
                                    Cancel
                                </Button>
                            </HStack>
                        </Box>
                    )}
                </Box>

                {comment.replies?.length > 0 && (
                    <Box>
                        {comment.replies.map((reply) =>
                            renderComment(
                                reply,
                                depth + 1,
                                comment
                            )
                        )}
                    </Box>
                )}
            </Box>
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
                {commentTree.length === 0 ? (
                    <Text>No comments yet.</Text>
                ) : (
                    commentTree.map((comment) =>
                        renderComment(comment)
                    )
                )}
            </Stack>

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

            <Dialog.Root
                open={commentToDelete !== null}
                onOpenChange={(details) => {
                    if (!details.open) {
                        setCommentToDelete(null);
                    }
                }}
            >
                <Portal>
                    <Dialog.Backdrop />

                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>
                                    Delete comment?
                                </Dialog.Title>
                            </Dialog.Header>

                            <Dialog.Body>
                                <Text>
                                    Are you sure you want to delete this comment?
                                    This action cannot be undone.
                                </Text>
                            </Dialog.Body>

                            <Dialog.Footer>
                                <Button
                                    variant="outline"
                                    onClick={() => setCommentToDelete(null)}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    colorPalette="red"
                                    onClick={handleDeleteComment}
                                >
                                    Delete
                                </Button>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </Container>
    );
};

export default PostDetailsPage;