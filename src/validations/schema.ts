import { z } from 'zod';
import dayjs from 'dayjs';

const baseSchema = {
  date: z.string().min(1, { message: '日付は必須です。' }),
  title: z.string().min(1, { message: 'タイトルは必須です。' }),
  category: z
    .union([
      z.enum([
        '全員',
        '一般撮影',
        'CT',
        'MRI',
        '心カテ・Angio',
        '透視・内視鏡',
        'RI',
        '放射線治療',
        '事務',
        '全体会議',
        '管理職',
        '主任',
        '勉強会(院内)',
        '勉強会(院外)',
        'イベント行事',
        'その他',
      ]),
      z.literal(''),
    ])
    .refine((val) => val !== '', { message: 'カテゴリーを選択してください。' }),
  description: z.string().min(1, { message: '内容を入力してください。' }),
};

// ⏰ is_allday が true の場合 → start_at, end_at 入力不可
const AllDayEventSchema = z.object({
  ...baseSchema,
  is_allday: z.literal(true),
  start_at: z.union([z.string(), z.null()]),
  end_at: z.union([z.string(), z.null()]),
});

// ⏰ is_allday が false の場合 → start_at, end_at 必須 & 時刻比較
const TimedEventSchema = z
  .object({
    ...baseSchema,
    is_allday: z.literal(false),
    start_at: z.string().min(1, { message: '開始時刻は必須です。' }), // "HH:mm"
    end_at: z.string().min(1, { message: '終了時刻は必須です。' }), // "HH:mm"
  })
  .refine(
    ({ start_at, end_at }) => {
      const start = dayjs(start_at, 'HH:mm');
      const end = dayjs(end_at, 'HH:mm');
      return end.isAfter(start);
    },
    {
      message: '開始時刻より後にしてください',
      path: ['end_at'],
    }
  );

export const CalendarEventSchema = z.discriminatedUnion('is_allday', [
  AllDayEventSchema,
  TimedEventSchema,
]);

export type Schema = z.infer<typeof CalendarEventSchema>;
