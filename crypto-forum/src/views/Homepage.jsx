import { useAuth } from '../hooks/useAuth';
import { logoutUser } from '../services/auth';
import { useNavigate } from 'react-router-dom';

function TempHomePage() {
    const { user, loading } = useAuth()
    const navigation = useNavigate()
    const handleLogout = async () => {
        try {
            await logoutUser();
            navigation('/login')
        } catch (error) {
            console.error(error.message);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Crypto Forum</h1>

            {user ? (
                <>
                    <p>Logged in as:  {user.email}</p>

                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </>
            ) : (
                <p>You are logged out</p>
            )}
        </div>
    );
}

export default TempHomePage;