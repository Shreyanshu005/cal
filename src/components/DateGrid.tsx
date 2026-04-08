'use client';

import { DayInfo, DateRange, WEEKDAY_NAMES, isInRange, isRangeStart, isRangeEnd } from '@/lib/calendarUtils';
import { MonthTheme } from '@/lib/monthThemes';
import { getHolidayForDate } from '@/lib/holidays';
import { WeatherForecastDay } from '@/lib/weatherApi';
import DayCell from './DayCell';

interface DateGridProps {
  grid: DayInfo[];
  selectedRange: DateRange;
  selectingEnd: boolean;
  onDateClick: (date: Date) => void;
  theme: 'light' | 'dark';
  monthTheme: MonthTheme;
  todayWeather?: WeatherForecastDay;
}

export default function DateGrid({ grid, selectedRange, selectingEnd, onDateClick, theme, monthTheme, todayWeather }: DateGridProps) {
  const { start, end } = selectedRange;

  return (
    <div className="px-3 py-4 md:px-6 md:py-5">
      
      <div className="grid grid-cols-7 gap-0.5 mb-2">
        {WEEKDAY_NAMES.map((day, idx) => {
          const isSat = idx === 5;
          const isSun = idx === 6;
          return (
            <div
              key={day}
              className="text-center text-[11px] md:text-xs font-bold tracking-wider py-2"
              style={{
                color: isSat
                  ? monthTheme.accent
                  : isSun
                  ? '#d4837a'
                  : theme === 'dark' ? '#8a8a90' : '#8a8a8a',
              }}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className={`h-px mb-2 ${theme === 'dark' ? 'bg-[#3a3a40]' : 'bg-[#e8e4df]'}`} />

      <div className="grid grid-cols-7 gap-0.5">
        {grid.map((dayInfo, idx) => {
          const holiday = dayInfo.isCurrentMonth ? getHolidayForDate(dayInfo.dateObj) : undefined;
          const inRange = isInRange(dayInfo.dateObj, start, end);
          const rangeStart = isRangeStart(dayInfo.dateObj, start, end);
          const rangeEnd = isRangeEnd(dayInfo.dateObj, start, end);

          return (
            <DayCell
              key={`${dayInfo.year}-${dayInfo.month}-${dayInfo.date}-${idx}`}
              dayInfo={dayInfo}
              isInRange={inRange}
              isRangeStart={rangeStart}
              isRangeEnd={rangeEnd}
              holiday={holiday}
              selectingEnd={selectingEnd}
              onClick={() => dayInfo.isCurrentMonth && onDateClick(dayInfo.dateObj)}
              theme={theme}
              monthTheme={monthTheme}
              todayWeather={dayInfo.isToday ? todayWeather : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
