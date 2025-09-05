import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
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
import { supabase } from '../../../utils/supabaseClient';
import type { CalendarMonthlyEventsProps } from './Calendar';
import { UserAuth } from '../../context/AuthContext';
import { Avatar } from '@mui/material';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import Zoom from '@mui/material/Zoom';

interface CalendarEventFormProps {
  calendar_allEvents: CalendarEvents[];
  setCalendar_allEvents: React.Dispatch<React.SetStateAction<CalendarEvents[]>>;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCalendarEvent: CalendarMonthlyEventsProps | null;
  setSelectedCalendarEvent: React.Dispatch<
    React.SetStateAction<CalendarMonthlyEventsProps | null>
  >;
  selectDate: string;
  setSelectDate: React.Dispatch<React.SetStateAction<string>>;
}

const CalendarEventForm = ({
  calendar_allEvents,
  setCalendar_allEvents,
  isDialogOpen,
  setIsDialogOpen,
  selectedCalendarEvent,
  setSelectedCalendarEvent,
  selectDate,
  setSelectDate,
}: CalendarEventFormProps) => {
  // const [calendarEvents, setCalendarEvents] = useState<CalendarEvents[]>([]);
  // const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const { session } = UserAuth();
  // console.log(session?.user.id);

  const { isoDate } = useDateInfo();

  // react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    trigger,
    clearErrors,
  } = useForm<Schema>({
    defaultValues: {
      date: isoDate,
      title: selectDate,
      category: '',
      description: '',
      is_allday: true,
      start_at: null,
      end_at: null,
    },
    resolver: zodResolver(CalendarEventSchema),
    mode: 'onChange', // ← 入力のたびに検証
    reValidateMode: 'onChange', // ← エラー後の再検証も入力のたび
  });

  useEffect(() => {
    if (!isDialogOpen) return;
    console.log(selectedCalendarEvent?.is_allday);
    console.log(!selectedCalendarEvent?.is_allday);
    console.log(!!selectedCalendarEvent?.is_allday);

    if (selectedCalendarEvent) {
      // 編集時：選択イベントでフォームを上書き
      const ev = selectedCalendarEvent;
      const base = {
        date: ev.date,
        title: ev.title ?? '',
        category: (ev.category as Schema['category']) ?? '',
        description: ev.description ?? '',
      };
      reset(
        ev.is_allday
          ? {
              ...base,
              is_allday: true as const,
              start_at: null,
              end_at: null,
            }
          : {
              ...base,
              is_allday: false as const,
              start_at: ev.start_at ?? '',
              end_at: ev.end_at ?? '',
            }
      );
    } else {
      // 新規追加時：selectDate を反映して初期化
      reset({
        date: selectDate,
        title: '',
        category: '',
        description: '',
        is_allday: true,
        start_at: null,
        end_at: null,
      });
    }
  }, [isDialogOpen, selectDate, selectedCalendarEvent, reset]);

  const isAllDay = watch('is_allday');

  // is_allday が true になったら値をクリアしたい場合
  useEffect(() => {
    if (isAllDay) {
      setValue('start_at', null, { shouldValidate: true });
      setValue('end_at', null, { shouldValidate: true });
      clearErrors(['start_at', 'end_at']);
    }
  }, [isAllDay, setValue, clearErrors]);

  // 保存処理
  const handleSaveCalendarEvent = async (calendarEvent: Schema) => {
    try {
      console.log('calendarEvent', {
        user_id: session?.user.id,
        ...calendarEvent,
      });
      if (!session?.user.id) return;
      // Supabaseにデータを保存
      const { data, error } = await supabase
        .from('calendar_events')
        .insert({ user_id: session?.user.id, ...calendarEvent }) // 単一レコードでもオブジェクトでOK
        .select()
        .single(); // 返り値を1件に絞る

      if (error) {
        // Supabase のエラー
        console.error('Supabaseのエラーは', error);
        console.error('Supabaseのエラーメッセージは', error.message);
        console.error('Supabaseのエラー詳細は', error.details);
        console.error('Supabaseのエラーコードは', error.code);
        return;
      }

      const newCalendarEvent = {
        id: data.id, // SupabaseのテーブルでPRIMARY KEY(id)を設定している前提
        ...calendarEvent,
      } as CalendarEvents;
      console.log('Inserted calendar event: ', newCalendarEvent);

      setCalendar_allEvents((prevCalendarEvent) => [
        ...prevCalendarEvent,
        newCalendarEvent,
      ]);
    } catch (err) {
      // error
      console.error('一般的なエラーは', err);
    }
  };

  // 削除処理
  const handleDeleteCalendarEvent = async (
    selectedCalendarEventIds: string | readonly string[]
  ) => {
    try {
      if (!session?.user.id) return;

      // 呼び出し側は string 単体/配列を渡してくる想定
      const idsToDelete = Array.isArray(selectedCalendarEventIds)
        ? [...selectedCalendarEventIds]
        : [selectedCalendarEventIds];
      console.log('削除対象', idsToDelete);

      // DB 側 id 型（number）に合わせる
      const numberIds = idsToDelete.map((id) => Number(id)) as number[];

      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .in('id', numberIds);

      if (error) {
        console.error('Supabaseのエラーは', error);
        console.error('Supabaseのエラーメッセージは', error.message);
        console.error('Supabaseのエラー詳細は', error.details);
        console.error('Supabaseのエラーコードは', error.code);
        return;
      }

      // フロント（状態）からも即時反映で削除
      const filterdCalendarEvents = calendar_allEvents.filter(
        (ev) => !idsToDelete.includes(String(ev.id))
      );
      setCalendar_allEvents(filterdCalendarEvents);
    } catch (err) {
      console.error('一般的なエラーは', err);
    }
  };

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
    setIsDialogOpen(false);
    setSelectDate(isoDate);
  };

  // 送信処理
  const onSubmit: SubmitHandler<Schema> = (data) => {
    console.log(data);
    // if (selectedCalendarEvent) {
    //   handleUpdateCalendarEvent(data, selectedCalendarEvent.id)
    //     .then(() => {
    //       console.log('更新しました。');
    //       setSelectedCalendarEvent(null);
    //       setIsDialogOpen(false);
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // } else {
    handleSaveCalendarEvent(data)
      .then(() => {
        console.log('保存しました。');
        setSelectedCalendarEvent(null);
        setIsDialogOpen(false);
      })
      .catch((error) => {
        console.error(error);
      });
    // }
    reset({
      date: data.date,
      category: '',
      title: '',
      description: '',
      is_allday: true,
      start_at: null,
      end_at: null,
    });
  };

  // フォームを削除
  const handleDelete = async () => {
    if (selectedCalendarEvent) {
      await handleDeleteCalendarEvent(selectedCalendarEvent.id);
      setIsDialogOpen(false);
      setSelectedCalendarEvent(null);
      setSelectDate(isoDate);
    }
  };

  const categories = useMemo(
    () => [
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
    ],
    []
  );

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
        <Box component={'form'} onSubmit={handleSubmit(onSubmit)}>
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
                    },
                  }}
                  error={!!errors.date}
                  helperText={errors.date?.message}
                />
              )}
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

            {/* カテゴリ */}
            <Controller
              name='category'
              control={control}
              render={({ field }) => {
                // console.log({ ...field });
                return (
                  <FormControl fullWidth error={!!errors.category}>
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
                    sx={{ m: 0 }}
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
                    value={field.value ?? ''} // ← 表示は常に string
                    onChange={(e) => {
                      field.onChange(
                        e.target.value === '' ? null : e.target.value
                      ); // ← '' は null に正規化
                      void trigger('end_at'); // ← start変更で end を再検証
                    }}
                    slotProps={{
                      inputLabel: { shrink: true },
                      htmlInput: { step: 600 },
                    }}
                    error={!!errors.start_at}
                    // helperText={errors.start_at ? '開始時刻を入力' : ''}
                    helperText={errors.start_at?.message}
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
                    value={field.value ?? ''} // ← 表示は常に string
                    onChange={(e) => {
                      field.onChange(
                        e.target.value === '' ? null : e.target.value
                      ); // ← '' は null に正規化
                      void trigger('end_at'); // ← 自身も即再検証（安全策）
                    }}
                    slotProps={{
                      inputLabel: { shrink: true },
                      htmlInput: { step: 600 },
                    }}
                    error={!!errors.end_at}
                    // helperText={errors.end_at ? '終了時刻を入力' : ''}
                    helperText={errors.end_at?.message}
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
                onClick={() => setIsDeleteConfirmOpen(true)}
                variant='outlined'
                color='error'
                fullWidth
                startIcon={<DeleteForeverRoundedIcon />}
              >
                削除
              </Button>
            )}
          </Stack>
        </Box>
      </DialogContent>

      {/* カレンダーイベント削除する際の最終確認Dialog */}
      <Dialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        maxWidth='xs'
        fullWidth
        aria-labelledby='confirm-delete-title'
        slots={{ transition: Zoom }}
        slotProps={{
          paper: { sx: { borderRadius: 3, p: 1, overflow: 'hidden' } },
        }}
      >
        <DialogTitle
          id='confirm-delete-title'
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            py: 2,
            px: 2.5,
          }}
        >
          <Avatar
            sx={(t) => ({
              bgcolor: 'transparent',
              color: t.palette.error.light,
              width: 40,
              height: 40,
            })}
          >
            <DeleteForeverRoundedIcon />
          </Avatar>
          <Box>
            <Typography variant='subtitle1' fontWeight={700}>
              イベントを削除しますか？
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              この操作は取り消せません。
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 0, px: 2.5, pb: 2 }}>
          <Stack spacing={0.5}>
            <Typography variant='body2' color='text.secondary'>
              対象
            </Typography>
            <Typography variant='body1' fontWeight={600} noWrap>
              {selectedCalendarEvent?.title || '(無題)'}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {selectedCalendarEvent?.date}
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button onClick={() => setIsDeleteConfirmOpen(false)} autoFocus>
            キャンセル
          </Button>
          <Button
            onClick={async () => {
              await handleDelete();
              setIsDeleteConfirmOpen(false);
            }}
            color='error'
            variant='contained'
          >
            削除する
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default CalendarEventForm;
