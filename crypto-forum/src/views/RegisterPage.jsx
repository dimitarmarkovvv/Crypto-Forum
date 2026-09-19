import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/auth';

export function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState('');
    const [error, setError] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError(' ');
        setIsLoading(true);

        try {
            await registerUser(email, password, { username, first_name: firstName, last_name: lastName });

            navigate('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        };
    };

    return (
        <div>
            <h1>Register</h1>

            <form onSubmit= {handleSubmit}>

                <div>
                    <label htmlFor="username">Username</label>
                    <input 
                    id='username'
                    type='text'
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                    />
                </div>

                <div>
                    <label htmlFor="firstName">First Name</label>
                    <input 
                    id='firstName'
                    type='text'
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    required
                    />
                </div>

                <div>
                    <label htmlFor="lastName">Last Name</label>
                    <input 
                    id='lastName'
                    type='text'
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    required
                    />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input 
                    id='email'
                    type='email'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>

                    <input
                    id='password'
                    type='password'
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    />
                </div>

                {error && <p>{error}</p>}
                <button type='submit' disabled={isLoading}>{isLoading ? 'Registering....' : 'Register'}</button>
            </form>
        </div>
    );
};