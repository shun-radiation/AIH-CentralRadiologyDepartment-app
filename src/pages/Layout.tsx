import Box from '@mui/material/Box';
import Header from '../components/layout/Header';
import SideBar from '../components/layout/SideBar';
import CssBaseline from '@mui/material/CssBaseline';
import { useState } from 'react';
import MainContent from '../components/layout/MainContent';
import { styled } from '@mui/material/styles';

const Layout = () => {
  const [open, setOpen] = useState(true);

  const drawerWidth = 240;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

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
          DrawerHeader={DrawerHeader}
        />
        <MainContent
          open={open}
          drawerWidth={drawerWidth}
          DrawerHeader={DrawerHeader}
        />
      </Box>
    </>
  );
};

export default Layout;
