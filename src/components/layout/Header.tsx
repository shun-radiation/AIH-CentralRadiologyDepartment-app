import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import NotificationIconButton from './header/NotificationIconButton';
import HelpIconButton from './header/HelpIconButton';
import AccountIconButton from './header/AccountIconButton';
import logoUrl from '../../assets/logos/header-logo.svg';
import { Link } from 'react-router-dom';
import { AppBar } from './header/AppBar';

interface HeaderProps {
  open: boolean;
  drawerWidth: number;
  handleDrawerOpen: () => void;
}

const Header = ({ open, drawerWidth, handleDrawerOpen }: HeaderProps) => {
  return (
    <>
      <AppBar
        position='fixed'
        open={open}
        elevation={1}
        color='default'
        drawerWidth={drawerWidth}
      >
        <Toolbar sx={{ gap: 1, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* ハンバーガーアイコン(サイドバーが閉じている場合) */}
            {!open && (
              <IconButton
                color='inherit'
                aria-label='open drawer'
                onClick={handleDrawerOpen}
                edge='start'
                sx={[
                  {
                    mr: { xs: 0, md: 1 },
                  },
                  open && { display: 'none' },
                ]}
              >
                <MenuIcon />
              </IconButton>
            )}
            {/* Homeへ移動(logo,App名) */}
            <Box
              component={Link}
              to='/'
              aria-label='to home'
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: 64,
                px: 1,
                justifyContent: 'center',
                textDecoration: 'none',
                bgcolor: 'pink',
                color: 'inherit',
                outline: 'none',
                '&:focus-visible': {
                  boxShadow: (t) => `0 0 0 3px ${t.palette.primary.main}66`,
                  borderRadius: 1,
                },
              }}
            >
              {/* <HeaderLogo /> */}
              <Box
                component='img'
                src={logoUrl}
                alt='Site logo'
                decoding='async'
                loading='eager'
                sx={{
                  height: { xs: '32px', md: '64px' },
                  width: 'auto',
                  aspectRatio: 1,
                  display: 'block',
                  bgcolor: 'lightskyblue',
                }}
              />
              {/* App名 */}
              <Typography
                variant='h6'
                noWrap
                component='div'
                sx={{ fontWeight: 600, fontSize: { xs: '15px', md: '20px' } }}
              >
                中央放射線部-app
              </Typography>
            </Box>
          </Box>
          {/* 右側操作エリア */}
          <Box
            sx={{
              // ml: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {/* 通知アイコンボタン */}
            <NotificationIconButton />

            {/* ヘルプアイコンボタン */}
            <HelpIconButton />

            {/* アカウントアイコンボタン */}
            <AccountIconButton />
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
