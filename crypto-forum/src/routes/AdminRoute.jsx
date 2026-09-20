import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AdminRoute = () => {
    const {user , profile, loading} = useAuth();

    if(loading){
        return (
            <p>
                Loading...
            </p>
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