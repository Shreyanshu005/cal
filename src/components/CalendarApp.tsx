'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      if (e.key === 'ArrowLeft') { 
        e.preventDefault(); 
        navigateMonth('prev'); 
      } else if (e.key === 'ArrowRight') { 
        e.preventDefault(); 
        navigateMonth('next'); 
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setSelectedRange({ start: null, end: null });
        setSelectingEnd(false);
      } else if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        goToToday();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateMonth, goToToday]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const dx = touchStartX.current - touchEndX;
    const dy = touchStartY.current - touchEndY;
    const threshold = 50;
    if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) navigateMonth('next');
      else navigateMonth('prev');
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

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

  // Derive target configuration for dual-rendering background page underneath during flip anims
  const tMonth = flipDirection === 'next' ? (currentMonth + 1) % 12 : (flipDirection === 'prev' ? (currentMonth - 1 + 12) % 12 : currentMonth);
  const tYear = currentMonth === 11 && flipDirection === 'next' ? currentYear + 1 : (currentMonth === 0 && flipDirection === 'prev' ? currentYear - 1 : currentYear);
  const tGrid = generateCalendarGrid(tYear, tMonth);
  const tMk = `${tYear}-${tMonth}`;
  const tNotes = notes[tMk] || [];
  const tTheme = MONTH_THEMES[tMonth];
  const tQuote = MONTH_QUOTES[tMonth];
  const tAccent = isDark && tTheme.darkAccent ? tTheme.darkAccent : tTheme.accent;

  const renderMonthPage = (m: number, y: number, g: any[], nData: any[], mTheme: any, mQuote: any, mAccent: string) => (
    <>
      <HeroPanel month={m} year={y} imageSrc={MONTH_IMAGES[m]} theme={theme} />
      <div className="px-5 py-3 md:px-8 md:py-4 border-b transition-colors duration-500" style={{ borderColor: isDark ? '#3a3a40' : `${mAccent}20` }}>
        <p className="text-xs md:text-sm italic leading-relaxed" style={{ color: isDark ? '#8a8a90' : '#8a8a8a' }}>
          &ldquo;{mQuote.text}&rdquo;
        </p>
        <p className="text-[10px] md:text-xs mt-1 font-medium" style={{ color: mAccent }}>
          — {mQuote.author}
        </p>
      </div>
      <NavigationControls month={m} year={y} onPrev={() => navigateMonth('prev')} onNext={() => navigateMonth('next')} onToday={goToToday} theme={theme} accentColor={mAccent} />
      <div className="flex flex-col lg:flex-row">
        <div className="order-2 lg:order-1 lg:w-[280px] xl:w-[320px] flex-shrink-0">
          <NotesPanel notes={nData} selectedRange={selectedRange} onAddNote={handleAddNote} onDeleteNote={handleDeleteNote} onReorderNotes={handleReorderNotes} theme={theme} accentColor={mAccent} />
        </div>
        <div className="order-1 lg:order-2 flex-1 min-w-0">
          <DateGrid grid={g} selectedRange={selectedRange} selectingEnd={selectingEnd} onDateClick={handleDateClick} theme={theme} monthTheme={mTheme} todayWeather={weatherData?.today} />
        </div>
      </div>
    </>
  );

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
          {/* Header text purposefully removed at user request */}
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

      <div className="max-w-6xl mx-auto mt-8 md:mt-12 px-3 md:px-6 pb-32 md:pb-12 print:p-0 print:m-0 print:max-w-none">
        <div className="relative isolate">
          <div className="absolute top-0 left-0 right-0 z-[60] flex justify-center pointer-events-none print:hidden" style={{ transform: 'translateY(-50%)' }}>
            <SpiralBinding theme={theme} />
          </div>

          {/* Stacking Pages Effect - creates the physical thickness of a wall calendar */}
          <div className="absolute inset-x-0 top-2 -bottom-3 mx-4 rounded-3xl transition-all duration-500 print:hidden" 
            style={{ 
              backgroundColor: cardBg, 
              zIndex: -1, 
              opacity: 0.9,
              boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.6)' : '0 2px 15px rgba(0,0,0,0.1)',
              border: `1px solid ${isDark ? '#3a3a40' : '#dcd8d2'}`
            }} 
          />
          <div className="absolute inset-x-0 top-4 -bottom-6 mx-8 rounded-3xl transition-all duration-500 print:hidden" 
            style={{ 
              backgroundColor: cardBg, 
              zIndex: -2, 
              opacity: 0.6,
              boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.6)' : '0 2px 15px rgba(0,0,0,0.1)',
              border: `1px solid ${isDark ? '#3a3a40' : '#dcd8d2'}`
            }} 
          />

          <div
            className="relative z-0 rounded-3xl transition-all duration-500 -mt-1 print:rounded-none print:mt-0 print:border-none"
            style={{
              backgroundColor: cardBg,
              boxShadow: isDark
                ? '0 8px 40px rgba(0,0,0,0.5)'
                : '0 4px 30px rgba(0,0,0,0.08)',
            }}
          >
            <div 
              className="calendar-perspective relative z-0 bg-transparent"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* TARGET LAYER (UNDERNEATH STATIC, OR ANIMATING DOWN ON TOP) */}
              {flipPhase === 'exit' && (
                <div 
                  className={`absolute inset-0 pointer-events-none rounded-3xl overflow-hidden ${
                    flipDirection === 'next' ? 'z-20 anim-flip-down' : 'z-0'
                  }`}
                  style={{ backgroundColor: cardBg }}
                >
                  {renderMonthPage(tMonth, tYear, tGrid, tNotes, tTheme, tQuote, tAccent)}
                </div>
              )}

              {/* CURRENT LAYER (STATIC ON BOTTOM, OR ANIMATING UP ON TOP) */}
              <div
                className={`transform-style-preserve-3d relative rounded-3xl overflow-hidden ${
                  flipPhase === 'exit' && flipDirection === 'prev' ? 'z-10 anim-flip-up' : 'z-10'
                }`}
                style={{ backgroundColor: cardBg }}
              >
                {renderMonthPage(currentMonth, currentYear, grid, currentNotes, monthTheme, monthQuote, accentColor)}
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
            className="range-toast fixed bottom-4 md:bottom-6 left-1/2 z-50 px-3 md:px-5 py-2 md:py-3 rounded-full md:rounded-2xl text-[10px] sm:text-xs md:text-sm font-medium backdrop-blur-md shadow-lg flex items-center gap-1.5 md:gap-3 whitespace-nowrap transition-all duration-300 w-max justify-center"
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
  const spiralStyle = {
    backgroundImage: 'url(/Binding-Material-Horizontal.png)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    opacity: theme === 'dark' ? 0.9 : 1
  };

  return (
    <div className="w-full max-w-[850px] mx-auto flex justify-between px-6 sm:px-12 md:px-8 h-[90px] sm:h-[130px] md:h-[220px]">
      {/* 1st Spiral: Always visible */}
      <div className="w-[40%] sm:w-[30%] h-full" style={spiralStyle} />
      
      {/* 2nd Spiral: Desktop only (Center) */}
      <div className="w-[30%] h-full hidden md:block" style={spiralStyle} />
      
      {/* 3rd Spiral: Always visible (Right) */}
      <div className="w-[40%] sm:w-[30%] h-full" style={spiralStyle} />
    </div>
  );
}
