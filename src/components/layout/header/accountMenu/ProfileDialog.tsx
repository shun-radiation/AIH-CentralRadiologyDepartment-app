import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { UserInfo } from '../../../../context/UserContext';
import type { UserType } from '../../../../../types/databaseTypes';
import { supabase } from '../../../../../utils/supabaseClient';
import Snackbar from '@mui/material/Snackbar';
import Alert, { type AlertColor } from '@mui/material/Alert';

type FieldProps = {
  label: string;
  value: string | number | null | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  editing: boolean;
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  editing,
}: FieldProps) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      size='small'
      fullWidth
      placeholder={placeholder}
      slotProps={{
        htmlInput: {
          inputMode,
        },
        input: editing ? undefined : { readOnly: true },
      }}
      sx={{
        '& .MuiInputBase-root.Mui-disabled, & .MuiInputBase-root[readonly]': {
          bgcolor: 'grey.50',
        },
      }}
    />
  );
}

const getInitials = (name: string | null | undefined) => {
  if (name) {
    // 例: "山田 太郎" → "太郎"の先頭 + "山" など好みに合わせて
    const trimmed = name.replace(/\s+/g, '');
    if (!trimmed) return 'U';
    return trimmed.slice(0, 2);
  }
  return;
};

// ===========================================================

