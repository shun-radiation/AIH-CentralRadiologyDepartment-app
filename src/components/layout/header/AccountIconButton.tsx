import { cloneElement, useEffect, useRef, useState, type JSX } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import ProfileDialog from './accountMenu/ProfileDialog';
import SettingDialog from './accountMenu/SettingDialog';
import SignoutDialog from './accountMenu/SignoutDialog';

const userName = 'ユーザー';
const userEmail = '仮メール';

type AccountMenu = 'プロフィール' | '設定' | 'サインアウト';

const menuItems: AccountMenu[] = ['プロフィール', '設定', 'サインアウト'];

const menuItemIcons: Record<AccountMenu, JSX.Element> = {
  プロフィール: <AccountCircleIcon />,
  設定: <SettingsIcon />,
  サインアウト: <LogoutIcon />,
};
const AccountIconButton = () => {
  // ユーザーメニュー
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [selectAccountMenu, setSelectAccountMenu] =
    useState<AccountMenu>('プロフィール');

  // フォーカスを当てたい要素を参照
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);

  // ダイアログが開いた時にフォーカスを移動
  useEffect(() => {
    if (isDialogOpen && descriptionRef.current) {
      descriptionRef.current.focus();
    }
    setSelectAccountMenu('プロフィール');
  }, [isDialogOpen]);

  const handleAvatarClick = () => {
    setIsDialogOpen(true);
  };

  const handleMenuClose = () => {
    setIsDialogOpen(false);
  };

  const handleSelectAccountMenu = (menuItem: AccountMenu) => {
    setSelectAccountMenu(menuItem);
  };

  const selectAccountMenuContext: Record<AccountMenu, JSX.Element> = {
    プロフィール: <ProfileDialog />,
    設定: <SettingDialog />,
    サインアウト: <SignoutDialog />,
  };

  return (
    <div>
      {/* ユーザーメニュー */}
      <Tooltip title={userEmail ?? userName}>
        <IconButton
          onClick={handleAvatarClick}
          size='small'
          sx={{ ml: 0.5 }}
          aria-controls={isDialogOpen ? 'account-dialog' : undefined}
          aria-haspopup='true'
          aria-expanded={isDialogOpen ? 'true' : undefined}
          aria-label='アカウントメニューを開く'
        >
          <Avatar sx={{ width: 32, height: 32 }}>{userName?.[0] ?? 'U'}</Avatar>
        </IconButton>
      </Tooltip>

      {/* ダイアログ(ポップアップ) */}
      <Dialog
        onClose={handleMenuClose}
        open={isDialogOpen}
        scroll={'paper'}
        aria-labelledby='account-dialog-title'
        aria-describedby='account-dialog-description'
        disableAutoFocus
        slotProps={{
          transition: { onEntered: () => descriptionRef.current?.focus() },
        }}
        sx={{
          '& .MuiDialog-paper': {
            width: { xs: '100%', md: '700px' },
            maxWidth: '700px',
            height: '80vh',
          },
        }}
      >
        <DialogContent dividers={true} sx={{ p: 0 }}>
          <Box
            id='account-dialog'
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '180px 1fr' },
            }}
          >
            {/* 左(スクロールなし) */}
            <Box
              component='nav'
              aria-label='アカウントメニュー'
              bgcolor='#eee'
              sx={{
                overflow: 'hidden', // ← スクロール禁止
                height: { md: '80vh' },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'flex-end', md: 'flex-start' },
                }}
              >
                <IconButton onClick={handleMenuClose} aria-label='閉じる'>
                  <CloseIcon
                    sx={{
                      fontSize: 'large',
                      m: { xs: 1, md: 2 },
                      color: '#333',
                    }}
                  />
                </IconButton>
              </Box>
              <List sx={{ pt: 0 }}>
                <Grid
                  container
                  rowSpacing={2}
                  columnSpacing={{ xs: 2 }}
                  sx={{ mx: 2 }}
                >
                  {menuItems.map((menuItem) => (
                    <Grid size={{ xs: 4, md: 12 }} key={menuItem}>
                      <ListItem
                        disablePadding
                        sx={{
                          bgcolor: '#ddd',
                          borderRadius: '12px', // theme.tsのMuiListItemButtonでの値と揃える。
                        }}
                      >
                        <ListItemButton
                          selected={menuItem === selectAccountMenu}
                          onClick={() => handleSelectAccountMenu(menuItem)}
                          sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            justifyContent: { xs: 'center', md: 'flex-start' },
                            p: 1,
                          }}
                        >
                          {cloneElement(menuItemIcons[menuItem], {
                            sx: {
                              color: 'grey',
                              mb: { xs: 0.5, md: 0 },
                              mr: { md: 2 },
                              fontSize: { xs: '20px', sm: '24px', md: '24px' },
                            },
                          })}
                          <ListItemText
                            primary={menuItem}
                            slotProps={{
                              primary: {
                                fontSize: { xs: '8px', sm: '12px', md: '12px' },
                                textAlign: { xs: 'center', md: 'left' },
                              },
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    </Grid>
                  ))}
                </Grid>
              </List>
            </Box>

            {/* 右：選択内容（スクロールあり） */}
            <Box
              sx={{
                overflow: 'auto', // ← ここだけスクロール
                p: 2.5,
                flexGrow: 1,
              }}
              role='region'
              aria-live='polite'
            >
              <DialogTitle
                id='account-dialog-title'
                sx={{ p: 0, pl: 1 }}
                ref={descriptionRef}
                tabIndex={0}
              >
                {selectAccountMenu}
              </DialogTitle>
              <Divider sx={{ pt: 1 }} />
              <DialogContentText
                id='account-dialog-description'
                tabIndex={0}
                sx={{ pt: 1 }}
              >
                {selectAccountMenuContext[selectAccountMenu]}
              </DialogContentText>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountIconButton;
