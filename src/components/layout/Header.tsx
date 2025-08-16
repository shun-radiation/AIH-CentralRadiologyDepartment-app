import MuiAppBar from '@mui/material/AppBar';
import type { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import NotificationIconButton from './header/NotificationIconButton';
import HelpIconButton from './header/HelpIconButton';
import AccountIconButton from './header/AccountIconButton';
import logoUrl from '../../assets/logos/header-logo.svg';
import { Link } from 'react-router-dom';

interface HeaderProps {
  open: boolean;
  drawerWidth: number;
  handleDrawerOpen: () => void;
  // userName?: string; // 右上に表示するユーザー名（任意）
  // userEmail?: string; // ツールチップ等に使える（任意）
  //   onSignOut?: () => void; // サインアウトのハンドラ（任意）
  //   onHelp?: () => void; // ヘルプ押下時（任意）
  //   onNotificationsClick?: () => void; // 通知押下時（任意）
}

const Header = ({
  open,
  drawerWidth,
  handleDrawerOpen,
}: // userName = 'ユーザー',
// userEmail = '仮メール',
HeaderProps) => {
  interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
  }

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })<AppBarProps>(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
      {
        props: ({ open }) => open,
        style: {
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: `${drawerWidth}px`,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      },
    ],
  }));

  return (
    <>
      <AppBar position='fixed' open={open} elevation={1} color='default'>
        <Toolbar sx={{ minHeight: 64, gap: 1 }}>
          {/* ハンバーガーアイコン(サイドバーが閉じている場合) */}
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            sx={[
              {
                mr: 1,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          {/* App名 */}
          {/* <HeaderLogo /> */}
          <Box
            component={Link}
            to='/'
            aria-label='to home'
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: 64,
              px: 3,
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
            <Box
              component='img'
              src={logoUrl}
              alt='Site logo'
              decoding='async'
              loading='eager'
              sx={{
                height: 64,
                width: 'auto',
                aspectRatio: 1,
                display: 'block',
                bgcolor: 'lightskyblue',
              }}
            />
            <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{ fontWeight: 600 }}
            >
              中央放射線部-app
            </Typography>
          </Box>

          {/* 右側操作エリア */}
          <Box
            sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}
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
