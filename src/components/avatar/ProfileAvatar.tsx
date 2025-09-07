import { Avatar } from '@mui/material';

interface ProfileAvatarProps {
  formName: string | null | undefined;
  size: number;
}
const ProfileAvatar = ({ formName, size }: ProfileAvatarProps) => {
  const getInitials = (name: string | null | undefined) => {
    if (name) {
      // 例: "山田 太郎" → "太郎"の先頭 + "山" など好みに合わせて
      const trimmed = name.replace(/\s+/g, '');
      if (!trimmed) return 'U';
      return trimmed.slice(0, 2);
    }
    return;
  };

  return (
    <>
      <Avatar
        sx={{
          width: size,
          height: size,
          borderRadius: '24%',
          fontWeight: 700,
          bgcolor: 'primary.main',
          fontSize: size > 40 ? 'large' : 'small',
        }}
        aria-label='ユーザーのアバター'
      >
        {getInitials(formName)}
      </Avatar>
    </>
  );
};

export default ProfileAvatar;
