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
import EditRoundedIcon from '@mui/icons-material/EditRounded';
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
  const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<Schema | null>(null);

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
    selectedEvIds: string | readonly string[]
  ) => {
    try {
      if (!session?.user.id) return;

      // 呼び出し側は string 単体/配列を渡してくる想定
      const idsToDelete = Array.isArray(selectedEvIds)
        ? [...selectedEvIds]
        : [selectedEvIds];
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

  // 変更処理
  const handleUpdateCalendarEvent = async (
    selectedEvData: Schema,
    selectedEvId: string
  ) => {
    try {
      if (!session?.user.id) return;

      // DBに入れる前に型をキレイに：終日のときは null、時間アリのとき '' は null に
      const updatedCalendarEvData = {
        date: selectedEvData.date,
        title: selectedEvData.title,
        category: selectedEvData.category,
        description: selectedEvData.description,
        is_allday: selectedEvData.is_allday,
        start_at: selectedEvData.is_allday
          ? null
          : selectedEvData.start_at || null,
        end_at: selectedEvData.is_allday ? null : selectedEvData.end_at || null,
      };

      const { data, error } = await supabase
        .from('calendar_events')
        .update(updatedCalendarEvData)
        .eq('id', Number(selectedEvId))
        // .eq('user_id', session.user.id) // RLS 対策（自分のレコード限定）
        .select()
        .single();

      if (error) {
        console.error('Supabaseのエラーは', error);
        console.error('Supabaseのエラーメッセージは', error.message);
        console.error('Supabaseのエラー詳細は', error.details);
        console.error('Supabaseのエラーコードは', error.code);
        return;
      }

      // ローカル状態を即反映
      setCalendar_allEvents((prev) =>
        prev.map((ev) =>
          ev.id === Number(selectedEvId) ? (data as CalendarEvents) : ev
        )
      );
    } catch (err) {
      console.error('一般的なエラーは', err);
    }
  };

  // フォームclose処理
  const handleCloseForm = () => {
    setSelectedCalendarEvent(null);
    setIsDialogOpen(false);
    setSelectDate(isoDate);
  };

  // 送信処理
  const onSubmit: SubmitHandler<Schema> = (data) => {
    console.log(data);
    if (selectedCalendarEvent) {
      // 既存更新
      setPendingUpdate(data);
      setIsUpdateConfirmOpen(true);
      return; // 一時保存して、更新最終確認dialogへ
    } else {
      // 新規保存
      handleSaveCalendarEvent(data)
        .then(() => {
          console.log('保存しました。');
          setSelectedCalendarEvent(null);
          setIsDialogOpen(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
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

  // 変更点を見やすくするための差分生成
  const updateDiff = useMemo(() => {
    if (!pendingUpdate || !selectedCalendarEvent) return [];
    const before = {
      date: selectedCalendarEvent.date ?? '',
      title: selectedCalendarEvent.title ?? '',
      category: selectedCalendarEvent.category ?? '',
      description: selectedCalendarEvent.description ?? '',
      is_allday: !!selectedCalendarEvent.is_allday,
      start_at: selectedCalendarEvent.is_allday
        ? null
        : selectedCalendarEvent.start_at ?? null,
      end_at: selectedCalendarEvent.is_allday
        ? null
        : selectedCalendarEvent.end_at ?? null,
    };
    const after = {
      date: pendingUpdate.date,
      title: pendingUpdate.title,
      category: pendingUpdate.category,
      description: pendingUpdate.description,
      is_allday: pendingUpdate.is_allday,
      start_at: pendingUpdate.is_allday ? null : pendingUpdate.start_at ?? null,
      end_at: pendingUpdate.is_allday ? null : pendingUpdate.end_at ?? null,
    };

    const labels: Record<keyof typeof after, string> = {
      date: '日付',
      title: 'タイトル',
      category: 'カテゴリ',
      description: '備考',
      is_allday: '終日',
      start_at: '開始時刻',
      end_at: '終了時刻',
    };

    const fmt = (
      keyName: keyof typeof after,
      value: string | boolean | null
    ) => {
      if (keyName === 'is_allday') return value ? 'あり' : 'なし';
      if (value === null || value === '') return '—';
      return String(value);
    };

    return (Object.keys(after) as (keyof typeof after)[])
      .filter(
        (keyName) =>
          fmt(keyName, before[keyName]) !== fmt(keyName, after[keyName])
      )
      .map((keyName) => ({
        key: keyName,
        label: labels[keyName],
        before: fmt(keyName, before[keyName]),
        after: fmt(keyName, after[keyName]),
      }));
  }, [pendingUpdate, selectedCalendarEvent]);

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
            <Button
              type='submit'
              variant='contained'
              color='primary'
              fullWidth
              startIcon={<EditRoundedIcon />}
            >
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

      {/* カレンダーイベント更新する際の最終確認Dialog */}
      <Dialog
        open={isUpdateConfirmOpen}
        onClose={() => setIsUpdateConfirmOpen(false)}
        maxWidth='xs'
        fullWidth
        aria-labelledby='confirm-update-title'
        slots={{ transition: Zoom }}
        slotProps={{
          paper: { sx: { borderRadius: 3, p: 1, overflow: 'hidden' } },
        }}
      >
        <DialogTitle
          id='confirm-update-title'
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
              color: t.palette.primary.main,
              width: 40,
              height: 40,
            })}
          >
            <EditRoundedIcon />
          </Avatar>
          <Box>
            <Typography variant='subtitle1' fontWeight={700}>
              イベントを更新しますか？
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              変更点を確認してください。
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 0, px: 2.5, pb: 2 }}>
          {/* 対象タイトル/日付 */}
          <Stack spacing={0.5} mb={1.5}>
            <Typography variant='body2' color='text.secondary'>
              対象
            </Typography>
            <Typography variant='body1' fontWeight={600} noWrap>
              {pendingUpdate?.title || selectedCalendarEvent?.title || '(無題)'}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {pendingUpdate?.date || selectedCalendarEvent?.date}
            </Typography>
          </Stack>

          {/* 変更点リスト */}
          {updateDiff.length > 0 ? (
            <Stack spacing={0.75}>
              {updateDiff.map((row) => (
                <Box
                  key={String(row.key)}
                  sx={(t) => ({
                    display: 'grid',
                    gridTemplateColumns: '88px 1fr',
                    gap: 1,
                    alignItems: 'start',
                    p: 1,
                    borderRadius: 2,
                    bgcolor: t.palette.action.hover,
                  })}
                >
                  <Typography variant='caption' color='text.secondary'>
                    {row.label}
                  </Typography>
                  <Box>
                    <Typography
                      variant='body2'
                      sx={{ textDecoration: 'line-through', opacity: 0.6 }}
                    >
                      {row.before}
                    </Typography>
                    <Typography variant='body2' fontWeight={600}>
                      {row.after}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography variant='body2' color='text.secondary'>
              変更点はありません（そのまま更新できます）。
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button onClick={() => setIsUpdateConfirmOpen(false)} autoFocus>
            戻る
          </Button>
          <Button
            // handleUpdateCalendarEvent(data, selectedCalendarEvent.id)
            //   .then(() => {
            //     console.log('更新しました。');
            //     setSelectedCalendarEvent(null);
            //     setIsDialogOpen(false);
            //   })
            //   .catch((error) => {
            //     console.error(error);
            //   });

            onClick={async () => {
              if (!pendingUpdate || !selectedCalendarEvent) return;
              await handleUpdateCalendarEvent(
                pendingUpdate,
                selectedCalendarEvent.id
              );
              setIsUpdateConfirmOpen(false);
              console.log('更新しました。');

              // 親ダイアログを閉じ、フォームを初期化
              setIsDialogOpen(false);
              setSelectedCalendarEvent(null);
              // reset({
              //   date: isoDate,
              //   category: '',
              //   title: '',
              //   description: '',
              //   is_allday: true,
              //   start_at: null,
              //   end_at: null,
              // });
            }}
            variant='contained'
          >
            更新する
          </Button>
        </DialogActions>
      </Dialog>

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
