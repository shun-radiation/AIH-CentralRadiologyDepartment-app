import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const HelpIconButton = () => {
  return (
    <>
      <Tooltip title='ヘルプ'>
        <IconButton
          size='medium'
          aria-label='ヘルプを開く'
          // onClick={onHelp}
        >
          <HelpOutlineIcon
            sx={{ width: { xs: 24, md: 32 }, height: { xs: 24, md: 32 } }}
          />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default HelpIconButton;
