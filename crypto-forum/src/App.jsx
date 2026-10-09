import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { LoginPage } from './views/LoginPage';
import HomePage from './views/Homepage.jsx';
import { RegisterPage } from './views/RegisterPage';
import { ProtectedRoute } from './routes/ProtectedRoute.jsx'
import PostsPage from './views/PostsPage.jsx';
import CreatePostPage from './views/CreatePostPage.jsx';
import EditPostPage from './views/EditPostPage.jsx';
import PostDetailsPage from './views/PostDetailsPage.jsx';
import EditProfilePage from './views/EditProfilePage.jsx';
import UserSearchPage from './views/UserSearchPage.jsx';
import UserProfilePage from './views/UserProfilePage.jsx';
import { AdminRoute } from './routes/AdminRoute.jsx';
import AdminDashboardPage from './views/AdminDashboardPage.jsx';
import { useAuth } from './hooks/useAuth.js';
import BlockedAccountDialog from './components/ui/BlockedAccountDialog.jsx';
import { useState } from 'react';
import BlockedAccountBanner from './components/ui/BlockedUserBanner.jsx';
import { ColorModeButton } from './components/ui/color-mode.jsx';
import { Box, Stack, Avatar } from '@chakra-ui/react';
import { getAvatarUrl } from './services/profiles.js';

function App() {
  const { user, profile } = useAuth();

  const [, setBlockedNoticeVersion] = useState(0);

  const blockedNoticeKey = user
    ? `blocked-notice-${user.id}`
    : null;

  const blockedNoticeAcknowledged =
    blockedNoticeKey &&
    sessionStorage.getItem(blockedNoticeKey) === 'true';

  const blockedDialogOpen =
    Boolean(user && profile?.is_blocked) &&
    !blockedNoticeAcknowledged;

  const handleBlockedNoticeAcknowledge = () => {
    if (!blockedNoticeKey) return;

    sessionStorage.setItem(
      blockedNoticeKey,
      'true'
    );

    setBlockedNoticeVersion((version) => version + 1);
  };
  return (
    <BrowserRouter>
      {user && profile?.is_blocked && (
        <BlockedAccountBanner />
      )}

      <Box position="fixed" top="4" right="4" zIndex="sticky">
        <Stack direction="row" align="center" gap="3">
          <ColorModeButton />

          {user && profile && (
            <Link to={`/users/${user.id}`}>
              <Avatar.Root w="40px" h="40px" borderRadius="full" overflow="hidden">
                <Avatar.Fallback
                  name={`${profile.first_name} ${profile.last_name}`}
                />
                {profile.avatar_url && (
                  <Avatar.Image
                    src={getAvatarUrl(profile.avatar_url)}
                    alt={`${profile.username}'s avatar`}
                  />
                )}
              </Avatar.Root>
            </Link>
          )}
        </Stack>
      </Box>

      <BlockedAccountDialog
        open={blockedDialogOpen}
        onAcknowledge={handleBlockedNoticeAcknowledge}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path='/posts' element={<PostsPage />} />
          <Route path='/posts/create' element={<CreatePostPage />} />
          <Route path='/posts/:id/edit' element={<EditPostPage />} />
          <Route path='/posts/:id' element={<PostDetailsPage />} />

          <Route path='/profile/edit' element={<EditProfilePage />} />

          <Route path='/users/search' element={<UserSearchPage />} />
          <Route path='/users/:id' element={<UserProfilePage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;