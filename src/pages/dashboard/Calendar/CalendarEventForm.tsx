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
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CalendarEvents } from '../../../../types/databaseTypes';
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
import { CalendarEventSchema, type Schema } from '../../../validations/schema';
import { useDateInfo } from '../../../context/dateInfo/useDateInfo';
import { supabase } from '../../../../utils/supabaseClient';
import type { CalendarMonthlyEventsProps } from './Calendar';
import { UserAuth } from '../../../context/AuthContext';
import Zoom from '@mui/material/Zoom';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CalendarEventConfirmDialog from './CalendarEventConfirmDialog';
import { TimeField } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

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
  const [isCreateConfirmOpen, setIsCreateConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false);
  const [pendingCreate, setPendingCreate] = useState<Schema | null>(null);
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
      // 既存更新の最終確認
      setPendingUpdate(data);
      setIsUpdateConfirmOpen(true);
      return; // 一時保存して、既存更新最終確認dialogへ
    } else {
      // 新規保存の最終確認
      setPendingCreate(data);
      setIsCreateConfirmOpen(true);
      return; // 一時保存して、新規保存最終確認dialogへ
    }
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
      slots={{ transition: Zoom }}
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
                  multiline
                  rows={6}
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
                  <TimeField
                    label='開始時刻'
                    format='HH:mm'
                    ampm={false}
                    // minutesStep={1} // ← 矢印キーで±1分（制限なし）
                    disabled={isAllDay}
                    value={field.value ? dayjs(field.value, 'HH:mm') : null}
                    onChange={(v) => {
                      field.onChange(v ? v.format('HH:mm') : null);
                      void trigger('end_at');
                    }}
                    slotProps={{
                      textField: {
                        error: !!errors.start_at,
                        helperText: errors.start_at?.message,
                        sx: { minWidth: 120 },
                        inputProps: { 'aria-label': '開始時刻 (HH:MM)' },
                      },
                    }}
                  />
                )}
              />

              {/* 終了時刻 */}
              <Controller
                name='end_at'
                control={control}
                render={({ field }) => (
                  <TimeField
                    label='終了時刻'
                    format='HH:mm'
                    ampm={false}
                    // minutesStep={1}
                    disabled={isAllDay}
                    value={field.value ? dayjs(field.value, 'HH:mm') : null}
                    onChange={(v) =>
                      field.onChange(v ? v.format('HH:mm') : null)
                    }
                    slotProps={{
                      textField: {
                        error: !!errors.end_at,
                        helperText: errors.end_at?.message,
                        sx: { minWidth: 120 },
                        inputProps: { 'aria-label': '終了時刻 (HH:MM)' },
                      },
                    }}
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
              startIcon={
                selectedCalendarEvent ? (
                  <EditRoundedIcon />
                ) : (
                  <SaveRoundedIcon />
                )
              }
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

      {/* 新規保存・既存更新・既存削除の際の最終確認フォーム */}
      <CalendarEventConfirmDialog
        isCreateConfirmOpen={isCreateConfirmOpen}
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        isUpdateConfirmOpen={isUpdateConfirmOpen}
        setIsCreateConfirmOpen={setIsCreateConfirmOpen}
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
        setIsUpdateConfirmOpen={setIsUpdateConfirmOpen}
        pendingCreate={pendingCreate}
        pendingUpdate={pendingUpdate}
        setIsDialogOpen={setIsDialogOpen}
        selectedCalendarEvent={selectedCalendarEvent}
        setSelectedCalendarEvent={setSelectedCalendarEvent}
        handleSaveCalendarEvent={handleSaveCalendarEvent}
        handleUpdateCalendarEvent={handleUpdateCalendarEvent}
        handleDelete={handleDelete}
        updateDiff={updateDiff}
      />
    </Dialog>
  );
};

export default CalendarEventForm;
