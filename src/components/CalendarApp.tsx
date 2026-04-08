'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  generateCalendarGrid,
  MONTH_NAMES,
  MONTH_IMAGES,
  DateRange,
  MonthNotes,
  NoteEntry,
  monthKey,
  getDaysInRange,
  formatDate,
  loadNotes,
  saveNotes,
} from '@/lib/calendarUtils';
import { MONTH_THEMES } from '@/lib/monthThemes';
import { MONTH_QUOTES } from '@/lib/monthQuotes';
import { fetchWeather, WeatherData } from '@/lib/weatherApi';
import HeroPanel from './HeroPanel';
import DateGrid from './DateGrid';
import NotesPanel from './NotesPanel';
import NavigationControls from './NavigationControls';
import ThemeSwitcher from './ThemeSwitcher';
import WeatherForecast from './WeatherForecast';

export default function CalendarApp() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedRange, setSelectedRange] = useState<DateRange>({ start: null, end: null });
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [notes, setNotes] = useState<MonthNotes>({});
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [flipPhase, setFlipPhase] = useState<'idle' | 'exit' | 'enter'>('idle');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [showWeatherModal, setShowWeatherModal] = useState(false);

  useEffect(() => {
    fetchWeather().then(data => {
      if (data) setWeatherData(data);
    });
  }, []);

  const monthTheme = useMemo(() => MONTH_THEMES[currentMonth], [currentMonth]);
  const monthQuote = useMemo(() => MONTH_QUOTES[currentMonth], [currentMonth]);

  const isDark = theme === 'dark';
  const accentColor = isDark ? monthTheme.darkAccent : monthTheme.accent;

  const cardBg = isDark ? monthTheme.darkBgTint : monthTheme.bgTint;

  useEffect(() => {
    setNotes(loadNotes());
    const savedTheme = localStorage.getItem('wall-calendar-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wall-calendar-theme', theme);
  }, [theme]);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); navigateMonth('prev'); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); navigateMonth('next'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);

  }, [currentMonth, currentYear]);

  const grid = generateCalendarGrid(currentYear, currentMonth);
  const mk = monthKey(currentYear, currentMonth);
  const currentNotes = notes[mk] || [];

  const navigateMonth = useCallback((direction: 'next' | 'prev') => {
    if (flipPhase !== 'idle') return;
    setFlipDirection(direction);
    setFlipPhase('exit');
    setTimeout(() => {
      if (direction === 'next') {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
        else { setCurrentMonth((m) => m + 1); }
      } else {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
        else { setCurrentMonth((m) => m - 1); }
      }
      setSelectedRange({ start: null, end: null });
      setSelectingEnd(false);
      setFlipPhase('enter');
      setTimeout(() => { setFlipPhase('idle'); setFlipDirection(null); }, 500);
    }, 500);
  }, [currentMonth, flipPhase]);

  const goToToday = useCallback(() => {
    const t = new Date();
    if (t.getMonth() === currentMonth && t.getFullYear() === currentYear) return;
    if (flipPhase !== 'idle') return;
    const dir = t > new Date(currentYear, currentMonth) ? 'next' : 'prev';
    setFlipDirection(dir);
    setFlipPhase('exit');
    setTimeout(() => {
      setCurrentMonth(t.getMonth());
      setCurrentYear(t.getFullYear());
      setSelectedRange({ start: null, end: null });
      setSelectingEnd(false);
      setFlipPhase('enter');
      setTimeout(() => { setFlipPhase('idle'); setFlipDirection(null); }, 500);
    }, 500);
  }, [currentMonth, currentYear, flipPhase]);

  const handleDateClick = useCallback((date: Date) => {
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear() &&
      weatherData
    ) {
      setShowWeatherModal(true);
    }

    if (!selectingEnd || !selectedRange.start) {
      setSelectedRange({ start: date, end: null });
      setSelectingEnd(true);
    } else {
      setSelectedRange((prev) => ({ start: prev.start, end: date }));
      setSelectingEnd(false);
    }
  }, [selectingEnd, selectedRange.start]);

  const handleAddNote = useCallback((text: string) => {
    const newNote: NoteEntry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      text,
      rangeStart: selectedRange.start?.toISOString(),
      rangeEnd: selectedRange.end?.toISOString(),
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => ({ ...prev, [mk]: [...(prev[mk] || []), newNote] }));
  }, [mk, selectedRange]);

  const handleDeleteNote = useCallback((noteId: string) => {
    setNotes((prev) => ({ ...prev, [mk]: (prev[mk] || []).filter((n) => n.id !== noteId) }));
  }, [mk]);

  const handleReorderNotes = useCallback((reordered: NoteEntry[]) => {
    setNotes((prev) => ({ ...prev, [mk]: reordered }));
  }, [mk]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }, []);

  const rangeDays = selectedRange.start && selectedRange.end
    ? getDaysInRange(selectedRange.start, selectedRange.end) : null;

  const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{
        backgroundColor: isDark ? monthTheme.darkBgTint : monthTheme.bgTint,
        color: isDark ? '#e8e4df' : '#2d2d2d',
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-4">
        <div className="flex items-center gap-4">
          <h1
            className="font-display text-lg md:text-xl font-semibold tracking-tight cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
            onClick={goToToday}
            title="Jump to today"
          >
            Wall Calendar
          </h1>
        </div>
        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="p-2 md:p-2.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 border backdrop-blur-md shadow-sm group"
            style={{
              backgroundColor: isDark ? 'rgba(42,42,48,0.8)' : 'rgba(255,255,255,0.8)',
              color: isDark ? '#8a8a90' : '#777',
              borderColor: isDark ? '#3a3a40' : '#e0dbd4',
            }}
            title="Export as Print-ready PDF"
          >
            <svg
              className="w-[14px] h-[14px] md:w-[16px] md:h-[16px] transition-colors duration-300 group-hover:stroke-current"
              style={{ stroke: isDark ? '#dcd8d2' : '#222' }}
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
          </button>
          <ThemeSwitcher theme={theme} onToggle={toggleTheme} accentColor={accentColor} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 md:mt-12 px-3 md:px-6 pb-8 print:p-0 print:m-0 print:max-w-none">
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 z-[60] flex justify-center pointer-events-none print:hidden -mt-1" style={{ transform: 'translateY(-50%)' }}>
            <SpiralBinding theme={theme} />
          </div>

          <div
            className="relative z-0 rounded-3xl overflow-hidden transition-all duration-500 -mt-1 print:rounded-none print:mt-0 print:border-none"
            style={{
              backgroundColor: cardBg,
              boxShadow: isDark
                ? '0 8px 40px rgba(0,0,0,0.5)'
                : '0 4px 30px rgba(0,0,0,0.08)',
            }}
          >
            <div className="calendar-perspective">
              <div
                className={`${flipPhase === 'exit'
                  ? flipDirection === 'next' ? 'flip-exit-next' : 'flip-exit-prev'
                  : flipPhase === 'enter'
                    ? flipDirection === 'next' ? 'flip-enter-next' : 'flip-enter-prev'
                    : 'flip-idle'
                  }`}
              >
                <HeroPanel
                  month={currentMonth}
                  year={currentYear}
                  imageSrc={MONTH_IMAGES[currentMonth]}
                  theme={theme}
                />

                <div
                  className="px-5 py-3 md:px-8 md:py-4 border-b transition-colors duration-500"
                  style={{ borderColor: isDark ? '#3a3a40' : `${accentColor}20` }}
                >
                  <p
                    className="text-xs md:text-sm italic leading-relaxed"
                    style={{ color: isDark ? '#8a8a90' : '#8a8a8a' }}
                  >
                    &ldquo;{monthQuote.text}&rdquo;
                  </p>
                  <p
                    className="text-[10px] md:text-xs mt-1 font-medium"
                    style={{ color: accentColor }}
                  >
                    — {monthQuote.author}
                  </p>
                </div>

                <NavigationControls
                  month={currentMonth}
                  year={currentYear}
                  onPrev={() => navigateMonth('prev')}
                  onNext={() => navigateMonth('next')}
                  onToday={goToToday}
                  theme={theme}
                  accentColor={accentColor}
                />

                <div className="flex flex-col lg:flex-row">
                  <div className="order-2 lg:order-1 lg:w-[280px] xl:w-[320px] flex-shrink-0">
                    <NotesPanel
                      notes={currentNotes}
                      selectedRange={selectedRange}
                      onAddNote={handleAddNote}
                      onDeleteNote={handleDeleteNote}
                      onReorderNotes={handleReorderNotes}
                      theme={theme}
                      accentColor={accentColor}
                    />
                  </div>
                  <div className="order-1 lg:order-2 flex-1 min-w-0">
                    <DateGrid
                      grid={grid}
                      selectedRange={selectedRange}
                      selectingEnd={selectingEnd}
                      onDateClick={handleDateClick}
                      theme={theme}
                      monthTheme={monthTheme}
                      todayWeather={weatherData?.today}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {weatherData && showWeatherModal && (
          <WeatherForecast
            weather={weatherData}
            theme={theme}
            onClose={() => setShowWeatherModal(false)}
          />
        )}

        {rangeDays !== null && selectedRange.start && selectedRange.end && (
          <div
            className="range-toast fixed bottom-6 left-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-medium backdrop-blur-md shadow-lg flex items-center gap-3"
            style={{
              backgroundColor: isDark ? 'rgba(36,36,40,0.9)' : 'rgba(255,255,255,0.9)',
              color: isDark ? '#e8e4df' : '#2d2d2d',
              border: `1px solid ${isDark ? '#3a3a40' : '#e8e4df'}`,
            }}
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: monthTheme.start }} />
              {formatDate(selectedRange.start <= selectedRange.end ? selectedRange.start : selectedRange.end)}
            </span>
            <span style={{ color: isDark ? '#8a8a90' : '#8a8a8a' }}>–</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: monthTheme.end }} />
              {formatDate(selectedRange.start <= selectedRange.end ? selectedRange.end : selectedRange.start)}
            </span>
            <span
              className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-bold"
              style={{
                backgroundColor: isDark ? monthTheme.darkRange : monthTheme.range,
                color: accentColor,
              }}
            >
              {rangeDays} {rangeDays === 1 ? 'day' : 'days'}
            </span>
            <button
              onClick={() => { setSelectedRange({ start: null, end: null }); setSelectingEnd(false); }}
              className="ml-1 opacity-50 hover:opacity-100 transition-opacity text-lg leading-none"
              title="Clear selection"
            >×</button>
          </div>
        )}
      </div>
    </div>
  );
}

function SpiralBinding({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <div className="flex w-[95%] md:w-full max-w-[850px] justify-center mx-auto overflow-hidden md:-space-x-12">
      <img
        src="/Binding-Material-Horizontal.png"
        alt="Spiral Binding Left"
        className="block min-w-0 w-full md:w-[52%] max-w-none md:max-w-[350px] h-[210px] sm:h-[120px] md:h-[294px]"
        style={{
          objectFit: 'fill',
          opacity: theme === 'dark' ? 0.9 : 1
        }}
      />
      <img
        src="/Binding-Material-Horizontal.png"
        alt="Spiral Binding Right"
        className="hidden md:block min-w-0 w-[52%] max-w-[350px] h-[294px]"
        style={{
          objectFit: 'fill',
          opacity: theme === 'dark' ? 0.9 : 1
        }}
      />
    </div>
  );
}
