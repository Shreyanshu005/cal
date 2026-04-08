'use client';

import { useState, useEffect } from 'react';

interface LiveClockProps {
  theme: 'light' | 'dark';
  accentColor: string;
}

export default function LiveClock({ theme, accentColor }: LiveClockProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  const timeStr = `${h12}:${String(minutes).padStart(2, '0')}`;
  const secStr = String(seconds).padStart(2, '0');

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateStr = `${dayNames[now.getDay()]}, ${monthNames[now.getMonth()]} ${now.getDate()}`;

  return (
    <div className="flex items-center gap-3">
      
      <div className="flex items-center gap-1.5">
        <div className="relative">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <div
            className="absolute inset-0 w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: accentColor, opacity: 0.4 }}
          />
        </div>
        <span
          className="text-[9px] font-bold uppercase tracking-widest"
          style={{ color: accentColor }}
        >
          Live
        </span>
      </div>

      <div className="flex items-baseline gap-0.5">
        <span
          className={`text-lg font-display font-semibold tabular-nums ${
            theme === 'dark' ? 'text-dark-text' : 'text-cal-text'
          }`}
        >
          {timeStr}
        </span>
        <span
          className={`text-xs tabular-nums ${
            theme === 'dark' ? 'text-dark-text-secondary' : 'text-cal-text-secondary'
          }`}
        >
          :{secStr}
        </span>
        <span
          className="text-[10px] font-medium ml-0.5"
          style={{ color: accentColor }}
        >
          {ampm}
        </span>
      </div>

      <div className={`w-px h-4 ${theme === 'dark' ? 'bg-dark-border' : 'bg-cal-border'}`} />

      <span
        className={`text-xs font-medium hidden sm:block ${
          theme === 'dark' ? 'text-dark-text-secondary' : 'text-cal-text-secondary'
        }`}
      >
        {dateStr}
      </span>
    </div>
  );
}
