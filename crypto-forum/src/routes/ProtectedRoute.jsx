import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <p>
                Loading...
            </p>
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