const ProfileDialog = () => {
  // const onSave = async (next: typeof profile) => {
  //   console.log('保存処理（仮）:', next);
  //   // 実際は Supabase などに保存する
  //   await new Promise((res) => setTimeout(res, 1000)); // 遅延だけ再現
  // };

  // const isSaving = false;
  const { userInfo, setUserInfo } = UserInfo();
  console.log('userInfo', userInfo);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<UserType | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>('success');

  useEffect(() => {
    setForm(userInfo);
  }, [userInfo]);
  console.log('form', form);

  const handleChange =
    (key: keyof UserType) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => {
        if (!prev) return prev;
        return { ...prev, [key]: e.target.value } as UserType;
      });
    };

  const handleCancel = () => {
    if (isSaving) return;
    setForm(userInfo);
    setEditing(false);
  };

  const handleSave = async () => {
    if (!form) return;
    try {
      setIsSaving(true);

      // ▼ここで実際の保存処理を呼ぶ（例：Supabase）
      const { data, error } = await supabase
        .from('users')
        .update({
          name_kanji: form.name_kanji,
          name_kana: form.name_kana,
          employee_number: form.employee_number,
          technologist_number: form.technologist_number,
          hire_date: form.hire_date,
          modality_id: form.modality_id,
        })
        .eq('id', form.id)
        .select()
        .single();
      if (error) throw error.message;

      setUserInfo(data);
      setForm(data);

      // 保存成功時は編集終了
      setEditing(false);
      setSnackbarSeverity('success');
      setSnackbarMessage('保存に成功しました');
      setSnackbarOpen(true);
    } catch (e) {
      console.error('保存に失敗しました', e);
      setSnackbarSeverity('error');
      setSnackbarMessage(`保存に失敗しました: ${e}`);
      setSnackbarOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSnackbarClose = (
    _e?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return; // 外側クリックで勝手に閉じない
    setSnackbarOpen(false);
  };

  return (
    <>
      {/* <Typography>{userInfo?.created_at}</Typography>
      <Typography>{userInfo?.modality_id}</Typography>
      <Typography>{form?.created_at}</Typography> */}
      <Box
        sx={{
          bgcolor: '#f6f7f9',
          minHeight: '100%',
          py: { xs: 3, md: 6 },
        }}
      >
        <Container maxWidth='md'>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid #eee`,
              backdropFilter: 'saturate(180%) blur(10px)',
              background: 'rgba(255,255,255,0.9)',
            }}
          >
            <CardHeader
              sx={{
                pb: 0,
                px: { xs: 2, md: 3 },
                pt: { xs: 2, md: 3 },
              }}
              avatar={
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '24%',
                    fontWeight: 700,
                    bgcolor: 'primary.main',
                  }}
                  aria-label='ユーザーのアバター'
                >
                  {getInitials(form?.name_kanji)}
                </Avatar>
              }
              title={
                <Stack direction='row' alignItems='center' gap={1}>
                  <Typography
                    variant='h6'
                    sx={{ fontWeight: 700, letterSpacing: 0.2 }}
                  >
                    プロフィール
                  </Typography>
                  <Chip
                    size='small'
                    label={form?.modality_id || '未設定'}
                    sx={{
                      borderRadius: 1.5,
                      bgcolor: 'grey.100',
                    }}
                  />
                </Stack>
              }
              subheader={
                <Typography variant='body2' color='text.secondary'>
                  アカウント情報の確認と更新
                </Typography>
              }
              action={
                <Stack direction='row' alignItems='center' gap={1}>
                  {!editing ? (
                    <Tooltip title='編集'>
                      <IconButton
                        aria-label='編集'
                        onClick={() => setEditing(true)}
                      >
                        <EditRoundedIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Stack direction='row' gap={1}>
                      <Tooltip title='保存'>
                        <span>
                          <IconButton
                            aria-label='保存'
                            onClick={handleSave}
                            disabled={isSaving}
                            color='primary'
                          >
                            <CheckRoundedIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title='キャンセル'>
                        <IconButton
                          aria-label='キャンセル'
                          onClick={handleCancel}
                        >
                          <CloseRoundedIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  )}
                </Stack>
              }
            />
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid size={12}>
                  <Field
                    label='名前（漢字）'
                    value={form?.name_kanji}
                    onChange={handleChange('name_kanji')}
                    editing={editing}
                    placeholder='例）飯塚 太郎'
                  />
                </Grid>
                <Grid size={12}>
                  <Field
                    label='名前（カタカナ）'
                    value={form?.name_kana}
                    onChange={handleChange('name_kana')}
                    editing={editing}
                    placeholder='例）イイヅカ タロウ'
                  />
                </Grid>

                <Grid size={12}>
                  <Field
                    label='職員番号'
                    value={form?.employee_number}
                    onChange={handleChange('employee_number')}
                    editing={editing}
                    placeholder='例）00xxxxx'
                  />
                </Grid>
                <Grid size={12}>
                  <Field
                    label='技師番号'
                    value={form?.technologist_number}
                    onChange={handleChange('technologist_number')}
                    editing={editing}
                    placeholder='例）xxx'
                  />
                </Grid>

                <Grid size={12}>
                  <Field
                    label='入社年月日'
                    value={form?.hire_date}
                    onChange={handleChange('hire_date')}
                    editing={editing}
                    placeholder='YYYY-MM-DD'
                    inputMode='numeric'
                  />
                </Grid>
                <Grid size={12}>
                  <Field
                    label='部門'
                    value={form?.modality_id}
                    onChange={handleChange('modality_id')}
                    editing={editing}
                    placeholder='例）一般撮影'
                  />
                </Grid>

                {/* {userInfo.email && (
                  <Grid size={{ xs: 12, md: 12 }}>
                    <TextField
                      label='メールアドレス'
                      value={userInfo.email}
                      size='small'
                      fullWidth
                      InputProps={{ readOnly: true }}
                      aria-readonly
                    />
                  </Grid>
                )} */}
              </Grid>

              {/* フッタ操作（モバイル親切） */}
              {/* {editing && (
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  gap={1.5}
                  justifyContent='flex-end'
                  mt={3}
                >
                  <Button
                    // onClick={handleCancel}
                    startIcon={<CloseRoundedIcon />}
                  >
                    キャンセル
                  </Button>
                  <Button
                    variant='contained'
                    // onClick={handleSave}
                    startIcon={<CheckRoundedIcon />}
                    // disabled={isSaving}
                  >
                    保存
                  </Button>
                </Stack>
              )} */}
            </CardContent>
          </Card>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={5000} // 5秒で自動クローズ
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
              sx={{ width: '100%' }}
              variant='filled'
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Container>
        <Typography
          sx={{
            pt: 2,
            pr: 3,
            display: 'flex',
            justifyContent: 'flex-end',
            fontSize: '12px',
          }}
        >
          最終更新日：{form?.updated_at}
        </Typography>
      </Box>
    </>
  );
};

export default ProfileDialog;
