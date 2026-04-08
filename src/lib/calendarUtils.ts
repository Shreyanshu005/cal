export interface DayInfo {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isSaturday: boolean;
  isSunday: boolean;
  dateObj: Date;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface NoteEntry {
  id: string;
  text: string;
  rangeStart?: string; 
  rangeEnd?: string;
  createdAt: string;
}

export interface MonthNotes {
  [monthKey: string]: NoteEntry[];
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const WEEKDAY_NAMES = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const MONTH_IMAGES: Record<number, string> = {
  0: '/january.png',
  1: '/february.png',
  2: '/march.png',
  3: '/april.png',
  4: '/may.png',
  5: '/june.png',
  6: '/july.png',
  7: '/august.png',
  8: '/september.png',
  9: '/october.png',
  10: '/november.png',
  11: '/december.png',
};

export function generateCalendarGrid(year: number, month: number): DayInfo[] {
  const today = new Date();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const grid: DayInfo[] = [];

  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDow - 1; i >= 0; i--) {
    const date = prevMonthLastDay - i;
    const d = new Date(year, month - 1, date);
    grid.push(createDayInfo(d, date, month - 1, year, false, today));
  }

  for (let date = 1; date <= lastDay.getDate(); date++) {
    const d = new Date(year, month, date);
    grid.push(createDayInfo(d, date, month, year, true, today));
  }

  const remaining = 42 - grid.length;
  for (let date = 1; date <= remaining; date++) {
    const d = new Date(year, month + 1, date);
    grid.push(createDayInfo(d, date, month + 1, year, false, today));
  }

  return grid;
}

function createDayInfo(
  dateObj: Date,
  date: number,
  month: number,
  year: number,
  isCurrentMonth: boolean,
  today: Date
): DayInfo {
  const dow = dateObj.getDay();
  return {
    date,
    month: dateObj.getMonth(),
    year: dateObj.getFullYear(),
    isCurrentMonth,
    isToday:
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear(),
    isWeekend: dow === 0 || dow === 6,
    isSaturday: dow === 6,
    isSunday: dow === 0,
    dateObj,
  };
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const time = date.getTime();
  const [s, e] = start <= end ? [start, end] : [end, start];
  return time >= s.getTime() && time <= e.getTime();
}

export function isRangeStart(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start) return false;
  if (!end) return isSameDay(date, start);
  const [s] = start <= end ? [start] : [end];
  return isSameDay(date, s);
}

export function isRangeEnd(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const [, e] = start <= end ? [start, end] : [end, start];
  return isSameDay(date, e);
}

export function getDaysInRange(start: Date, end: Date): number {
  const [s, e] = start <= end ? [start, end] : [end, start];
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function monthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

const NOTES_KEY = 'wall-calendar-notes';

export function loadNotes(): MonthNotes {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveNotes(notes: MonthNotes): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch {
    
  }
}
