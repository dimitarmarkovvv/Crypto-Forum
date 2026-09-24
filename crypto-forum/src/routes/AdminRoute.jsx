import { Navigate, Outlet } from 'react-router-dom';
import { Center, Spinner } from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';

export const AdminRoute = () => {
    const {user , profile, loading} = useAuth();

    if(loading){
        return (
            <Center py={20}>
                <Spinner size="lg" />
            </Center>
        );
    };

    if(!user){
        return(
            <Navigate to="/login" replace />
        );
    };

    if(profile?.role !== 'admin'){
        return(
            <Navigate to="/" replace />
        );
    } else {
        return(
            <Outlet />
        );
    };
};