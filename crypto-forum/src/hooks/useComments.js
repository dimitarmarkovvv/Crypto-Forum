import { useState } from 'react';
import {
    createComment,
    updateComment,
    deleteComment,
    getCommentsByPostId,
} from '../services/comments.js';
import { toaster } from '../components/ui/toast-store.js';

export function useComments({
    postId,
    user,
    profile,
    sort,
}) {
    const [comments, setComments] = useState([]);
    const [newComments, setNewComments] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentContent, setEditCommentContent] = useState('');
    const [commentToDelete, setCommentToDelete] = useState(null);

    const handleComment = async (parentCommentId = null) => {
        const content = parentCommentId
            ? replyContent
            : newComments;

        if (profile?.is_blocked) {
            toaster.create({
                title: 'Your account has been blocked.',
                type: 'error',
            });

            return;
        }

        try {
            const comment = await createComment(
                content,
                postId,
                user.id,
                parentCommentId
            );

            setComments((prev) => [...prev, comment]);

            if (parentCommentId) {
                setReplyContent('');
                setReplyingTo(null);
            } else {
                setNewComments('');
            }
        } catch (error) {
            toaster.create({
                title: error.message,
                type: 'error',
            });
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
            toaster.create({
                title: error.message,
                type: 'error',
            });
        }
    };

    const handleDeleteComment = async () => {
        try {
            await deleteComment(commentToDelete);

            const updatedComments =
                await getCommentsByPostId(postId, sort);

            setComments(updatedComments);
            setCommentToDelete(null);

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
    };

    return {
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
    };
}