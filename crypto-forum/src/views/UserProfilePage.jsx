import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Center, Container, Heading, Image, Spinner, Stack, Text,
} from '@chakra-ui/react';
import { getAvatarUrl, getUserProfileById } from '../services/profiles';

function UserProfilePage() {
    const { id } = useParams();

    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                setError('');

                const profile = await getUserProfileById(id);

                setUserProfile(profile)
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false)
            }
        };

        loadProfile()
    }, [id])

    if (loading) {
        return (
            <Center py={10}>
                <Spinner size="lg" />
            </Center>
        );
    }

    if (error) {
        return (
            <Container maxW="2x1" py={10}>
                <Text color="red.500">
                    Failed to load profile: {error}
                </Text>
            </Container>
        )
    }

    return (
        <Container maxW="2x1" py={10}>
            <Stack gap={4}>
                {userProfile.avatar_url && (
                    <Image src={getAvatarUrl(userProfile.avatar_url)}
                        alt={`${userProfile.username}'s avatar`}
                        boxSize="120px"
                        objectFit="cover"
                        borderRadius="full"
                    />
                )}

                <Heading>
                    {userProfile.username}
                </Heading>

                <Text>
                    {userProfile.first_name} {userProfile.last_name}
                </Text>

                {userProfile.location && (
                    <Text color="fg.muted">
                        Location: {userProfile.location}
                    </Text>
                )}

                {userProfile.gender && (
                    <Text color="fg.muted">
                        Gender: {userProfile.gender}
                    </Text>
                )}


                {userProfile.signature && (
                    <Text fontStyle="italic">
                        {userProfile.signature}
                    </Text>
                )}
            </Stack>
        </Container>
    )
}

export default UserProfilePage;
