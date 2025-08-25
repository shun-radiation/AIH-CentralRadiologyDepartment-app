import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { DrawerHeader } from './header/DrawerHeader';
import { IconContext } from 'react-icons/lib';
import { GiKneeCap } from 'react-icons/gi';
import { TbDeviceComputerCamera } from 'react-icons/tb';
import { IoMagnetSharp } from 'react-icons/io5';
import { PiHeartbeat } from 'react-icons/pi';
import { BiCameraMovie } from 'react-icons/bi';
import { BiSolidInjection } from 'react-icons/bi';
import { GiSinusoidalBeam } from 'react-icons/gi';
import { Link, useLocation } from 'react-router-dom';

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
  const location = useLocation();
  return (
    <>
      <IconContext.Provider value={{ size: '28px' }}>
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
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to='/Xray_page'
                selected={location.pathname === '/Xray_page'}
                aria-label='一般撮影ページへ移動'
              >
                <ListItemIcon>
                  <GiKneeCap />
                </ListItemIcon>
                <ListItemText primary={'一般撮影'} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to='/CT_page'
                selected={location.pathname === '/CT_page'}
                aria-label='CTページへ移動'
              >
                <ListItemIcon>
                  <TbDeviceComputerCamera />
                </ListItemIcon>
                <ListItemText primary={'CT'} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to='/MRI_page'
                selected={location.pathname === '/MRI_page'}
                aria-label='MRIページへ移動'
              >
                <ListItemIcon>
                  <IoMagnetSharp />
                </ListItemIcon>
                <ListItemText primary={'MRI'} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to='/Angio_page'
                selected={location.pathname === '/Angio_page'}
                aria-label='心カテ・Angioページへ移動'
              >
                <ListItemIcon>
                  <PiHeartbeat />
                </ListItemIcon>
                <ListItemText primary={'心カテ・Angio'} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to='/Fluoroscopy_page'
                selected={location.pathname === '/Fluoroscopy_page'}
                aria-label='透視・内視鏡ページへ移動'
              >
                <ListItemIcon>
                  <BiCameraMovie />
                </ListItemIcon>
                <ListItemText primary={'透視・内視鏡'} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to='/RI_page'
                selected={location.pathname === '/RI_page'}
                aria-label='RIページへ移動'
              >
                <ListItemIcon>
                  <BiSolidInjection />
                </ListItemIcon>
                <ListItemText primary={'RI'} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to='/Radiotherapy_page'
                selected={location.pathname === '/Radiotherapy_page'}
                aria-label='放射線治療ページへ移動'
              >
                <ListItemIcon>
                  <GiSinusoidalBeam />
                </ListItemIcon>
                <ListItemText primary={'放射線治療'} />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
      </IconContext.Provider>
    </>
  );
};
export default SideBar;
