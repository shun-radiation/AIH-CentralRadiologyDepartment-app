import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.2s ease-in-out',
          '&.Mui-selected': {
            backgroundColor: 'lightblue',
            color: '#333',
            '&:hover': {
              backgroundColor: 'powderblue',
            },
          },
          '&:hover': {
            backgroundColor: 'skyblue',
          },

          // '&.Mui-focusVisible': {
          //   outline: '2px solid red',
          //   outlineOffset: '2px',
          // },
        },
      },
    },
  },
  palette: {
    background: {
      default: '#f9f9f9',
    },
  },
  // typography: {
  //   fontFamily: 'Roboto, Arial, sans-serif',
  // },
});
