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

// import type { EventContentArg } from '@fullcalendar/core/index.js';
import '../../styles/calendar.css';
// import { useTheme } from '@mui/material';
// import { isSameMonth } from 'date-fns';

// =================================================

// interface ClendarProps {}
const Calendar = () =>
  // {}: ClendarProps
  {
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

    // console.log('timeZone', timeZone);
    // console.log('currentYear', currentYear);
    // console.log('currentMonth', currentMonth);
    // console.log('currentDate', currentDate);
    // console.log('isoDate', isoDate);
    // console.log('now', now);

    type CalendarMonthlyEventsProps = {
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

    const [calendar_allEvents, setCalendar_allEvents] = useState<
      CalendarEvents[]
    >([]);
    const [selectYearMonth, setSelectYearMonth] = useState<string>(
      isoDate.substring(0, 7) // 2025-08-01 ➡︎ 2025-08へ変換
    );
    const [selectDate, setSelectDate] = useState<string>(isoDate);

    //   const theme = useTheme();

    useEffect(() => {
      getCalendarEvents();
    }, []);

    const getCalendarEvents = async () => {
      const { data, error } = await supabase.from('calendar_events').select();
      if (data) {
        setCalendar_allEvents(data);
      } else {
        console.error(error);
      }
    };

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
      backgroundColor: 'green',
    };

    console.log('selectYearMonth', selectYearMonth);
    console.log('calendar_allEvents', calendar_allEvents);
    console.log('calendar_monthlyEvents', calendar_monthlyEvents);
    console.log('選択年月のイベントとbackground', [
      ...calendar_monthlyEvents,
      backgroundEvent,
    ]);

    // 日付を選択した時の処理
    const handleDateClick = (dateInfo: DateClickArg) => {
      // console.log(dateInfo);
      setSelectDate(dateInfo.dateStr);
      // setIsMobileDrawerOpen(true);
    };
    console.log('selectDate', selectDate);

    // // イベントコンテント
    // const renderEventContent = (eventInfo: EventContentArg) => {
    //   console.log(eventInfo);
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
        <Typography>{`calendar_allEvents////${calendar_allEvents.map(
          (a) => a.title
        )}`}</Typography>
        <Typography>{`calendar_monthlyEvents////${calendar_monthlyEvents.map(
          (a) => a.title
        )}`}</Typography>
        <Typography>{`選択年月のイベントとbackground////${[
          ...calendar_monthlyEvents,
          backgroundEvent,
        ]}`}</Typography>
        <Paper
          sx={{
            p: 3,
            bgcolor: 'pink',
            '& .fc': { fontSize: '14px' },
            '& .fc-toolbar-title': { fontSize: '30px', fontWeight: 'bold' },
          }}
        >
          {/* <h1>Demo App</h1> */}
          <FullCalendar
            locale={jaLocale}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView='dayGridMonth'
            events={[...calendar_monthlyEvents, backgroundEvent]}
            // eventContent={renderEventContent}
            dateClick={handleDateClick}
            eventMouseEnter={handleEventHover}
            datesSet={({ view }) => {
              const d = view.currentStart; // ← 常に当月1日
              const ym = `${d.getFullYear()}-${String(
                d.getMonth() + 1
              ).padStart(2, '0')}`;
              setSelectYearMonth(ym);
            }}
            height={'700px'}
          />
        </Paper>
      </>
    );
  };

export default Calendar;

// ==============================
