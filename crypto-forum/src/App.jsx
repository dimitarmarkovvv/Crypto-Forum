import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './views/LoginPage';
import HomePage from './views/Homepage.jsx';
import { RegisterPage } from './views/RegisterPage';
import { ProtectedRoute } from './routes/ProtectedRoute.jsx'
import PostsPage from './views/PostsPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path='/posts' element={<PostsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;