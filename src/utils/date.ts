/** 指定TZで y/m/d を取り出す小道具 */
export const extractYMD = (date: Date, timeZone: string) => {
  // Intl.DateTimeFormatでTZに沿った暦情報を得る
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  // 形式は "YYYY-MM-DD"
  const iso = fmt.format(date); // e.g. 2025-01-01
  const [yy, mm, dd] = iso.split('-').map(Number);
  return { y: yy, m: mm, d: dd, isoDate: iso };
};
