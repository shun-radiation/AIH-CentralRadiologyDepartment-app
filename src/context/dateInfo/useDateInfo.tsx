import { createContext, useContext } from 'react';

export type DateContextValue = {
  /** タイムゾーン（IANA）例: 'Asia/Tokyo' */
  timeZone: string;
  /** 今日の年・月・日（timeZone基準） */
  currentYear: number;
  currentMonth: number;
  currentDate: number;
  /** ISO拡張 'YYYY-MM-DD'（timeZone基準） */
  isoDate: string;
  /** 実時間（UTCのnow）。表示ではなく内部参照用 */
  now: Date;

  // /** “今日”の基準日を手動で上書き（テスト/プレビュー用） */
  // setBaseDate: (input: Date | string) => void;
  // /** 手動上書きをクリアして通常運用に戻す */
  // clearBaseDate: () => void;
};

export const DateContext = createContext<DateContextValue | null>(null);

export const useDateInfo = (): DateContextValue => {
  const ctx = useContext(DateContext);
  if (!ctx) {
    throw new Error('useDateInfo must be used within <DateContextProvider>');
  }
  return ctx;
};
