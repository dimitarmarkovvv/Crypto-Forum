import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './views/loginPage';
import TempHomePage from './views/homepage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TempHomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;