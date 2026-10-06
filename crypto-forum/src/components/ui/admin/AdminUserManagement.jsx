import { useEffect, useState } from "react";
import { adminSearchUsers, getAvatarUrl, setUserBlocked } from "../../../services/profiles";
import { useNavigate } from 'react-router-dom';
import { toaster } from "../toast-store";
import {
    Avatar,
    Badge,
    Box,
    Button,
    Heading,
    Input,
    Spinner,
    Table,
    Text,
} from '@chakra-ui/react';
import BlockUserDialog from "./BlockUserDialog";

function AdminUserManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [userToBlock, setUserToBlock] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoadingUsers(true);

                const data = await adminSearchUsers(searchTerm);

                setUsers(data);
            } catch (error) {
                toaster.create({
                    title: error.message,
                    type: 'error',
                });
            } finally {
                setLoadingUsers(false);
            }
        };

        loadUsers();
    }, [searchTerm]);

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

            return true;
        } catch (error) {
            toaster.create({
                title: error.message,
                type: 'error',
            });

            return false;
        }
    };

    const handleConfirmBlock = async () => {
        if (!userToBlock) {
            return;
        }

        const success = await handleBlockToggle(
            userToBlock.id,
            true
        );

        if (success) {
            setUserToBlock(null);
        }

    };

    return (
        <>
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
        </>
    );
}

export default AdminUserManagement;