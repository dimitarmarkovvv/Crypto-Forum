import { Avatar, Box, Stack } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { ColorModeButton } from './color-mode.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { getAvatarUrl } from '../../services/profiles.js';

const HIDDEN_ON = ['/reset-password'];

export function FloatingControls() {
    const { user, profile } = useAuth() ?? {};
    const { pathname } = useLocation();

    if (HIDDEN_ON.includes(pathname)) {
        return null;
    }

    return (
        <Box position="fixed" top="4" right="4" zIndex="sticky">
            <Stack direction="row" align="center" gap="3">
                <ColorModeButton />

                {user && profile && (
                    <Link to={`/users/${user.id}`}>
                        <Avatar.Root w="40px" h="40px" borderRadius="full" overflow="hidden">
                            <Avatar.Fallback
                                name={`${profile.first_name} ${profile.last_name}`}
                            />

                            {profile.avatar_url && (
                                <Avatar.Image
                                    src={getAvatarUrl(profile.avatar_url)}
                                    alt={`${profile.username}'s avatar`}
                                />
                            )}
                        </Avatar.Root>
                    </Link>
                )}
            </Stack>
        </Box>
    );
}

export default FloatingControls;
