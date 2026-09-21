import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './views/LoginPage';
import HomePage from './views/Homepage.jsx';
import { RegisterPage } from './views/RegisterPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;