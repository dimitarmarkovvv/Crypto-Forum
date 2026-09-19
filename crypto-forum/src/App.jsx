import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './views/LoginPage';
import TempHomePage from './views/homepage';
import { RegisterPage } from './views/RegisterPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TempHomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;