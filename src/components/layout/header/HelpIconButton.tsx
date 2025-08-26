import { useState } from 'react';
import { Button, DialogActions, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const HelpIconButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleHelpIconClick = () => {
    setIsDialogOpen(true);
  };

  const handleHelpDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Tooltip title='ヘルプ'>
        <IconButton
          size='medium'
          aria-label='ヘルプを開く'
          onClick={handleHelpIconClick}
        >
          <HelpOutlineIcon
            sx={{ width: { xs: 24, md: 32 }, height: { xs: 24, md: 32 } }}
          />
        </IconButton>
      </Tooltip>

      {/* ダイアログ(ポップアップ) */}
      <Dialog
        onClose={handleHelpDialogClose}
        open={isDialogOpen}
        scroll={'paper'}
        disableRestoreFocus
        aria-labelledby='help-dialog-title'
        aria-describedby='help-dialog-description'
        slotProps={{
          paper: { sx: { borderRadius: 3 } },
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
          <Box id='help-dialog'>
            <Box
              sx={{
                overflow: 'auto',
                p: 2.5,
                // flexGrow: 1,
              }}
              role='region'
              aria-live='polite'
            >
              <DialogTitle id='help-dialog-title' sx={{ p: 0, pl: 1 }}>
                ヘルプメニュー
              </DialogTitle>

              <Divider sx={{ pt: 1 }} />
              <DialogContentText
                id='help-dialog-description'
                tabIndex={0}
                sx={{ p: 3 }}
                component={'div'}
              >
                ヘルプ@@@特になし
                <Typography sx={{ marginBottom: 2 }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Rhoncus dolor purus non enim praesent elementum facilisis leo
                  vel. Risus at ultrices mi tempus imperdiet. Semper risus in
                  hendrerit gravida rutrum quisque non tellus. Convallis
                  convallis tellus id interdum velit laoreet id donec ultrices.
                  Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl
                  suscipit adipiscing bibendum est ultricies integer quis.
                  Cursus euismod quis viverra nibh cras. Metus vulputate eu
                  scelerisque felis imperdiet proin fermentum leo. Mauris
                  commodo quis imperdiet massa tincidunt. Cras tincidunt
                  lobortis feugiat vivamus at augue. At augue eget arcu dictum
                  varius duis at consectetur lorem. Velit sed ullamcorper morbi
                  tincidunt. Lorem donec massa sapien faucibus et molestie ac.
                </Typography>
                <Typography sx={{ marginBottom: 2 }}>
                  Consequat mauris nunc congue nisi vitae suscipit. Fringilla
                  est ullamcorper eget nulla facilisi etiam dignissim diam.
                  Pulvinar elementum integer enim neque volutpat ac tincidunt.
                  Ornare suspendisse sed nisi lacus sed viverra tellus. Purus
                  sit amet volutpat consequat mauris. Elementum eu facilisis sed
                  odio morbi. Euismod lacinia at quis risus sed vulputate odio.
                  Morbi tincidunt ornare massa eget egestas purus viverra
                  accumsan in. In hendrerit gravida rutrum quisque non tellus
                  orci ac. Pellentesque nec nam aliquam sem et tortor. Habitant
                  morbi tristique senectus et. Adipiscing elit duis tristique
                  sollicitudin nibh sit. Ornare aenean euismod elementum nisi
                  quis eleifend. Commodo viverra maecenas accumsan lacus vel
                  facilisis. Nulla posuere sollicitudin aliquam ultrices
                  sagittis orci a.
                </Typography>
                <Typography sx={{ marginBottom: 2 }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Rhoncus dolor purus non enim praesent elementum facilisis leo
                  vel. Risus at ultrices mi tempus imperdiet. Semper risus in
                  hendrerit gravida rutrum quisque non tellus. Convallis
                  convallis tellus id interdum velit laoreet id donec ultrices.
                  Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl
                  suscipit adipiscing bibendum est ultricies integer quis.
                  Cursus euismod quis viverra nibh cras. Metus vulputate eu
                  scelerisque felis imperdiet proin fermentum leo. Mauris
                  commodo quis imperdiet massa tincidunt. Cras tincidunt
                  lobortis feugiat vivamus at augue. At augue eget arcu dictum
                  varius duis at consectetur lorem. Velit sed ullamcorper morbi
                  tincidunt. Lorem donec massa sapien faucibus et molestie ac.
                </Typography>
                <Typography sx={{ marginBottom: 2 }}>
                  Consequat mauris nunc congue nisi vitae suscipit. Fringilla
                  est ullamcorper eget nulla facilisi etiam dignissim diam.
                  Pulvinar elementum integer enim neque volutpat ac tincidunt.
                  Ornare suspendisse sed nisi lacus sed viverra tellus. Purus
                  sit amet volutpat consequat mauris. Elementum eu facilisis sed
                  odio morbi. Euismod lacinia at quis risus sed vulputate odio.
                  Morbi tincidunt ornare massa eget egestas purus viverra
                  accumsan in. In hendrerit gravida rutrum quisque non tellus
                  orci ac. Pellentesque nec nam aliquam sem et tortor. Habitant
                  morbi tristique senectus et. Adipiscing elit duis tristique
                  sollicitudin nibh sit. Ornare aenean euismod elementum nisi
                  quis eleifend. Commodo viverra maecenas accumsan lacus vel
                  facilisis. Nulla posuere sollicitudin aliquam ultrices
                  sagittis orci a.
                </Typography>
              </DialogContentText>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleHelpDialogClose}
            variant='contained'
            color='primary'
          >
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HelpIconButton;
