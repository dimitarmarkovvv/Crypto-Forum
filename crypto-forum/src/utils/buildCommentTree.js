export const buildCommentTree = (comments) => {
    const map = {};
    const roots = [];

    comments.forEach((comment) => {
        map[comment.id] = {
            ...comment,
            replies: [],
        };
    });

    comments.forEach((comment) => {
        if(comment.parent_comment_id) {
            map[comment.parent_comment_id]?.replies.push(map[comment.id]);
        } else {
            roots.push(map[comment.id]);
        }
    });

    return roots;
};