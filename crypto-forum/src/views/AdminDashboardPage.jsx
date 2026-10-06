import { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Heading,
    SimpleGrid,
    Stack,
    Text,
} from '@chakra-ui/react';
import { getForumStats } from '../services/homepage.js';
import { toaster } from '../components/ui/toast-store.js';
import AdminUserManagement
    from '../components/ui/admin/AdminUserManagement.jsx';


function AdminDashboardPage() {


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

                <AdminUserManagement />

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