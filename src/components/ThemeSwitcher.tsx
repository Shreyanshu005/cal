'use client';

interface ThemeSwitcherProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
  accentColor: string;
}

export default function ThemeSwitcher({ theme, onToggle, accentColor }: ThemeSwitcherProps) {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={onToggle}
      className="relative w-14 h-7 rounded-full transition-all duration-300 p-0.5"
      style={{
        backgroundColor: isDark ? '#3a3a40' : '#e8e4df',
        boxShadow: isDark ? `0 0 8px ${accentColor}20` : 'inset 0 1px 3px rgba(0,0,0,0.1)',
      }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div
        className="w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center"
        style={{
          transform: isDark ? 'translateX(28px)' : 'translateX(0)',
          backgroundColor: isDark ? '#2a2a30' : '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        }}
      >
        {isDark ? (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round">
            <path d="M13.5 8.5a5.5 5.5 0 01-7.5-7 6 6 0 107.5 7z" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round">
            <circle cx="8" cy="8" r="3" />
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.5 1.5M11 11l1.5 1.5M3.5 12.5l1.5-1.5M11 5l1.5-1.5" />
          </svg>
        )}
      </div>
    </button>
  );
}
