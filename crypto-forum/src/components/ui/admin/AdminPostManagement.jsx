import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Input,
    Spinner,
    Table,
    Text,
} from '@chakra-ui/react';

import { getPosts } from '../../../services/posts.js';
import { toaster } from '../toast-store.js';

function AdminPostManagement() {
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [postPage, setPostPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);

    const POSTS_PER_PAGE = 10;

    const totalPages = Math.ceil(
        totalPosts / POSTS_PER_PAGE
    );

    const firstPostNumber =
        (postPage - 1) * POSTS_PER_PAGE + 1;

    const lastPostNumber =
        Math.min(
            postPage * POSTS_PER_PAGE,
            totalPosts
        );

    useEffect(() => {
        const loadPosts = async () => {
            try {
                setLoadingPosts(true);

                const data = await getPosts({
                    page: postPage,
                    pageSize: POSTS_PER_PAGE,
                    search: searchTerm,
                });

                setPosts(data.posts)
                setTotalPosts(data.totalCount)
            } catch (error) {
                toaster.create({
                    title: error.message,
                    type: 'error',
                });
            } finally {
                setLoadingPosts(false)
            }
        }

        loadPosts()
    }, [postPage, searchTerm])
    return (
        <Box>
            <Input
                placeholder="Search posts by title..."
                value={searchTerm}
                onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setPostPage(1);
                }}
                maxW="lg"
                mb={5}
            />

            {loadingPosts ? (
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
                                    Post
                                </Table.ColumnHeader>

                                <Table.ColumnHeader>
                                    Author
                                </Table.ColumnHeader>

                                <Table.ColumnHeader>
                                    Comments
                                </Table.ColumnHeader>

                                <Table.ColumnHeader>
                                    Actions
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {posts.map((post) => (
                                <Table.Row key={post.id}>
                                    <Table.Cell>
                                        <Text
                                            fontWeight="medium"
                                            cursor="pointer"
                                            _hover={{
                                                textDecoration: 'underline',
                                            }}
                                            onClick={() =>
                                                navigate(`/posts/${post.id}`)
                                            }
                                        >
                                            {post.title}
                                        </Text>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Text
                                            cursor="pointer"
                                            _hover={{
                                                textDecoration: 'underline'
                                            }}
                                            onClick={() => {
                                                navigate(`/users/${post.author_id}`)
                                            }}>
                                            {post.profiles.username}
                                        </Text>
                                    </Table.Cell>

                                    <Table.Cell>
                                        {post.commentCount}
                                    </Table.Cell>

                                    <Table.Cell>
                                        Delete later
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>
            )}

            {posts.length > 0 && (
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={4}
                >
                    <Text fontSize="sm" color="fg.muted">
                        Page {postPage} of {totalPages}
                    </Text>

                    <Text fontSize="sm" color="fg.muted">
                        Showing {firstPostNumber}-{lastPostNumber} of {totalPosts} posts
                    </Text>

                    <Box display="flex" gap={2}>
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={postPage === 1}
                            onClick={() =>
                                setPostPage((page) => page - 1)
                            }
                        >
                            Previous
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            disabled={postPage >= totalPages}
                            onClick={() =>
                                setPostPage((page) => page + 1)
                            }
                        >
                            Next
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default AdminPostManagement;