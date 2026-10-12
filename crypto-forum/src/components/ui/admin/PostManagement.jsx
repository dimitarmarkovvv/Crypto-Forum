import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Avatar,
    Box,
    Button,
    HStack,
    Heading,
    Input,
    Link,
    NativeSelect,
    Spinner,
    Table,
    Text,
} from '@chakra-ui/react';
import { LuPencil, LuTrash2 } from 'react-icons/lu';
import { deletePost, getAdminPosts } from '../../../services/posts.js';
import { getAvatarUrl } from '../../../services/profiles.js';
import { formatDate } from '../../../utils/formatDate.js';
import { toaster } from '../toast-store.js';
import DeletePostDialog from '../DeletePostDialog.jsx';

const pageSize = 10;

function PostManagement({ onPostDeleted }) {
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [author, setAuthor] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [debouncedAuthor, setDebouncedAuthor] = useState('');
    const [sort, setSort] = useState('newest');
    const [reloadKey, setReloadKey] = useState(0);
    const [postToDelete, setPostToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setDebouncedAuthor(author);
        }, 300);

        return () => {
            clearTimeout(timer);
        };
    }, [search, author]);

    useEffect(() => {
        let ignore = false;

        const loadPosts = async () => {
            setLoading(true);

            try {
                const data = await getAdminPosts({
                    page,
                    pageSize,
                    search: debouncedSearch,
                    author: debouncedAuthor,
                    sort,
                });

                if (!ignore) {
                    setPosts(data.posts);
                    setTotal(data.total);
                }
            } catch (error) {
                if (!ignore) {
                    toaster.create({
                        title: error.message,
                        type: 'error',
                    });
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadPosts();

        return () => {
            ignore = true;
        };
    }, [page, debouncedSearch, debouncedAuthor, sort, reloadKey]);

    const handleDelete = async () => {
        if (!postToDelete) {
            return;
        }

        setDeleting(true);

        try {
            await deletePost(postToDelete.id);

            toaster.create({
                title: 'Post deleted',
                type: 'success',
            });

            if (posts.length === 1 && page > 1) {
                setPage((prevPage) => prevPage - 1);
            } else {
                setReloadKey((key) => key + 1);
            }

            onPostDeleted?.();
        } catch (error) {
            toaster.create({
                title: error.message,
                type: 'error',
            });
        } finally {
            setDeleting(false);
            setPostToDelete(null);
        }
    };

    return (
        <Box>
            <Heading size="lg" mb={1}>
                Post Management
            </Heading>

            <Text color="fg.muted" mb={5}>
                Browse, filter and moderate all forum posts.
            </Text>

            <HStack mb={5} gap={4} wrap="wrap">
                <Input
                    placeholder="Search by title..."
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value);
                        setPage(1);
                    }}
                    maxW="xs"
                />

                <Input
                    placeholder="Filter by author..."
                    value={author}
                    onChange={(event) => {
                        setAuthor(event.target.value);
                        setPage(1);
                    }}
                    maxW="xs"
                />

                <NativeSelect.Root maxW="220px">
                    <NativeSelect.Field
                        value={sort}
                        onChange={(event) => {
                            setSort(event.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="updated">Recently updated</option>
                        <option value="title_asc">Title A-Z</option>
                        <option value="title_desc">Title Z-A</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                </NativeSelect.Root>
            </HStack>

            {loading ? (
                <Spinner />
            ) : posts.length === 0 ? (
                <Text color="fg.muted">
                    No posts found.
                </Text>
            ) : (
                <Box
                    borderWidth="1px"
                    borderRadius="lg"
                    overflowX="auto"
                >
                    <Table.Root>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>
                                    Title
                                </Table.ColumnHeader>

                                <Table.ColumnHeader>
                                    Author
                                </Table.ColumnHeader>

                                <Table.ColumnHeader>
                                    Comments
                                </Table.ColumnHeader>

                                <Table.ColumnHeader>
                                    Created
                                </Table.ColumnHeader>

                                <Table.ColumnHeader>
                                    Actions
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {posts.map((post) => (
                                <Table.Row key={post.id}>
                                    <Table.Cell maxW="sm">
                                        <Link asChild fontWeight="bold">
                                            <RouterLink to={`/posts/${post.id}`}>
                                                {post.title}
                                            </RouterLink>
                                        </Link>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <HStack gap={2}>
                                            <Avatar.Root size="xs">
                                                <Avatar.Fallback
                                                    name={post.profiles?.username}
                                                />

                                                {post.profiles?.avatar_url && (
                                                    <Avatar.Image
                                                        src={getAvatarUrl(
                                                            post.profiles.avatar_url
                                                        )}
                                                        alt={`${post.profiles.username}'s avatar`}
                                                    />
                                                )}
                                            </Avatar.Root>

                                            <Link asChild>
                                                <RouterLink to={`/users/${post.author_id}`}>
                                                    {post.profiles?.username}
                                                </RouterLink>
                                            </Link>
                                        </HStack>
                                    </Table.Cell>

                                    <Table.Cell>
                                        {post.commentCount}
                                    </Table.Cell>

                                    <Table.Cell>
                                        {formatDate(post.created_at)}
                                    </Table.Cell>

                                    <Table.Cell>
                                        <HStack gap={1}>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() =>
                                                    navigate(`/posts/${post.id}/edit`)
                                                }
                                            >
                                                <LuPencil /> Edit
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                colorPalette="red"
                                                onClick={() => setPostToDelete(post)}
                                            >
                                                <LuTrash2 /> Delete
                                            </Button>
                                        </HStack>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>
            )}

            <HStack mt={5} justify="space-between" wrap="wrap">
                <Text color="fg.muted" fontSize="sm">
                    {total} {total === 1 ? 'post' : 'posts'}
                </Text>

                <HStack>
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={loading || page <= 1}
                        onClick={() => setPage((prevPage) => prevPage - 1)}
                    >
                        Previous
                    </Button>

                    <Text fontSize="sm">
                        Page {page} of {totalPages}
                    </Text>

                    <Button
                        size="sm"
                        variant="outline"
                        disabled={loading || page >= totalPages}
                        onClick={() => setPage((prevPage) => prevPage + 1)}
                    >
                        Next
                    </Button>
                </HStack>
            </HStack>

            <DeletePostDialog
                open={postToDelete !== null}
                setOpen={() => setPostToDelete(null)}
                handleDeletePost={handleDelete}
                loading={deleting}
            />
        </Box>
    );
}

export default PostManagement;
