import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const Home = () => {
  const { session, signout } = UserAuth();
  const navigate = useNavigate();

  console.log(session);

  const handleSignout = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      await signout();
      navigate('signin');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Box>
        <Typography>Home</Typography>
        <Typography>Welcome, {session?.user.email} 様 !</Typography>
        <Link
          href='../signout'
          variant='body2'
          sx={{ alignSelf: 'center' }}
          onClick={handleSignout}
        >
          Sign out
        </Link>
      </Box>
    </>
  );
};

export default Home;
