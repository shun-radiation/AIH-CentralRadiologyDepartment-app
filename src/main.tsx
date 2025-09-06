import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme/theme';
import CssBaseline from '@mui/material/CssBaseline';
import { UserContextProvider } from './context/userInfo/UserContext';
import { DateContextProvider } from './context/dateInfo/DateContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContextProvider>
        <DateContextProvider>
          <UserContextProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <App />
            </LocalizationProvider>
          </UserContextProvider>
        </DateContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  </StrictMode>
);
