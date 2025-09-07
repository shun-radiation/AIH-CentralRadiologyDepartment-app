import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { UserAuth } from '../context/AuthContext';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SigninContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { session, signinUser } = UserAuth();
  console.log('signin.session===>', session);
  // console.log(email, password);

  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signinUser(email, password);
      if (result.success) {
        navigate(from, { replace: true });
        return;
      }
      setError(result.error.message ?? 'Sign in failed.');
    } catch {
      setError('an unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box>
        <CssBaseline enableColorScheme />
        <SigninContainer direction='column' justifyContent='space-between'>
          <Card variant='outlined'>
            {/* <icon></icon> */}
            <Typography
              component='h1'
              variant='h4'
              sx={{
                width: '100%',
                fontSize: 'clamp(2rem, 10vw, 2.15rem)',
                fontWeight: 'bold',
              }}
            >
              Sign in
            </Typography>
            <Box
              component='form'
              onSubmit={handleSignin}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <FormControl>
                <FormLabel htmlFor='email'>Email</FormLabel>
                <TextField
                  // error={emailError}
                  // helperText={emailErrorMessage}
                  id='email'
                  type='email'
                  name='email'
                  placeholder='your@email.com'
                  autoComplete='email'
                  autoFocus
                  required
                  fullWidth
                  variant='outlined'
                  // color={emailError ? 'error' : 'primary'}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor='password'>Password</FormLabel>
                <TextField
                  // error={passwordError}
                  // helperText={passwordErrorMessage}
                  name='password'
                  placeholder='••••••'
                  type='password'
                  id='password'
                  autoComplete='current-password'
                  required
                  fullWidth
                  variant='outlined'
                  // color={passwordError ? 'error' : 'primary'}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              {/* <FormControlLabel
                control={<Checkbox value='remember' color='primary' />}
                label='Remember me'
              /> */}
              {/* <ForgotPassword open={open} handleClose={handleClose} /> */}
              <Button
                type='submit'
                fullWidth
                variant='contained'
                // onClick={validateInputs}
                disabled={loading}
              >
                Sign in
              </Button>
              {error && (
                <Typography
                  sx={{
                    display: 'flex',
                    color: 'red',
                    justifyContent: 'center',
                  }}
                >
                  {error}
                </Typography>
              )}
              {/* <Link
                component='button'
                type='button'
                onClick={handleClickOpen}
                variant='body2'
                sx={{ alignSelf: 'center' }}
              >
                Forgot your password?
              </Link> */}
            </Box>
            <Divider>
              <Typography sx={{ color: 'text.secondary' }}>or</Typography>
            </Divider>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography sx={{ textAlign: 'center' }}>
                Don&apos;t have an account?{' '}
                <Link
                  href='../signup/'
                  variant='body2'
                  sx={{ alignSelf: 'center' }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Card>
        </SigninContainer>
      </Box>
    </>
  );
};

export default Signin;
