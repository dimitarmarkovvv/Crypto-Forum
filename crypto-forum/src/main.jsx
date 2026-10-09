import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { system } from './theme.js';
import App from './App.jsx';
import { AuthProvider } from './context/AuthProvider.jsx';
import { Toaster } from './components/ui/Toaster.jsx';
import { ColorModeProvider } from './components/ui/color-mode.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <ColorModeProvider>
      <AuthProvider>
        <App />
        <Toaster />
      </AuthProvider>
      </ColorModeProvider>
    </ChakraProvider>
  </StrictMode>
);