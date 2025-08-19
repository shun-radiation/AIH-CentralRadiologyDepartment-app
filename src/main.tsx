import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme/theme';
import CssBaseline from '@mui/material/CssBaseline';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </ThemeProvider>
  </StrictMode>
);
