import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Card, Container, Field, Heading, Input, Stack } from '@chakra-ui/react';
import { loginUser } from '../services/auth';
import { toaster } from '../components/ui/toast-store.js';
import { Header } from '../components/ui/Header.jsx';

export function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (event) => {
        event.preventDefault()

        setIsLoading(true)

        try {
            await loginUser(email, password)

            navigate(from, { replace: true })
        } catch (error) {
            toaster.create({ title: error.message, type: 'error' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Container maxW="6xl" py={10}>
            <Header />

            <Card.Root maxW="sm" mx="auto" mt={10}>
                <Card.Body>
                    <Heading size="lg" mb={6}>Login</Heading>

                <form onSubmit={handleSubmit}>
                    <Stack gap={4}>
                        <Field.Root required>
                            <Field.Label>Email</Field.Label>
                            <Input
                                type='email'
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </Field.Root>

                        <Field.Root required>
                            <Field.Label>Password</Field.Label>
                            <Input
                                type='password'
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                        </Field.Root>

                        <Button type='submit' loading={isLoading} loadingText='Logging in...'>
                            Login
                        </Button>
                    </Stack>
                </form>
                </Card.Body>
            </Card.Root>
        </Container>
    )
}
