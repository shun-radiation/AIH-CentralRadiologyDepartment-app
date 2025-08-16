import * as React from 'react';
// import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
// import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
export interface TasksProgressProps {
  sx?: SxProps;
  roomName: string;
  value: number;
}

export function TasksProgress({
  value,
  roomName,
  sx,
}: TasksProgressProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          <Stack
            // direction='row'
            direction='column'
            sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}
            // spacing={3}
          >
            <Stack spacing={1}>
              <Typography
                color='text.secondary'
                gutterBottom
                variant='overline'
                fontSize={'17px'}
                noWrap
              >
                {roomName}
              </Typography>
              <Typography variant='h4'>{value}%</Typography>
            </Stack>
            {/* <Avatar
              sx={{
                backgroundColor: 'pink',
                width: [20, 30, 40], // xs, sm, lg の順
                height: [20, 30, 40], // xs, sm, lg の順
              }}
            >
              <FormatListBulletedIcon fontSize='large' />
            </Avatar> */}
          </Stack>
          <div>
            <LinearProgress value={value} variant='determinate' />
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
}
