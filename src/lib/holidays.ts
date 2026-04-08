export interface Holiday {
  date: string; 
  name: string;
}

export const HOLIDAYS_2025: Holiday[] = [
  { date: '2025-01-14', name: 'Makar Sankranti / Pongal' },
  { date: '2025-01-26', name: 'Republic Day' },
  { date: '2025-02-26', name: 'Maha Shivaratri' },
  { date: '2025-03-14', name: 'Holi' },
  { date: '2025-03-30', name: 'Id-ul-Fitr (Eid)' },
  { date: '2025-03-31', name: 'Idul Fitr' },
  { date: '2025-04-06', name: 'Ram Navami' },
  { date: '2025-04-10', name: 'Mahavir Jayanti' },
  { date: '2025-04-14', name: 'Dr. Ambedkar Jayanti' },
  { date: '2025-04-18', name: 'Good Friday' },
  { date: '2025-05-01', name: 'May Day' },
  { date: '2025-05-12', name: 'Buddha Purnima' },
  { date: '2025-06-07', name: 'Eid ul-Adha (Bakrid)' },
  { date: '2025-07-06', name: 'Muharram' },
  { date: '2025-08-09', name: 'Janmashtami' },
  { date: '2025-08-15', name: 'Independence Day' },
  { date: '2025-08-16', name: 'Parsi New Year' },
  { date: '2025-09-05', name: 'Milad-un-Nabi' },
  { date: '2025-10-02', name: 'Gandhi Jayanti' },
  { date: '2025-10-02', name: 'Dussehra' },
  { date: '2025-10-20', name: 'Diwali' },
  { date: '2025-10-21', name: 'Diwali (Govardhan Puja)' },
  { date: '2025-10-22', name: 'Bhai Dooj' },
  { date: '2025-11-01', name: 'All Saints Day' },
  { date: '2025-11-05', name: 'Guru Nanak Jayanti' },
  { date: '2025-12-25', name: 'Christmas' },
];

export const HOLIDAYS_2026: Holiday[] = [
  { date: '2026-01-14', name: 'Makar Sankranti / Pongal' },
  { date: '2026-01-26', name: 'Republic Day' },
  { date: '2026-02-15', name: 'Maha Shivaratri' },
  { date: '2026-03-03', name: 'Holi' },
  { date: '2026-03-20', name: 'Id-ul-Fitr (Eid)' },
  { date: '2026-03-26', name: 'Ram Navami' },
  { date: '2026-03-31', name: 'Mahavir Jayanti' },
  { date: '2026-04-03', name: 'Good Friday' },
  { date: '2026-04-14', name: 'Dr. Ambedkar Jayanti' },
  { date: '2026-05-01', name: 'May Day' },
  { date: '2026-05-01', name: 'Buddha Purnima' },
  { date: '2026-05-27', name: 'Eid ul-Adha (Bakrid)' },
  { date: '2026-06-26', name: 'Muharram' },
  { date: '2026-07-29', name: 'Janmashtami' },
  { date: '2026-08-15', name: 'Independence Day' },
  { date: '2026-08-25', name: 'Milad-un-Nabi' },
  { date: '2026-10-02', name: 'Gandhi Jayanti' },
  { date: '2026-10-19', name: 'Dussehra' },
  { date: '2026-11-08', name: 'Diwali' },
  { date: '2026-11-09', name: 'Diwali (Govardhan Puja)' },
  { date: '2026-11-10', name: 'Bhai Dooj' },
  { date: '2026-11-24', name: 'Guru Nanak Jayanti' },
  { date: '2026-12-25', name: 'Christmas' },
];

const ALL_HOLIDAYS = [...HOLIDAYS_2025, ...HOLIDAYS_2026];

export function getHolidayForDate(date: Date): Holiday | undefined {
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return ALL_HOLIDAYS.find((h) => h.date === dateStr);
}

export function isHoliday(date: Date): boolean {
  return !!getHolidayForDate(date);
}
