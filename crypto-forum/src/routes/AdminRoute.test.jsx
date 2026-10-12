import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { AdminRoute } from './AdminRoute';
import { useAuth } from '../hooks/useAuth';

vi.mock('../hooks/useAuth');

const renderAdminRoute = () => {
    render(
        <ChakraProvider value={defaultSystem}>
            <MemoryRouter initialEntries={['/admin']}>
                <Routes>
                    <Route path="/" element={<p>Home Page</p>} />
                    <Route path="/login" element={<p>Login Page</p>} />

                    <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<p>Admin Dashboard</p>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        </ChakraProvider>
    );
};

describe('AdminRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('decides nothing while auth is still resolving', () => {
        useAuth.mockReturnValue({ user: null, profile: null, loading: true });

        renderAdminRoute();

        expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
        expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
        expect(screen.queryByText('Home Page')).not.toBeInTheDocument();
    });

    it('sends a logged out visitor to the login page', () => {
        useAuth.mockReturnValue({ user: null, profile: null, loading: false });

        renderAdminRoute();

        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('sends a logged in non-admin to the homepage', () => {
        useAuth.mockReturnValue({
            user: { id: 'user-1' },
            profile: { role: 'user' },
            loading: false,
        });

        renderAdminRoute();

        expect(screen.getByText('Home Page')).toBeInTheDocument();
        expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
    });

    it('lets an admin through', () => {
        useAuth.mockReturnValue({
            user: { id: 'admin-1' },
            profile: { role: 'admin' },
            loading: false,
        });

        renderAdminRoute();

        expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });
});