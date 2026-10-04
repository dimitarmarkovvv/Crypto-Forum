import { useEffect, useState } from 'react';
import {
    castCommentVote,
    deleteCommentVote,
    getCommentVotes,
} from '../services/votes.js';
import { toaster } from '../components/ui/toast-store.js';

export function useCommentVotes({ comments, userId }) {
    const [commentVotes, setCommentVotes] = useState({});

    useEffect(() => {
        const loadCommentVotes = async () => {
            if (!userId || comments.length === 0) {
                setCommentVotes({});
                return;
            }

            try {
                const commentIds = comments.map(
                    (comment) => comment.id
                );

                const votes = await getCommentVotes(
                    commentIds,
                    userId
                );

                setCommentVotes(votes);
            } catch (error) {
                toaster.create({
                    title: error.message,
                    type: 'error',
                });
            }
        };

        loadCommentVotes();
    }, [comments, userId]);

    const handleCommentVote = async (commentId, value) => {
        try {
            const currentVote =
                commentVotes[commentId]?.userVote ?? 0;

            if (currentVote === value) {
                await deleteCommentVote(
                    commentId,
                    userId
                );
            } else {
                await castCommentVote(
                    commentId,
                    userId,
                    value
                );
            }

            const commentIds = comments.map(
                (comment) => comment.id
            );

            const votes = await getCommentVotes(
                commentIds,
                userId
            );

            setCommentVotes(votes);
        } catch (error) {
            toaster.create({
                title: error.message,
                type: 'error',
            });
        }
    };

    return {
        commentVotes,
        handleCommentVote,
    };
}