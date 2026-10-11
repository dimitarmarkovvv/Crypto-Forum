import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Button,
    Card,
    Container,
    Field,
    Heading,
    Input,
    Link,
    Stack,
    Text,
} from '@chakra-ui/react';
import { sendPasswordReset } from '../services/auth';
import { toaster } from '../components/ui/toast-store.js';
import { Header } from '../components/ui/Header.jsx';

export function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sentTo, setSentTo] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setIsLoading(true);

        try {
            const address = email.trim();

            await sendPasswordReset(address);

            setSentTo(address);
        } catch (error) {
            toaster.create({ title: error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxW="6xl" py={10}>
            <Header />

            <Card.Root maxW="sm" mx="auto" mt={10}>
                <Card.Body>
                    {sentTo ? (
                        <Stack gap={4}>
                            <Heading size="lg">Check your inbox</Heading>

                            <Text color="fg.muted">
                                If an account exists for <strong>{sentTo}</strong>, we have
                                sent it a link to reset the password. The link expires
                                after a short while.
                            </Text>

                            <Link asChild>
                                <RouterLink to="/login">Back to login</RouterLink>
                            </Link>
                        </Stack>
                    ) : (
                        <>
                            <Heading size="lg" mb={2}>Forgot password</Heading>

                            <Text color="fg.muted" mb={6}>
                                Enter the email you signed up with and we will send you a
                                link to set a new password.
                            </Text>

                            <form onSubmit={handleSubmit}>
                                <Stack gap={4}>
                                    <Field.Root required>
                                        <Field.Label>Email</Field.Label>

                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(event) => setEmail(event.target.value)}
                                            required
                                        />
                                    </Field.Root>

                                    <Button
                                        type="submit"
                                        loading={isLoading}
                                        loadingText="Sending..."
                                    >
                                        Send reset link
                                    </Button>

                                    <Link asChild fontSize="sm" alignSelf="center">
                                        <RouterLink to="/login">Back to login</RouterLink>
                                    </Link>
                                </Stack>
                            </form>
                        </>
                    )}
                </Card.Body>
            </Card.Root>
        </Container>
    );
}

export default ForgotPasswordPage;
