import { useEffect, useState } from 'react';
import { Box, Button, Container, Heading, HStack, Input, Spinner, Stack, Text } from '@chakra-ui/react';
import { toaster } from '../components/ui/toast-store.js';
import { searchUsers, getAvatarUrl, promoteUser } from '../services/profiles.js';
import { useAuth } from '../hooks/useAuth.js';

function UserSearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const { profile } = useAuth();

    useEffect(() => {
        if (!searchTerm.trim()) {
            return;
        }

        const search = async () => {
            setLoading(true);
            try {
                const data = await searchUsers(searchTerm);
                setResults(data);
            } catch (error) {
                toaster.create({ title: error.message, type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        search();
    }, [searchTerm]);

    const handlePromote = async (targetUserId, newRole) => {
        try {
            await promoteUser(targetUserId, newRole);
            toaster.create({ title: 'Role updated', type: 'success' });
        } catch (error) {
            toaster.create({ title: error.message, type: 'error' });
        }
    };

    return (
        <Container maxW="2xl" py={10}>
            <Heading mb={6}>Search Users</Heading>

            <Input
                placeholder="Search by username, email or name..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                mb={6}
            />

            {!searchTerm.trim() ? (
                <Text>Type something to search.</Text>
            ) : loading ? (
                <Spinner />
            ) : (
                <Stack gap={4}>
                    {results.map((foundUser) => (
                        <HStack key={foundUser.id} borderWidth="1px" borderRadius="md" p={3}>
                            {foundUser.avatar_url && (
                                <img src={getAvatarUrl(foundUser.avatar_url)} alt="avatar" width={40} height={40} style={{ borderRadius: '50%' }} />
                            )}
                            <Box>
                                <Text fontWeight="bold">{foundUser.username}</Text>
                                <Text fontSize="sm" color="fg.muted">
                                    {foundUser.first_name} {foundUser.last_name} — {foundUser.email}
                                </Text>
                            </Box>
                            {profile?.role === 'admin' && (
                                <HStack ml="auto">
                                    <Button size="xs" onClick={() => handlePromote(foundUser.id, 'user')}>User</Button>
                                    <Button size="xs" onClick={() => handlePromote(foundUser.id, 'moderator')}>Moderator</Button>
                                    <Button size="xs" onClick={() => handlePromote(foundUser.id, 'admin')}>Admin</Button>
                                </HStack>
                            )}
                        </HStack>
                    ))}
                </Stack>
            )}
        </Container>
    );
};

export default UserSearchPage;
