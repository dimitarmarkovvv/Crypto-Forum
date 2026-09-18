import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/auth';

export function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState('')
    const [error, setError] = useState(false)

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault()

        setError(' ')
        setIsLoading(true)

        try {
            await loginUser(email, password)

            navigate('/')
        } catch (error) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit= {handleSubmit}>
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
                <button type='submit' disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
            </form>
        </div>
    )
}