import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import { useDateInfo } from '../../context/dateInfo/useDateInfo';
import { Paper, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import type { CalendarEvents } from '../../../types/databaseTypes';
import interactionPlugin, {
  type DateClickArg,
} from '@fullcalendar/interaction';
import type { EventApi, ViewApi } from '@fullcalendar/core/index.js';
import tippy, { type Instance } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import '../../styles/calendar.css';
import * as JapaneseHolidays from 'japanese-holidays';
import { UserAuth } from '../../context/AuthContext';

// import { useTheme } from '@mui/material';

// =================================================

export type CalendarMonthlyEventsProps = {
  id: string;
  user_id: string;
  date: string;
  category: string;
  title: string;
  description: string | null;
  start_at: string | null;
  end_at: string | null;
  is_allday: boolean;
  created_at: string;
  updated_at: string;
};

interface CalendarProps {
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

const Calendar = ({
  calendar_allEvents,
  setCalendar_allEvents,
  setIsDialogOpen,
  setSelectedCalendarEvent,
  selectDate,
  setSelectDate,
}: // isDialogOpen,
// selectedCalendarEvent,
CalendarProps) => {
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

  const { session } = UserAuth();

  // console.log('timeZone', timeZone);
  // console.log('currentYear', currentYear);
  // console.log('currentMonth', currentMonth);
  // console.log('currentDate', currentDate);
  // console.log('isoDate', isoDate);
  // console.log('now', now);

  const [selectYearMonth, setSelectYearMonth] = useState<string>(
    isoDate.substring(0, 7) // 2025-08-01 ➡︎ 2025-08へ変換
  );

  //   const theme = useTheme();

  // useEffect(() => {
  //   getCalendarEvents();
  // }, []);

  // const getCalendarEvents = async () => {
  //   const { data, error } = await supabase.from('calendar_events').select();
  //   if (data) {
  //     setCalendar_allEvents(data);
  //   } else {
  //     console.error(error);
  //   }
  // };

  useEffect(() => {
    const getCalendarEvents = async () => {
      const { data, error } = await supabase.from('calendar_events').select();
      if (data) {
        setCalendar_allEvents(data);
      } else {
        console.error(error);
      }
    };
    getCalendarEvents();
  }, [setCalendar_allEvents]);

  // ひと月分のデータを取得
  const calendar_monthlyEvents: CalendarMonthlyEventsProps[] = useMemo(() => {
    const filterdEvents = calendar_allEvents.filter((calendar_event) =>
      calendar_event.date.startsWith(selectYearMonth)
    );
    return filterdEvents.map((event) => ({
      id: String(event.id), // idをstringにしないとfullcalendarでエラーとなる
      title: event.title,
      date: event.date,
      user_id: event.user_id,
      category: event.category,
      description: event.description,
      start_at: event.start_at,
      end_at: event.end_at,
      is_allday: event.is_allday,
      created_at: event.created_at,
      updated_at: event.updated_at,
    }));
  }, [calendar_allEvents, selectYearMonth]);

  const backgroundEvent = {
    start: isoDate,
    display: 'background',
    // backgroundColor: theme.palette.incomeColor.light,
    backgroundColor: '#a6f5acb5',
  };

  // 祝日（背景イベント）を当月分だけ生成
  const holidayBgEvents = useMemo(() => {
    const y = Number(selectYearMonth.slice(0, 4));
    const m = Number(selectYearMonth.slice(5, 7));

    // その年の祝日一覧（振替・国民の休日を含む）
    const japaneseHolidaysList =
      JapaneseHolidays.getHolidaysOf(y, /*furikae*/ true) || [];
    // const japaneseHolidaysList = //一例(2025年度の場合)
    //   { month: 1, date: 1, name: '元日' },
    //   { month: 1, date: 13, name: '成人の日' },
    //   { month: 2, date: 11, name: '建国記念の日' },
    //   { month: 2, date: 23, name: '天皇誕生日' },
    //   { month: 2, date: 24, name: '振替休日' },
    //   { month: 3, date: 20, name: '春分の日' },
    //   { month: 4, date: 29, name: '昭和の日' },
    //   { month: 5, date: 3, name: '憲法記念日' },
    //   { month: 5, date: 4, name: 'みどりの日' },
    //   { month: 5, date: 5, name: 'こどもの日' },
    //   { month: 5, date: 6, name: '振替休日' },
    //   { month: 7, date: 21, name: '海の日' },
    //   { month: 8, date: 11, name: '山の日' },
    //   { month: 9, date: 15, name: '敬老の日' },
    //   { month: 9, date: 23, name: '秋分の日' },
    //   { month: 10, date: 13, name: 'スポーツの日' },
    //   { month: 11, date: 3, name: '文化の日' },
    //   { month: 11, date: 23, name: '勤労感謝の日' },
    //   { month: 11, date: 24, name: '振替休日' },
    // ];

    const aihHolidaysList = [
      // {month:,date:,name:}
      { month: 1, date: 2, name: '正月?(aih)' },
      { month: 1, date: 3, name: '正月?(aih)' },
      { month: 12, date: 30, name: '年末?(aih)' },
      { month: 12, date: 31, name: '年末?(aih)' },
    ];

    const list = [...japaneseHolidaysList, ...aihHolidaysList];

    return list
      .filter((h) => h.month === m)
      .map((h) => {
        const day = String(h.date).padStart(2, '0');
        return {
          title: h.name,
          start: `${selectYearMonth}-${day}`, // YYYY-MM-DD
          allDay: true,
          display: 'background', // ← 背景塗り
          backgroundColor: 'transparent',
          extendedProps: { isHoliday: true },
          className: 'is-holiday',
        };
      });
  }, [selectYearMonth]);

  console.log('selectYearMonth', selectYearMonth);
  console.log('calendar_allEvents', calendar_allEvents);
  console.log('calendar_monthlyEvents', calendar_monthlyEvents);
  console.log('選択年月のイベントとbackground', [
    ...calendar_monthlyEvents,
    backgroundEvent,
    ...holidayBgEvents,
  ]);

  // 日付を選択した時の処理;
  const handleDateClick = (dateInfo: DateClickArg) => {
    // console.log(dateInfo);
    setSelectDate(dateInfo.dateStr);
    // setIsMobileDrawerOpen(true);
  };
  console.log('selectDate', selectDate);

  const handleAddCalendarEvent = () => {
    // alert(selectDate);
    setIsDialogOpen(true);
    if (!session?.user.id) return;
    console.log(selectDate);

    setSelectedCalendarEvent(null);
  };

  // イベントコンテント;
  // const renderEventContent = (eventInfo: EventContentArg) => {
  //   console.log('eventInfo', eventInfo);
  //   console.log(eventInfo.event._def.title);
  //   return (
  //     <div>
  //       <div>{eventInfo.event._def.title}</div>
  //     </div>
  //   );
  // };

  type EventHoverInfo = {
    event: EventApi;
    el: HTMLElement;
    jsEvent: MouseEvent;
    view: ViewApi;
  };

  const hoverTips = new WeakMap<HTMLElement, Instance>();

  const escapeHtml = (s: string) =>
    s.replace(
      /[&<>"']/g,
      (c) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        }[c] as string)
    );

  // const formatRange = (event: EventApi) => {
  //   if (event.allDay) return '終日';
  //   const fmt = new Intl.DateTimeFormat('ja-JP', {
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     hour12: false,
  //     timeZone: 'Asia/Tokyo',
  //   });
  //   const s = event.start ? fmt.format(event.start) : '';
  //   const e = event.end ? fmt.format(event.end) : '';
  //   return e ? `${s} – ${e}` : s;
  // };

  // イベントコンテントをホバーした時
  const handleEventHover = (info: EventHoverInfo) => {
    console.log(info);
    const { event, el } = info;

    if (!event.title) return;

    const title = event.title;
    // const time = '終日'; // formatRange(event);
    const { description } = event.extendedProps as {
      description?: string;
    };

    const html = `
    <div style="font-size:12px; line-height:1.5;">
      <div style="font-weight:600; margin-bottom:2px;">${escapeHtml(
        title
      )}</div>
      ${
        description
          ? `<div style="margin-top:4px;">${escapeHtml(description)}</div>`
          : ''
      }
    </div>
  `;
    // 既にインスタンスがあれば内容更新して表示
    const existing = hoverTips.get(el);
    if (existing) {
      existing.setContent(html);
      existing.show();
      return;
    }

    const tip = tippy(el, {
      content: html,
      allowHTML: true,
      interactive: true,
      placement: 'left',
      theme: 'light-border',
      appendTo: document.body,
      delay: [100, 0],
      offset: [0, 10],
      maxWidth: 320,
      onHidden(instance) {
        instance.destroy(); // 完全破棄してリーク防止
        hoverTips.delete(el);
      },
    });

    hoverTips.set(el, tip); // 紐づけておく
    tip.show();
  };

  return (
    <>
      <Typography>{`selectYearMonth////${selectYearMonth}`}</Typography>
      {/* <Typography>{`calendar_allEvents////${calendar_allEvents.map(
        (a) => a.title
      )}`}</Typography>
      <Typography>{`calendar_monthlyEvents////${calendar_monthlyEvents.map(
        (a) => a.title
      )}`}</Typography>
      <Typography>{`選択年月のイベントとbackground////${[
        ...calendar_monthlyEvents,
        backgroundEvent,
        ...holidayBgEvents,
      ]}`}</Typography> */}
      <Paper
        sx={{
          p: 3,
          bgcolor: 'pink',
        }}
      >
        {/* <h1>Demo App</h1> */}
        <FullCalendar
          locale={jaLocale}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView='dayGridMonth'
          events={[
            ...calendar_monthlyEvents,
            backgroundEvent,
            ...holidayBgEvents,
          ]}
          selectable={true}
          // editable={true}
          // eventContent={renderEventContent}
          dateClick={handleDateClick}
          eventMouseEnter={handleEventHover}
          datesSet={({ view }) => {
            const d = view.currentStart; // ← 常に当月1日
            const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
              2,
              '0'
            )}`;
            setSelectYearMonth(ym);
          }}
          height={'auto'}
          // height={'800px'}
          dayCellClassNames={(arg) => {
            const name = JapaneseHolidays.isHolidayAt(arg.date); // 日本時間ベースで判定 // arg.date はその日の 00:00 の Date
            return name ? ['is-holiday'] : [];
          }}
          headerToolbar={{
            // start: 'title', // leftと書いてもよい
            // center: 'myCustomButton', // 下で定義したカスタムボタンを設定する
            // end: 'today prev,next',
            end: 'today prev,next myCustomButton',
          }}
          customButtons={{
            myCustomButton: {
              text: '✚ イベントを追加',
              click: () => {
                handleAddCalendarEvent();
              },
            },
          }}
        />
      </Paper>
    </>
  );
};

export default Calendar;

// ==============================
