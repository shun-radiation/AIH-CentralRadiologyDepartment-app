import {
  Box,
  Button,
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import {
  Controller,
  useForm,
  //  type SubmitHandler
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CalendarEvents } from '../../../types/databaseTypes';
// import type { Schema } from '../../validations/schema';
// import { supabase } from '../../../utils/supabaseClient';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { GiKneeCap } from 'react-icons/gi';
import { TbDeviceComputerCamera } from 'react-icons/tb';
import { IoMagnetSharp } from 'react-icons/io5';
import { PiHeartbeat } from 'react-icons/pi';
import { BiCameraMovie } from 'react-icons/bi';
import { BiSolidInjection } from 'react-icons/bi';
import { GiSinusoidalBeam } from 'react-icons/gi';
import { BsPersonWorkspace } from 'react-icons/bs';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import { MdCastForEducation } from 'react-icons/md';
import { MdEmojiEvents } from 'react-icons/md';
import { CiCircleMore } from 'react-icons/ci';
import { CalendarEventSchema, type Schema } from '../../validations/schema';
import { useDateInfo } from '../../context/dateInfo/useDateInfo';

const CalendarEventForm = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  // const [calendarEvents, setCalendarEvents] = useState<CalendarEvents[]>([]);
  const [selectedCalendarEvent, setSelectedCalendarEvent] =
    useState<CalendarEvents | null>(null);
  // const [currentMonth, setCurrentMonth] = useState(new Date());

  const {
    // timeZone,
    // currentYear,
    // currentMonth,
    // currentDate,
    isoDate,
    // now,
    // setBaseDate,
    // clearBaseDate,
  } = useDateInfo();

  // react-hook-form
  const {
    control,
    // handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<Schema>({
    defaultValues: {
      date: isoDate,
      title: '',
      category: '',
      description: '',
      is_allday: true,
      start_at: null,
      end_at: null,
    },
    resolver: zodResolver(CalendarEventSchema),
  });

  const isAllDay = watch('is_allday');

  // is_allday が false になったら値をクリアしたい場合
  useEffect(() => {
    if (!isAllDay) {
      setValue('start_at', null);
      setValue('end_at', null);
    }
  }, [isAllDay, setValue]);

  // 保存処理
  // const handleSaveCalendarEvent = async (calendarEvent: Schema) => {
  //   try {
  //     console.log(calendarEvent);
  //     // Supabaseにデータを保存
  //     const { data, error } = await supabase
  //       .from('calendar_events')
  //       .insert(calendarEvent) // 単一レコードでもオブジェクトでOK
  //       .select()
  //       .single(); // 返り値を1件に絞る

  //     if (error) {
  //       // Supabase のエラー
  //       console.error('Supabaseのエラーは', error);
  //       console.error('Supabaseのエラーメッセージは', error.message);
  //       console.error('Supabaseのエラー詳細は', error.details);
  //       console.error('Supabaseのエラーコードは', error.code);
  //       return;
  //     }

  //     const newCalendarEvent: CalendarEvents = {
  //       id: data.id, // SupabaseのテーブルでPRIMARY KEY(id)を設定している前提
  //       ...calendarEvent,
  //     };
  //     console.log('Inserted calendar event: ', newCalendarEvent);

  //     setCalendarEvents((prevCalendarEvent) => [
  //       ...prevCalendarEvent,
  //       newCalendarEvent,
  //     ]);
  //   } catch (err) {
  //     // error
  //     if (isFireStoreError(err)) {
  //       console.error('firebaseのエラーは', err);
  //       console.error('firebaseのエラーメッセージは', err.message);
  //       console.error('firebaseのエラーコードは', err.code);
  //     } else {
  //       console.error('一般的なエラーは', err);
  //     }
  //   }
  // };

  // // 削除処理
  // const handleDeleteCalendarEvent = async (
  //   transactionIds: string | readonly string[]
  // ) => {
  //   try {
  //     // オブジェクト(複数)ならそのまま、単一ならオブジェクト化する。
  //     const idsToDelete = Array.isArray(transactionIds)
  //       ? transactionIds
  //       : [transactionIds];
  //     console.log('削除対象', idsToDelete);

  //     for (const id of idsToDelete) {
  //       // firestoreのデータ削除
  //       await deleteDoc(doc(db, 'Transactions', id));
  //     }
  //     // リロードなしですぐに画面に反映されるために
  //     const filterdTransactions = transactions.filter(
  //       (transaction) => !idsToDelete.includes(transaction.id)
  //     );
  //     // console.log(filterdTransactions);
  //     setTransactions(filterdTransactions);
  //   } catch (err) {
  //     // error
  //     if (isFireStoreError(err)) {
  //       console.error('firebaseのエラーは', err);
  //       console.error('firebaseのエラーメッセージは', err.message);
  //       console.error('firebaseのエラーコードは', err.code);
  //     } else {
  //       console.error('一般的なエラーは', err);
  //     }
  //   }
  // };

  // // 変更処理
  // const handleUpdateCalendarEvent = async (
  //   transaction: Schema,
  //   transactionId: string
  // ) => {
  //   try {
  //     // firestore更新処理
  //     const docRef = doc(db, 'Transactions', transactionId);
  //     await updateDoc(docRef, transaction);
  //     // フロント更新
  //     const updatedTransactions = transactions.map((t) =>
  //       t.id === transactionId ? { ...t, ...transaction } : t
  //     ) as Transaction[];
  //     // console.log(updatedTransactions);
  //     setTransactions(updatedTransactions);
  //   } catch (err) {
  //     // error
  //     if (isFireStoreError(err)) {
  //       console.error('firebaseのエラーは', err);
  //       console.error('firebaseのエラーメッセージは', err.message);
  //       console.error('firebaseのエラーコードは', err.code);
  //     } else {
  //       console.error('一般的なエラーは', err);
  //     }
  //   }
  // };

  // フォームclose処理
  const handleCloseForm = () => {
    setSelectedCalendarEvent(null);
    setIsDialogOpen((prev) => !prev);
  };

  // // 送信処理
  // const onSubmit: SubmitHandler<Schema> = (data) => {
  //   console.log(data);
  //   if (selectedCalendarEvent) {
  //     handleUpdateCalendarEvent(data, selectedCalendarEvent.id)
  //       .then(() => {
  //         console.log('更新しました。');
  //         setSelectedCalendarEvent(null);
  //         setIsDialogOpen(false);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   } else {
  //     handleSaveCalendarEvent(data)
  //       .then(() => {
  //         console.log('保存しました。');
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   }
  //   reset({
  //     type: 'expense',
  //     date: currentDay,
  //     category: '',
  //     amount: 0,
  //     content: '',
  //   });
  // };

  // // フォームを削除
  // const handleDelete = () => {
  //   if (selectedCalendarEvent) {
  //     handleDeleteCalendarEvent(selectedCalendarEvent.id);
  //     setSelectedCalendarEvent(null);
  //     setIsDialogOpen(false);
  //   }
  // };

  const categories = [
    { label: '全員', icon: <PeopleAltIcon /> },
    { label: '一般撮影', icon: <GiKneeCap /> },
    { label: 'CT', icon: <TbDeviceComputerCamera /> },
    { label: 'MRI', icon: <IoMagnetSharp /> },
    { label: '心カテ・Angio', icon: <PiHeartbeat /> },
    { label: '透視・内視鏡', icon: <BiCameraMovie /> },
    { label: 'RI', icon: <BiSolidInjection /> },
    { label: '放射線治療', icon: <GiSinusoidalBeam /> },
    { label: '事務', icon: <BsPersonWorkspace /> },
    { label: '全体会議', icon: <RecordVoiceOverIcon /> },
    { label: '管理職', icon: <RecordVoiceOverIcon /> },
    { label: '主任', icon: <RecordVoiceOverIcon /> },
    { label: '勉強会(院内)', icon: <MdCastForEducation /> },
    { label: '勉強会(院外)', icon: <MdCastForEducation /> },
    { label: 'イベント行事', icon: <MdEmojiEvents /> },
    { label: 'その他', icon: <CiCircleMore /> },
  ];

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleCloseForm}
      fullWidth
      maxWidth={'sm'}
      // sx={{ bgcolor: 'red' }}
    >
      <DialogContent>
        {/* 入力エリアヘッダー */}
        <Box display={'flex'} justifyContent={'space-between'} mb={2}>
          <Typography variant='h6'>入力</Typography>
          {/* 閉じるボタン */}
          <IconButton
            onClick={handleCloseForm}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        {/* フォーム要素 */}
        <Box
          component={'form'}
          // onSubmit={handleSubmit(onSubmit)}
        >
          <Stack spacing={2}>
            {/* 日付 */}
            <Controller
              name='date'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='日付'
                  type='date'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                      style: { color: 'red' },
                    },
                  }}
                  error={!!errors.date}
                  helperText={errors.date?.message}
                />
              )}
            />
            {/* カテゴリ */}
            <Controller
              name='category'
              control={control}
              render={({ field }) => {
                // console.log({ ...field });
                return (
                  <FormControl
                    fullWidth
                    // error={!!errors.category}
                  >
                    <InputLabel id='category-select-label'>カテゴリ</InputLabel>
                    <Select
                      {...field}
                      labelId='category-select-label'
                      id='category-select'
                      label='カテゴリ'
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.label} value={category.label}>
                          <ListItemIcon>{category.icon}</ListItemIcon>
                          {category.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.category?.message}</FormHelperText>
                  </FormControl>
                );
              }}
            />

            {/* タイトル */}
            <Controller
              name='title'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='タイトル'
                  type='text'
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />

            {/* 備考 */}
            <Controller
              name='description'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='備考'
                  type='text'
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />

            {/* 終日、開始時間,終了時間 */}
            <Stack
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'space-around'}
            >
              {/* 終日スイッチ */}
              <Controller
                name='is_allday'
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label='終日'
                  />
                )}
              />

              {/* 開始時刻 */}
              <Controller
                name='start_at'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='開始時刻'
                    type='time'
                    disabled={isAllDay} // ← 終日が true のとき灰色（入力不可）
                    slotProps={{
                      inputLabel: { shrink: true },
                      htmlInput: { step: 600 },
                    }}
                    error={!!errors.start_at}
                    helperText={errors.start_at ? '開始時刻を入力' : ''}
                  />
                )}
              />

              {/* 終了時刻 */}
              <Controller
                name='end_at'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='終了時刻'
                    type='time'
                    disabled={isAllDay} // ← 終日が true のとき灰色（入力不可）
                    slotProps={{
                      inputLabel: { shrink: true },
                      htmlInput: { step: 600 },
                    }}
                    error={!!errors.end_at}
                    helperText={errors.end_at ? '終了時刻を入力' : ''}
                  />
                )}
              />
            </Stack>

            {/* 保存 or 更新 ボタン */}
            <Button type='submit' variant='contained' color='primary' fullWidth>
              {selectedCalendarEvent ? '更新' : '保存'}
            </Button>

            {selectedCalendarEvent && (
              // 削除ボタン
              <Button
                // onClick={handleDelete}
                variant='outlined'
                color='secondary'
                fullWidth
              >
                削除
              </Button>
            )}
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarEventForm;
