import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Field, Heading, Input, Stack } from '@chakra-ui/react';
import { registerUser } from '../services/auth';
import { toaster } from '../components/ui/toast-store.js';

export function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        setIsLoading(true);

        try {
            await registerUser(email, password, { username, first_name: firstName, last_name: lastName });

            navigate('/');
        } catch (error) {
            toaster.create({ title: error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        };
    };

    return (
        <Container maxW="sm" py={10}>
            <Heading mb={6}>Register</Heading>

            <form onSubmit={handleSubmit}>
                <Stack gap={4}>
                    <Field.Root required>
                        <Field.Label>Username</Field.Label>
                        <Input
                            id='username'
                            type='text'
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            required
                        />
                    </Field.Root>

                    <Field.Root required>
                        <Field.Label>First Name</Field.Label>
                        <Input
                            id='firstName'
                            type='text'
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                            required
                        />
                    </Field.Root>

                    <Field.Root required>
                        <Field.Label>Last Name</Field.Label>
                        <Input
                            id='lastName'
                            type='text'
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                            required
                        />
                    </Field.Root>

                    <Field.Root required>
                        <Field.Label>Email</Field.Label>
                        <Input
                            id='email'
                            type='email'
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </Field.Root>

                    <Field.Root required>
                        <Field.Label>Password</Field.Label>
                        <Input
                            id='password'
                            type='password'
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </Field.Root>

                    <Button type='submit' loading={isLoading} loadingText='Registering....'>
                        Register
                    </Button>
                </Stack>
            </form>
        </Container>
    );
};
