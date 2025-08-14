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
import { useNavigate } from 'react-router-dom';
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
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignupContainer = styled(Stack)(({ theme }) => ({
  backgroundColor: 'lightblue',
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

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { session, signupNewUser } = UserAuth();
  console.log('signup.session===>', session);
  // console.log(email, password);

  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signupNewUser(email, password);
      if (result.success) {
        navigate('/');
        return;
      }
      setError(result.error.message ?? 'Sign up failed.');
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
        <SignupContainer direction='column' justifyContent='space-between'>
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
              Sign up
            </Typography>
            <Box
              component='form'
              onSubmit={handleSignup}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              {/* <FormControl>
                <FormLabel htmlFor='name'>Full name</FormLabel>
                <TextField
                  autoComplete='name'
                  name='name'
                  required
                  fullWidth
                  id='name'
                  placeholder='Jon Snow'
                  // error={nameError}
                  // helperText={nameErrorMessage}
                  // color={nameError ? 'error' : 'primary'}
                />
              </FormControl> */}
              <FormControl>
                <FormLabel htmlFor='email'>Email</FormLabel>
                <TextField
                  required
                  fullWidth
                  id='email'
                  placeholder='your@email.com'
                  name='email'
                  autoComplete='email'
                  variant='outlined'
                  // error={emailError}
                  // helperText={emailErrorMessage}
                  // color={passwordError ? 'error' : 'primary'}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor='password'>Password</FormLabel>
                <TextField
                  required
                  fullWidth
                  name='password'
                  placeholder='••••••'
                  type='password'
                  id='password'
                  autoComplete='new-password'
                  variant='outlined'
                  // error={passwordError}
                  // helperText={passwordErrorMessage}
                  // color={passwordError ? 'error' : 'primary'}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Button
                type='submit'
                fullWidth
                variant='contained'
                disabled={loading}
                // onClick={validateInputs}
              >
                Sign up
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
              <Divider>
                <Typography sx={{ color: 'text.secondary' }}>or</Typography>
              </Divider>
              <Typography sx={{ textAlign: 'center' }}>
                Already have an account?{' '}
                <Link
                  href='../signin'
                  variant='body2'
                  sx={{ alignSelf: 'center' }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Card>
        </SignupContainer>
      </Box>
    </>
  );
};

export default SignUp;
