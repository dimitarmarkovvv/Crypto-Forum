import { Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
    LuNewspaper,
    LuChartLine,
    LuUsers,
    LuShield,
    LuLogOut,
    LuLogIn,
    LuUserPlus,
} from 'react-icons/lu';
import { useAuth } from '../../hooks/useAuth';
import { logoutUser } from '../../services/auth';

export function Header() {
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const handleLogoClick = (event) => {
        if (pathname === '/') {
            event.preventDefault();
            window.location.reload();
        }
    };

    const handleLogout = async (userId) => {
        try {
            await logoutUser(userId);
            navigate('/login');
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <Flex
            as="header"
            justify="space-between"
            align="center"
            gap="4"
            pb="4"
            mb="2"
            borderBottomWidth="1px"
        >
            <Heading asChild color="inherit">
                <RouterLink to="/" onClick={handleLogoClick}>LearnCrypto</RouterLink>
            </Heading>

            {user ? (
                <Stack direction="row" align="center" gap="1">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/posts')}>
                        <LuNewspaper /> Posts
                    </Button>

                    <Button variant="ghost" size="sm" onClick={() => navigate('/charts')}>
                        <LuChartLine /> Charts
                    </Button>

                    <Button variant="ghost" size="sm" onClick={() => navigate('/users/search')}>
                        <LuUsers /> Search Users
                    </Button>

                    {profile?.role === 'admin' && (
                        <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
                            <LuShield /> Admin Dashboard
                        </Button>
                    )}

                    <Button variant="ghost" size="sm" onClick={() => handleLogout(user.id)}>
                        <LuLogOut /> Logout
                    </Button>
                </Stack>
            ) : (
                <Stack direction="row" align="center" gap="2">
                    <Text color="fg.muted">You are logged out</Text>

                    <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                        <LuLogIn /> Login
                    </Button>

                    <Button size="sm" onClick={() => navigate('/register')}>
                        <LuUserPlus /> Register
                    </Button>
                </Stack>
            )}
        </Flex>
    );
}
