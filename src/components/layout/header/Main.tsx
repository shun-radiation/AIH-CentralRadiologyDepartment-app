import { styled } from '@mui/material/styles';

export const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open?: boolean;
  drawerWidth: number;
  mdUp: boolean;
}>(({ theme, open, drawerWidth, mdUp }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: mdUp ? `-${drawerWidth}px` : 0,
  ...(mdUp &&
    open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
}));
