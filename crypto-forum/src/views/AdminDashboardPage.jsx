import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Avatar,
    Badge,
    Box,
    Button,
    Container,
    Heading,
    Input,
    SimpleGrid,
    Spinner,
    Stack,
    Table,
    Text,
} from '@chakra-ui/react';
import {
    adminSearchUsers,
    getAvatarUrl,
    setUserBlocked,
} from '../services/profiles.js';
import { getForumStats } from '../services/homepage.js';
import { toaster } from '../components/ui/toast-store.js';
import BlockUserDialog from '../components/ui/admin/BlockUserDialog.jsx';


function AdminDashboardPage() {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [loadingUsers, setloadingUsers] = useState(true);
    const [userToBlock, setUserToBlock] = useState(null);

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPosts: 0,
        totalComments: 0,
    });

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await getForumStats();
                setStats(data);
            } catch (error) {
                toaster.create({
                    title: error.message,
                    type: 'error',
                });
            }
        }

        loadStats();
    }, []);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setloadingUsers(true);

                const data = await adminSearchUsers(searchTerm);

                setUsers(data);
            } catch (error) {
                toaster.create({
                    title: error.message,
                    type: 'error',
                })
            } finally {
                setloadingUsers(false);
            }
        }

        loadUsers()
    }, [searchTerm])

    const handleBlockToggle = async (userId, blocked) => {
        try {
            await setUserBlocked(userId, blocked);

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId
                        ? { ...user, is_blocked: blocked }
                        : user
                )
            );

            toaster.create({
                title: blocked
                    ? 'User blocked'
                    : 'User unblocked',
                type: 'success',
            });
        } catch (error) {
            toaster.create({
                title: error.message,
                type: 'error',
            });
        }
    };

    const handleConfirmBlock = async () => {
        if (!userToBlock) {
            return;
        }

        await handleBlockToggle(
            userToBlock.id,
            true
        );

        setUserToBlock(null);
    };

    return (
        <Container maxW="7xl" py={10}>
            <Stack gap={10}>
                <Box>
                    <Heading size="2xl">
                        Admin Dashboard
                    </Heading>

                    <Text mt={2} color="fg.muted">
                        Manage users, posts and forum administration.
                    </Text>
                </Box>

                <SimpleGrid
                    columns={{
                        base: 1,
                        md: 3,
                    }}
                    gap={4}
                >
                    <Box
                        borderWidth="1px"
                        borderRadius="lg"
                        p={5}
                    >
                        <Text
                            fontSize="sm"
                            color="fg.muted"
                        >
                            Total Users
                        </Text>

                        <Heading mt={1}>
                            {stats.totalUsers}
                        </Heading>
                    </Box>

                    <Box
                        borderWidth="1px"
                        borderRadius="lg"
                        p={5}
                    >
                        <Text
                            fontSize="sm"
                            color="fg.muted"
                        >
                            Total Posts
                        </Text>

                        <Heading mt={1}>
                            {stats.totalPosts}
                        </Heading>
                    </Box>

                    <Box
                        borderWidth="1px"
                        borderRadius="lg"
                        p={5}
                    >
                        <Text
                            fontSize="sm"
                            color="fg.muted"
                        >
                            Total Comments
                        </Text>

                        <Heading mt={1}>
                            {stats.totalComments}
                        </Heading>
                    </Box>
                </SimpleGrid>

                <Box>
                    <Heading size="lg" mb={1}>
                        User Management
                    </Heading>

                    <Text
                        color="fg.muted"
                        mb={5}
                    >
                        Search and review registered users.
                    </Text>

                    <Input
                        placeholder="Search by username, email or name..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                        maxW="lg"
                        mb={5}
                    />

                    {loadingUsers ? (
                        <Spinner />
                    ) : users.length === 0 ? (
                        <Text color="fg.muted">
                            No users found.
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
                                            User
                                        </Table.ColumnHeader>

                                        <Table.ColumnHeader>
                                            Email
                                        </Table.ColumnHeader>

                                        <Table.ColumnHeader>
                                            Role
                                        </Table.ColumnHeader>

                                        <Table.ColumnHeader>
                                            Status
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader>
                                            Actions
                                        </Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {users.map((foundUser) => (
                                        <Table.Row key={foundUser.id}>
                                            <Table.Cell>
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    gap={3}
                                                >
                                                    <Avatar.Root
                                                        w="42px"
                                                        h="42px"
                                                        cursor="pointer"
                                                        onClick={() =>
                                                            navigate(
                                                                `/users/${foundUser.id}`
                                                            )
                                                        }
                                                    >
                                                        <Avatar.Fallback
                                                            name={`${foundUser.first_name} ${foundUser.last_name}`}
                                                        />

                                                        {foundUser.avatar_url && (
                                                            <Avatar.Image
                                                                src={getAvatarUrl(
                                                                    foundUser.avatar_url
                                                                )}
                                                            />
                                                        )}
                                                    </Avatar.Root>

                                                    <Box>
                                                        <Text
                                                            fontWeight="bold"
                                                            cursor="pointer"
                                                            _hover={{
                                                                textDecoration:
                                                                    'underline',
                                                            }}
                                                            onClick={() =>
                                                                navigate(
                                                                    `/users/${foundUser.id}`
                                                                )
                                                            }
                                                        >
                                                            {foundUser.username}
                                                        </Text>

                                                        <Text
                                                            fontSize="sm"
                                                            color="fg.muted"
                                                        >
                                                            {foundUser.first_name}{' '}
                                                            {foundUser.last_name}
                                                        </Text>
                                                    </Box>
                                                </Box>
                                            </Table.Cell>

                                            <Table.Cell>
                                                {foundUser.email}
                                            </Table.Cell>

                                            <Table.Cell>
                                                <Badge
                                                    variant="subtle"
                                                >
                                                    {foundUser.role}
                                                </Badge>
                                            </Table.Cell>

                                            <Table.Cell>
                                                <Badge
                                                    colorPalette={
                                                        foundUser.is_blocked
                                                            ? 'red'
                                                            : 'green'
                                                    }
                                                >
                                                    {foundUser.is_blocked
                                                        ? 'Blocked'
                                                        : 'Active'}
                                                </Badge>
                                            </Table.Cell>

                                            <Table.Cell>
                                                {foundUser.role === 'admin' ? (
                                                    <Badge
                                                        variant="subtle"
                                                        colorPalette="gray"
                                                    >
                                                        Protected
                                                    </Badge>
                                                ) : foundUser.is_blocked ? (
                                                    <Button
                                                        size="sm"
                                                        colorPalette="green"
                                                        onClick={() =>
                                                            handleBlockToggle(
                                                                foundUser.id,
                                                                false
                                                            )
                                                        }
                                                    >
                                                        Unblock
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        colorPalette="red"
                                                        onClick={() =>
                                                            setUserToBlock(foundUser)
                                                        }
                                                    >
                                                        Block
                                                    </Button>
                                                )}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Box>
                    )}
                </Box>

                <BlockUserDialog
                    userToBlock={userToBlock}
                    setUserToBlock={setUserToBlock}
                    handleConfirmBlock={handleConfirmBlock}
                />

                <Box>
                    <Heading size="lg" mb={1}>
                        Post Management
                    </Heading>

                    <Text color="fg.muted">
                        Post moderation tools will be added here next.
                    </Text>
                </Box>
            </Stack>
        </Container>
    );
}

export default AdminDashboardPage;