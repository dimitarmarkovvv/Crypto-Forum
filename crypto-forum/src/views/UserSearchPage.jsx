import { useEffect, useState } from 'react';
import { Box, Container, Heading, HStack, Input, Spinner, Stack, Text } from '@chakra-ui/react';
import { toaster } from '../components/ui/toast-store.js';
import { searchUsers, getAvatarUrl } from '../services/profiles.js';

function UserSearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

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
                    {results.map((profile) => (
                        <HStack key={profile.id} borderWidth="1px" borderRadius="md" p={3}>
                            {profile.avatar_url && (
                                <img src={getAvatarUrl(profile.avatar_url)} alt="avatar" width={40} height={40} style={{ borderRadius: '50%' }} />
                            )}
                            <Box>
                                <Text fontWeight="bold">{profile.username}</Text>
                                <Text fontSize="sm" color="fg.muted">
                                    {profile.first_name} {profile.last_name} — {profile.email}
                                </Text>
                            </Box>
                        </HStack>
                    ))}
                </Stack>
            )}
        </Container>
    );
}

export default UserSearchPage;
