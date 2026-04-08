'use client';

import { WeatherData } from '@/lib/weatherApi';

interface WeatherForecastProps {
  weather: WeatherData;
  theme: 'light' | 'dark';
  onClose: () => void;
}

export default function WeatherForecast({ weather, theme, onClose }: WeatherForecastProps) {
  const isDark = theme === 'dark';

  const formatDay = (dateStr: string, index: number) => {
    if (index === 0) return 'Today';
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animation-fade-in print:hidden" 
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl rounded-3xl p-6 md:p-8 flex flex-col gap-4 transition-colors duration-500 shadow-2xl transform scale-100 animation-spring-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: isDark ? 'rgba(36,36,40,0.85)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`
        }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 p-2 rounded-full opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#e8e4df' : '#2d2d2d'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        {weather.locationName && (
          <div className="flex items-center gap-1.5 px-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#a0a0a5' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span className="text-xs font-semibold tracking-wide" style={{ color: isDark ? '#a0a0a5' : '#888' }}>
              {weather.locationName}
            </span>
          </div>
        )}

        <div className="flex items-center gap-4 overflow-x-auto custom-scrollbar w-full">
          {weather.forecast.map((day, idx) => (
            <div 
              key={day.date} 
              className="flex flex-col items-center min-w-[70px] md:min-w-[80px] flex-shrink-0 gap-1.5 p-2 rounded-2xl transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5"
            >
              <span 
                className={`text-xs font-semibold uppercase tracking-wider ${idx === 0 ? 'text-red-400' : ''}`}
                style={{ color: idx === 0 ? (isDark ? '#f87171' : '#e05050') : (isDark ? '#a0a0a5' : '#888') }}
              >
                {formatDay(day.date, idx)}
              </span>
              <span className="text-2xl drop-shadow-sm my-1 filter transition-transform hover:scale-110">
                {day.icon}
              </span>
              <div className="flex gap-2 text-xs font-medium">
                <span style={{ color: isDark ? '#e8e4df' : '#2d2d2d' }}>{day.maxTemp}°</span>
                <span style={{ color: isDark ? '#666' : '#aaa' }}>{day.minTemp}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
