'use client';

import { MONTH_NAMES } from '@/lib/calendarUtils';

interface NavigationControlsProps {
  month: number;
  year: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  theme: 'light' | 'dark';
  accentColor: string;
}

export default function NavigationControls({
  month,
  year,
  onPrev,
  onNext,
  onToday,
  theme,
  accentColor,
}: NavigationControlsProps) {
  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
  const isDark = theme === 'dark';

  return (
    <div
      className="flex items-center justify-between px-5 py-3 md:px-8 md:py-4 border-b"
      style={{ borderColor: isDark ? '#3a3a40' : '#e8e4df' }}
    >
      
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ color: isDark ? '#8a8a90' : '#8a8a8a' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = isDark ? '#2e2e34' : '#f0ebe5';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '';
          }}
          aria-label="Previous month"
          title="Previous month"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 3L5 8L10 13" />
          </svg>
        </button>

        <div className="min-w-[140px] md:min-w-[180px] text-center">
          <h2 className="font-display text-lg md:text-2xl font-bold tracking-tight">
            {MONTH_NAMES[month]}{' '}
            <span style={{ color: isDark ? '#8a8a90' : '#8a8a8a' }}>
              {year}
            </span>
          </h2>
        </div>

        <button
          onClick={onNext}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ color: isDark ? '#8a8a90' : '#8a8a8a' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = isDark ? '#2e2e34' : '#f0ebe5';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '';
          }}
          aria-label="Next month"
          title="Next month"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3L11 8L6 13" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-3">
        {!isCurrentMonth && (
          <button
            onClick={onToday}
            className="px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide transition-all duration-200
              hover:scale-105 active:scale-95 border"
            style={{
              backgroundColor: `${accentColor}12`,
              color: accentColor,
              borderColor: `${accentColor}25`,
            }}
          >
            Today
          </button>
        )}
      </div>
    </div>
  );
}
