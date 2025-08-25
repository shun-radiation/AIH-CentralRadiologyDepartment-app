import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';

const Nomatch = () => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '40px',
        }}
      >
        NoMatch
        <br />
        <Link to={'/'}>ホームはこちら</Link>
      </Box>
    </>
  );
};

export default Nomatch;
