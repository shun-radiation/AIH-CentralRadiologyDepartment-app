import {
  useEffect,
  useMemo,
  // useRef,
  useState,
} from 'react';
import { extractYMD } from '../../utils/date';
import { DateContext, type DateContextValue } from './useDateInfo';

type Mode = 'static' | 'tick';

// ========================================

type DateProviderProps = {
  children: React.ReactNode;
  /** 'static' = 固定今日, 'tick' = 日付が変わったら自動更新（最小負荷） */
  mode?: Mode;
  /** 自動更新チェック間隔(ms)。日付変化検知用。既定: 60秒 */
  tickMs?: number;
  /** 既定: 'Asia/Tokyo' */
  timeZone?: string;
  /** 初期の“今日”を任意指定（テスト用） */
  initialDate?: Date | string;
};

export const DateContextProvider = ({
  children,
  mode = 'static',
  tickMs = 60_000,
  timeZone = 'Asia/Tokyo',
  initialDate,
}: DateProviderProps) => {
  // “現在時刻（UTCベース）”を保持。画面表示ではなく、日付算出の元。
  const [now, setNow] = useState<Date>(() =>
    initialDate ? new Date(initialDate) : new Date()
  );

  // // 手動上書き用（ある場合は常にそれを基準に“今日”を定義）
  // const overrideRef = useRef<Date | null>(
  //   initialDate ? new Date(initialDate) : null
  // );

  // y/m/d を算出（overrideがあればそれを、無ければnowを使う）
  const {
    y: currentYear,
    m: currentMonth,
    d: currentDate,
    isoDate,
  } = useMemo(() => {
    const base =
      // overrideRef.current ??
      now;
    return extractYMD(base, timeZone);
  }, [now, timeZone]);

  // 'tick' モードでは、日付が変わったタイミングでだけ更新する
  useEffect(() => {
    if (mode !== 'tick') return;

    const timer = setInterval(() => {
      // // override中は自動更新不要（固定プレビューを尊重）
      // if (overrideRef.current) return;

      const next = new Date();
      // 現在のy/m/dと、次のy/m/dを比較して変化がある時だけ状態更新
      const cur = extractYMD(now, timeZone);
      const nxt = extractYMD(next, timeZone);
      if (cur.isoDate !== nxt.isoDate) {
        setNow(next);
      }
      // 変化がなくても1分毎に setNow しないことで無駄な再レンダリングを抑制
    }, tickMs);

    return () => clearInterval(timer);
  }, [mode, tickMs, now, timeZone]);

  // const setBaseDate = (input: Date | string) => {
  //   overrideRef.current = new Date(input);
  //   // 即座に反映させる
  //   setNow(new Date(input));
  // };

  // const clearBaseDate = () => {
  //   overrideRef.current = null;
  //   setNow(new Date());
  // };

  const value = useMemo<DateContextValue>(
    () => ({
      timeZone,
      currentYear,
      currentMonth,
      currentDate,
      isoDate,
      now,
      // setBaseDate,
      // clearBaseDate,
    }),
    [timeZone, currentYear, currentMonth, currentDate, isoDate, now]
  );

  return <DateContext.Provider value={value}>{children}</DateContext.Provider>;
};
