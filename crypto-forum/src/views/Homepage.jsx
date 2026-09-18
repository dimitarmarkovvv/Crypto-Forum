import { logoutUser } from '../services/auth';
import { useNavigate } from 'react-router-dom';

function TempHomePage() {
    const navigation = useNavigate()
    const handleLogout = async () => {
        try {
            await logoutUser();
            navigation('/login')
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div>
            <h1>Crypto Forum</h1>
            <p>You are logged in.</p>

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default TempHomePage;