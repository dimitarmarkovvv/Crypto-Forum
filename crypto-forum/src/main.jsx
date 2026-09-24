import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import App from './App.jsx';
import { AuthProvider } from './context/AuthProvider.jsx';
import { Toaster } from './components/ui/Toaster.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <AuthProvider>
        <App />
        <Toaster />
      </AuthProvider>
    </ChakraProvider>
  </StrictMode>
);