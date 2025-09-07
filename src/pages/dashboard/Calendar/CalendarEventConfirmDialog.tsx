import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  Zoom,
  type AlertColor,
} from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import type { Schema } from '../../../validations/schema';
import type { CalendarMonthlyEventsProps } from './Calendar';
import { useRef, useState } from 'react';

interface CalendarEventConfirmDialogProps {
  isCreateConfirmOpen: boolean;
  isDeleteConfirmOpen: boolean;
  isUpdateConfirmOpen: boolean;
  setIsCreateConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUpdateConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pendingCreate: Schema | null;
  pendingUpdate: Schema | null;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCalendarEvent: CalendarMonthlyEventsProps | null;
  setSelectedCalendarEvent: React.Dispatch<
    React.SetStateAction<CalendarMonthlyEventsProps | null>
  >;
  handleSaveCalendarEvent: (calendarEvent: Schema) => Promise<void>;
  handleUpdateCalendarEvent: (
    selectedEvData: Schema,
    selectedEvId: string
  ) => Promise<void>;
  handleDelete: () => Promise<void>;
  updateDiff: {
    key:
      | 'is_allday'
      | 'date'
      | 'start_at'
      | 'end_at'
      | 'title'
      | 'category'
      | 'description';
    label: string;
    before: string;
    after: string;
  }[];
  setCalendarSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCalendarSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;
  setCalendarSnackbarSeverity: React.Dispatch<React.SetStateAction<AlertColor>>;
}

const CalendarEventConfirmDialog = ({
  isCreateConfirmOpen,
  isDeleteConfirmOpen,
  isUpdateConfirmOpen,
  setIsCreateConfirmOpen,
  setIsDeleteConfirmOpen,
  setIsUpdateConfirmOpen,
  pendingCreate,
  pendingUpdate,
  setIsDialogOpen,
  selectedCalendarEvent,
  setSelectedCalendarEvent,
  handleSaveCalendarEvent,
  handleUpdateCalendarEvent,
  handleDelete,
  updateDiff,
  setCalendarSnackbarOpen,
  setCalendarSnackbarMessage,
  setCalendarSnackbarSeverity,
}: CalendarEventConfirmDialogProps) => {
  const createConfirmBtnRef = useRef<HTMLButtonElement | null>(null);
  const updateConfirmBtnRef = useRef<HTMLButtonElement | null>(null);
  // const deleteConfirmBtnRef = useRef<HTMLButtonElement | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      {/* カレンダーイベント新規保存の最終確認Dialog */}
      <Dialog
        open={isCreateConfirmOpen}
        onClose={() => setIsCreateConfirmOpen(false)}
        maxWidth='xs'
        fullWidth
        aria-labelledby='confirm-create-title'
        slots={{ transition: Zoom }}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: async (e: React.FormEvent<HTMLFormElement>) => {
              setIsSubmitting(true);
              e.preventDefault();
              if (!pendingCreate) return;
              try {
                await handleSaveCalendarEvent(pendingCreate);
                setIsCreateConfirmOpen(false);
                setIsDialogOpen(false);
                setSelectedCalendarEvent(null);
                setCalendarSnackbarMessage('保存に成功しました！');
                setCalendarSnackbarSeverity('success');
              } catch (error) {
                console.error(error);
                setCalendarSnackbarMessage(`保存に失敗しました... ${error}`);
                setCalendarSnackbarSeverity('error');
              } finally {
                setIsSubmitting(false);
                setCalendarSnackbarOpen(true);
              }
            },
            sx: { borderRadius: 3, p: 1, overflow: 'hidden' },
          },
          transition: {
            onEntered: () => createConfirmBtnRef.current?.focus(),
          },
        }}
      >
        <DialogTitle
          id='confirm-create-title'
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
            <SaveRoundedIcon />
          </Avatar>
          <Box>
            <Typography variant='subtitle1' fontWeight={700}>
              イベントを保存しますか？
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              内容を確認してください。
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
              {pendingCreate?.title || '(無題)'}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {pendingCreate?.date}
            </Typography>
          </Stack>

          {/* 入力内容のサマリ（更新の見た目に寄せた2列レイアウト） */}
          {pendingCreate && (
            <Stack spacing={0.75}>
              {[
                ['日付', pendingCreate.date],
                ['タイトル', pendingCreate.title || '—'],
                ['カテゴリ', pendingCreate.category || '—'],
                ['備考', pendingCreate.description || '—'],
                ['終日', pendingCreate.is_allday ? 'あり' : 'なし'],
                [
                  '開始時刻',
                  pendingCreate.is_allday ? '—' : pendingCreate.start_at || '—',
                ],
                [
                  '終了時刻',
                  pendingCreate.is_allday ? '—' : pendingCreate.end_at || '—',
                ],
              ].map(([label, value]) => (
                <Box
                  key={String(label)}
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
                    {label}
                  </Typography>
                  <Typography variant='body2' fontWeight={600}>
                    {value as string}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button onClick={() => setIsCreateConfirmOpen(false)}>戻る</Button>
          <Button
            type='submit'
            disabled={isSubmitting}
            variant='contained'
            autoFocus
            ref={createConfirmBtnRef}
          >
            保存する
          </Button>
        </DialogActions>
      </Dialog>

      {/* カレンダーイベント更新する際の最終確認Dialog */}
      <Dialog
        open={isUpdateConfirmOpen}
        onClose={() => setIsUpdateConfirmOpen(false)}
        maxWidth='xs'
        fullWidth
        aria-labelledby='confirm-update-title'
        slots={{ transition: Zoom }}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: async (e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              if (!pendingUpdate || !selectedCalendarEvent) return;
              try {
                await handleUpdateCalendarEvent(
                  pendingUpdate,
                  selectedCalendarEvent.id
                );
                setIsUpdateConfirmOpen(false);
                // 親ダイアログを閉じ、選択を解除
                setIsDialogOpen(false);
                setSelectedCalendarEvent(null);
                console.log('更新しました。');
                setCalendarSnackbarMessage('更新に成功しました！');
                setCalendarSnackbarSeverity('success');
              } catch (error) {
                console.error(error);
                setCalendarSnackbarMessage(`更新に失敗しました... ${error}`);
                setCalendarSnackbarSeverity('error');
              } finally {
                setCalendarSnackbarOpen(true);
              }
            },
            sx: { borderRadius: 3, p: 1, overflow: 'hidden' },
          },
          // ★ 表示完了で主ボタンにフォーカス
          transition: { onEntered: () => updateConfirmBtnRef.current?.focus() },
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
            type='submit'
            variant='contained'
            autoFocus
            ref={updateConfirmBtnRef}
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
          paper: {
            sx: { borderRadius: 3, p: 1, overflow: 'hidden' },
          },
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
          <Button onClick={() => setIsDeleteConfirmOpen(false)} type='button'>
            キャンセル
          </Button>
          <Button
            onClick={async () => {
              await handleDelete()
                .then(() => {
                  setIsDeleteConfirmOpen(false);
                  setCalendarSnackbarMessage('削除に成功しました！');
                  setCalendarSnackbarSeverity('success');
                })
                .catch((error) => {
                  console.error(error);
                  setCalendarSnackbarMessage(`削除に失敗しました... ${error}`);
                  setCalendarSnackbarSeverity('error');
                })
                .finally(() => {
                  setCalendarSnackbarOpen(true);
                });
            }}
            color='error'
            variant='contained'
          >
            削除する
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CalendarEventConfirmDialog;
