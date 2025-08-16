import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { DrawerHeader } from './header/DrawerHeader';

interface SideBarProps {
  open: boolean;
  drawerWidth: number;
  handleDrawerClose: () => void;
  mdUp: boolean;
}

const SideBar = ({
  open,
  drawerWidth,
  handleDrawerClose,
  mdUp,
}: SideBarProps) => {
  return (
    <>
      <Drawer
        sx={{
          // display: { xs: 'block', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        // variant='persistent'
        variant={mdUp ? 'persistent' : 'temporary'}
        anchor='left'
        open={open}
        onClose={!mdUp ? handleDrawerClose : undefined}
        ModalProps={{ keepMounted: true }} // モバイルでのパフォーマンス
      >
        {/* サイドバーを閉じるボタン */}
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>

        <Divider />

        {/* サイドバーに表示されるリスト */}
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};
export default SideBar;
