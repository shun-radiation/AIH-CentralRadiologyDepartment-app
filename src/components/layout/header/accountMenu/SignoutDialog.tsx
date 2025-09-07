import {
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress,
  Paper,
} from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useState } from 'react';
import { UserAuth } from '../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../../../context/userInfo/useUserInfo';
import ProfileAvatar from '../../../avatar/ProfileAvatar';

const SignoutDialog = () => {
  const [loading, setLoading] = useState(false);

  const { session, signout } = UserAuth();
  const { userInfo } = useUserInfo();

  const navigate = useNavigate();

  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setLoading(true);
    // 擬似的に2秒後完了
    // await new Promise((r) => setTimeout(r, 2000));
    e.preventDefault();
    try {
      await signout();
      navigate('signin');
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
    // alert('サインアウトしました');
  };

  return (
    <>
      <Box
        sx={{
          minHeight: { md: '60vh' },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.default',
          p: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: 'center',
            width: '100%',
            maxWidth: 360,
          }}
        >
          <Box display={'flex'} flexDirection={'column'} alignItems='center'>
            <ProfileAvatar formName={userInfo?.name_kanji} size={70} />
            <Typography variant='h6' fontWeight={600} sx={{ mt: 1 }}>
              {userInfo?.name_kanji}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {session?.user.email}
            </Typography>

            <Button
              fullWidth
              variant='contained'
              color='error'
              disableElevation
              startIcon={!loading ? <LogoutRoundedIcon /> : undefined}
              onClick={handleSignOut}
              disabled={loading}
              sx={{ borderRadius: 2, mt: 3 }}
            >
              {loading ? (
                <Stack direction='row' alignItems='center' spacing={1}>
                  <CircularProgress size={18} color='inherit' />
                  <span>サインアウト中…</span>
                </Stack>
              ) : (
                'サインアウト'
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default SignoutDialog;
