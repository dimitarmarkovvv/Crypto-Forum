import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

vi.mock('../hooks/useAuth');

const renderProtectedRoute = () => {
    render(
        <ChakraProvider value={defaultSystem}>
        <MemoryRouter initialEntries={['/posts']}>
            <Routes>
                <Route path="/login" element={<p>Login Page</p>} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/posts" element={<p>Posts Page</p>} />
                </Route>
            </Routes>
        </MemoryRouter>
        </ChakraProvider>
    );
};

describe('ProtectedRoute', () => {
    it('shows loading state while auth is resolving', () => {
        useAuth.mockReturnValue({ user: null, loading: true });
        renderProtectedRoute();
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('redirects to /login when there is no user', () => {
        useAuth.mockReturnValue({ user: null, loading: false });
        renderProtectedRoute();
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('renders the protected content when a user is present', () => {
        useAuth.mockReturnValue({ user: { id: '123' }, loading: false });
        renderProtectedRoute();
        expect(screen.getByText('Posts Page')).toBeInTheDocument();
    });
});