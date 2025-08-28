import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import { useDateInfo } from '../../context/dateInfo/useDateInfo';
import { Paper, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import type { CalendarEvents } from '../../../types/databaseTypes';
// import interactionPlugin, {
//   type DateClickArg,
// } from '@fullcalendar/interaction';
// import type { DatesSetArg, EventContentArg } from '@fullcalendar/core/index.js';
// import '../calendar.css';
// import type { Balance, CalendarContent } from '../types';
// import { calculationDailyBalances } from '../utils/financeCalculation';
// import { formatCurrency } from '../utils/formatting';
// import { useTheme } from '@mui/material';
// import { isSameMonth } from 'date-fns';
// import useMonthlyTransactions from '../hooks/useMonthlyTransactions';
// import { useAppContext } from '../context/AppContext';

// const Calendar = ({
//   // monthlyTransactions,
//   // setCurrentMonth,
//   currentDay,
//   setCurrentDay,
//   today,
//   onDateClick,
// }: ClendarProps) => {
//   const monthlyTransactions = useMonthlyTransactions();
//   const { setCurrentMonth } = useAppContext();
//   const theme = useTheme();

// const renderEventContent = (eventInfo: EventContentArg) => {
//     // console.log(eventInfo);
//     // console.log(eventInfo.event.extendedProps.income);

//     return (
//       <div>
//         <div className='money' id='event-income'>
//           {eventInfo.event.extendedProps.income}
//         </div>
//         <div className='money' id='event-expense'>
//           {eventInfo.event.extendedProps.expense}
//         </div>
//         <div className='money' id='event-balance'>
//           {eventInfo.event.extendedProps.balance}
//         </div>
//       </div>
//     );
//   };

//   // 月の日付を取得
//   const handleDateSet = (datesetInfo: DatesSetArg) => {
//     const currentMonth = datesetInfo.view.currentStart;
//     // console.log(datesetInfo.view.currentStart);
//     setCurrentMonth(currentMonth);
//     const todayDate = new Date();
//     if (isSameMonth(todayDate, currentMonth)) {
//       setCurrentDay(today);
//     }
//   };

//   return (
//   );
// };
// export default Calendar;

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
    // const [calendar_monthlyEvents, setCalendar_monthlyEvents] = useState<
    //   CalendarMonthlyEventsProps[]
    // >([]);
    const [selectYearMonth, setSelectYearMonth] = useState<string>(
      isoDate.substring(0, 7) // 2025-08-01 ➡︎ 2025-08へ変換
    );

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
        <Paper sx={{ p: 3, '& .fc': { fontSize: '14px' } }}>
          {/* <h1>Demo App</h1> */}
          <FullCalendar
            locale={jaLocale}
            plugins={[
              dayGridPlugin,
              // interactionPlugin
            ]}
            initialView='dayGridMonth'
            events={[...calendar_monthlyEvents, backgroundEvent]}
            // eventContent={renderEventContent}
            // datesSet={handleDateSet}
            // dateClick={handleDateClick}
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
