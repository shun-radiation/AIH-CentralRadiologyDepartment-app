import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme/theme';
import CssBaseline from '@mui/material/CssBaseline';
import { UserContextProvider } from './context/userInfo/UserContext';
import { DateContextProvider } from './context/dateInfo/DateContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContextProvider>
        <DateContextProvider>
          <UserContextProvider>
            <App />
          </UserContextProvider>
        </DateContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  </StrictMode>
);
