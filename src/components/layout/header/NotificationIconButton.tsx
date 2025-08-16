import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationIconButton = () => {
  return (
    <>
      <Tooltip title='通知'>
        <IconButton
          size='large'
          aria-label='通知を開く'
          // onClick={onNotificationsClick}
        >
          <Badge color='error' variant='dot'>
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
    </>
  );
};

export default NotificationIconButton;
