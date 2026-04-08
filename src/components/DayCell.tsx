'use client';

import { DayInfo } from '@/lib/calendarUtils';
import { Holiday } from '@/lib/holidays';
import { MonthTheme } from '@/lib/monthThemes';
import { WeatherForecastDay } from '@/lib/weatherApi';

interface DayCellProps {
  dayInfo: DayInfo;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  holiday?: Holiday;
  selectingEnd: boolean;
  onClick: () => void;
  theme: 'light' | 'dark';
  monthTheme: MonthTheme;
  todayWeather?: WeatherForecastDay;
}

export default function DayCell({
  dayInfo,
  isInRange,
  isRangeStart,
  isRangeEnd,
  holiday,
  selectingEnd,
  onClick,
  theme,
  monthTheme,
  todayWeather,
}: DayCellProps) {
  const { date, month, year, isCurrentMonth, isToday, isSaturday, isSunday } = dayInfo;
  const isDark = theme === 'dark';

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const cellDate = new Date(year, month, date);
  const daysUntil = Math.ceil((cellDate.getTime() - todayDate.getTime()) / (1000 * 3600 * 24));
  
  const showCountdown = holiday && daysUntil >= 0 && daysUntil <= 30;
  const progress = showCountdown ? Math.max(0.05, 1 - (daysUntil / 30)) : 0;
  const ringCircumference = 2 * Math.PI * 14; 
  const strokeDashoffset = ringCircumference * (1 - progress);

  if (!isCurrentMonth) {
    return (
      <div className="relative flex items-center justify-center py-2.5 md:py-3"
        style={{ color: isDark ? '#3a3a40' : '#d4d0ca', fontFamily: 'var(--font-display), sans-serif' }}>
        <span className="text-sm md:text-base">{date}</span>
      </div>
    );
  }

  const cellStyle: React.CSSProperties = {};
  let textColor = isDark ? '#e8e4df' : '#2d2d2d';
  let roundedClass = '';

  if (isRangeStart) {
    cellStyle.backgroundColor = monthTheme.start;
    textColor = '#ffffff';
    roundedClass = isRangeEnd ? 'rounded-xl' : 'rounded-l-xl';
  } else if (isRangeEnd) {
    cellStyle.backgroundColor = isDark ? monthTheme.darkAccent : monthTheme.end;
    textColor = '#ffffff';
    roundedClass = 'rounded-r-xl';
  } else if (isInRange) {
    cellStyle.backgroundColor = isDark ? monthTheme.darkRange : monthTheme.range;
    textColor = isDark ? monthTheme.darkAccent : monthTheme.accent;
  } else {
    if (isSaturday) textColor = isDark ? monthTheme.darkAccent : monthTheme.accent;
    else if (isSunday) textColor = '#d4837a';
  }

  let todayClass = '';
  if (isToday && !isRangeStart && !isRangeEnd) {
    const ringColor = isDark ? monthTheme.darkAccent : monthTheme.todayRing;
    cellStyle.boxShadow = `0 0 0 2px ${ringColor}, 0 0 0 3px ${isDark ? '#242428' : '#ffffff'}`;
    todayClass = 'rounded-xl';
  }

  return (
    <div
      className={`relative group flex items-center justify-center py-2.5 md:py-3 cursor-pointer
        transition-all duration-150 select-none rounded-lg ${roundedClass} ${todayClass}
      `}
      style={{ ...cellStyle, color: textColor }}
      onClick={onClick}
      title={holiday ? holiday.name : isToday ? 'Today' : undefined}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }
      }}
      onMouseEnter={(e) => {
        if (!isRangeStart && !isRangeEnd && !isInRange) {
          (e.currentTarget as HTMLDivElement).style.backgroundColor = isDark ? monthTheme.darkRange : monthTheme.accentLight;
          e.currentTarget.classList.add('rounded-xl');
        }
      }}
      onMouseLeave={(e) => {
        if (!isRangeStart && !isRangeEnd && !isInRange) {
          (e.currentTarget as HTMLDivElement).style.backgroundColor = '';
          if (!isToday) e.currentTarget.classList.remove('rounded-xl');
        }
      }}
      aria-label={`${date}${isToday ? ', today' : ''}${holiday ? `, ${holiday.name}` : ''}`}
    >
      <div className="relative w-8 h-8 md:w-9 md:h-9 flex items-center justify-center">
        {showCountdown && (
          <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none opacity-90" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="14" fill="none" stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'} strokeWidth="2" />
            <circle 
              cx="16" cy="16" r="14" 
              fill="none" 
              stroke={monthTheme.accent} 
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={ringCircumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
        )}
        <span className="relative z-10 text-sm md:text-base flex items-center gap-1" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
          {date}
          {todayWeather && (
            <span className="text-[10px] sm:text-xs ml-0.5 mt-px filter drop-shadow-sm animation-fade-in" title={`${todayWeather.maxTemp}° / ${todayWeather.minTemp}°`}>
              {todayWeather.icon}
            </span>
          )}
        </span>
      </div>

      {holiday && (
        <span
          className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full"
          style={{ backgroundColor: '#e8c170' }}
        />
      )}

      {holiday && (
        <div
          className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px] font-medium
            whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30"
          style={{
            backgroundColor: isDark ? '#3a3a40' : '#2d2d2d',
            color: '#ffffff',
          }}
        >
          {holiday.name}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
            style={{ borderTopColor: isDark ? '#3a3a40' : '#2d2d2d' }}
          />
        </div>
      )}
    </div>
  );
}
