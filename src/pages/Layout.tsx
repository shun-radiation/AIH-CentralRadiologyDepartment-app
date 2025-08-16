import Box from '@mui/material/Box';
import Header from '../components/layout/Header';
import SideBar from '../components/layout/SideBar';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect, useState } from 'react';
import MainContent from '../components/layout/MainContent';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Layout = () => {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });
  const [open, setOpen] = useState<boolean>(mdUp);

  useEffect(() => {
    setOpen(mdUp);
  }, [mdUp]);

  const drawerWidth = 240;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Header
          open={open}
          drawerWidth={drawerWidth}
          handleDrawerOpen={handleDrawerOpen}
        />
        <SideBar
          open={open}
          drawerWidth={drawerWidth}
          handleDrawerClose={handleDrawerClose}
          mdUp={mdUp}
        />
        <MainContent open={open} drawerWidth={drawerWidth} mdUp={mdUp} />
      </Box>
    </>
  );
};

export default Layout;
