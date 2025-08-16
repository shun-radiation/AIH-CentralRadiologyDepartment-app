import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

const AccountIconButton = () => {
  const userName = 'ユーザー';
  const userEmail = '仮メール';

  // ユーザーメニュー
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleAvatarClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {/* ユーザーメニュー */}
      <Tooltip title={userEmail ?? userName}>
        <IconButton
          onClick={handleAvatarClick}
          size='small'
          sx={{ ml: 0.5 }}
          aria-controls={openMenu ? 'user-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={openMenu ? 'true' : undefined}
        >
          <Avatar sx={{ width: 32, height: 32 }}>{userName?.[0] ?? 'U'}</Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id='user-menu'
        open={openMenu}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem disabled>
          <Box>
            <Typography variant='subtitle2'>{userName}</Typography>
            {userEmail && (
              <Typography variant='caption' color='text.secondary'>
                {userEmail}
              </Typography>
            )}
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            /* プロフィールページへ */
          }}
        >
          プロフィール
        </MenuItem>
        <MenuItem
          onClick={() => {
            /* 設定ページへ */
          }}
        >
          設定
        </MenuItem>
        <Divider />
        <MenuItem
        // onClick={() => {
        //   onSignOut?.();
        // }}
        >
          サインアウト
        </MenuItem>
      </Menu>
    </>
  );
};

export default AccountIconButton;
