import { BrowserRouter, Routes, Route } from 'react-router-dom';
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