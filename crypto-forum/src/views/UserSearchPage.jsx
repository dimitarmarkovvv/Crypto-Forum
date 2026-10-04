import { useEffect, useState } from 'react';
import { Box, Container, Heading, HStack, Input, Spinner, Stack, Text } from '@chakra-ui/react';
import { toaster } from '../components/ui/toast-store.js';
import { searchUsers, getAvatarUrl } from '../services/profiles.js';
import { useNavigate } from 'react-router-dom';

function UserSearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

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
                placeholder="Search by username or name..."
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
                        <HStack
                            key={foundUser.id}
                            borderWidth="1px"
                            borderRadius="md" p={3}
                            cursor="pointer"
                            _hover={{
                                bg: 'bg.muted'
                            }}
                            onClick={() => navigate(`/users/${foundUser.id}`)}
                        >
                            {foundUser.avatar_url && (
                                <img src={getAvatarUrl(foundUser.avatar_url)} alt="avatar" width={40} height={40} style={{ borderRadius: '50%' }} />
                            )}
                            <Box>
                                <Text
                                    fontWeight="bold"
                                >
                                    {foundUser.username}
                                </Text>
                                <Text fontSize="sm" color="fg.muted">
                                    {foundUser.first_name} {foundUser.last_name}
                                </Text>
                            </Box>
                        </HStack>
                    ))}
                </Stack>
            )}
        </Container>
    );
};

export default UserSearchPage;
