import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const HelpIconButton = () => {
  return (
    <>
      <Tooltip title='ヘルプ'>
        <IconButton
          size='large'
          aria-label='ヘルプを開く'
          // onClick={onHelp}
        >
          <HelpOutlineIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default HelpIconButton;
