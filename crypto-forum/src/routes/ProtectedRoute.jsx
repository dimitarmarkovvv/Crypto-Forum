import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Center, Spinner } from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <Center py={20}>
                <Spinner size="lg" />
            </Center>
        );
    };

    if (!user) {
        return (
            <Navigate to="/login" state={{ from: location }} replace />
        );
    } else {
        return <Outlet />;
    };
};