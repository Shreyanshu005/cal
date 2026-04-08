
export interface MonthTheme {
  accent: string;       
  accentLight: string;  
  start: string;        
  end: string;          
  range: string;        
  bgTint: string;       
  todayRing: string;    
  
  darkAccent: string;
  darkRange: string;
  darkBgTint: string;
}

export const MONTH_THEMES: Record<number, MonthTheme> = {
  
  0: {
    accent: '#5b8fa8',
    accentLight: '#e6f0f5',
    start: '#5b8fa8',
    end: '#8ab4c7',
    range: '#edf5f9',
    bgTint: '#f5f9fb',
    todayRing: '#5b8fa8',
    darkAccent: '#8ab4c7',
    darkRange: '#1e2e38',
    darkBgTint: '#1a1e22',
  },
  
  1: {
    accent: '#a08060',
    accentLight: '#f5ede4',
    start: '#a08060',
    end: '#c4a882',
    range: '#f8f0e8',
    bgTint: '#fbf8f4',
    todayRing: '#a08060',
    darkAccent: '#c4a882',
    darkRange: '#302820',
    darkBgTint: '#1e1c1a',
  },
  
  2: {
    accent: '#6a9a5b',
    accentLight: '#e8f2e4',
    start: '#6a9a5b',
    end: '#92b87e',
    range: '#eef5eb',
    bgTint: '#f6faf4',
    todayRing: '#6a9a5b',
    darkAccent: '#92b87e',
    darkRange: '#1e2c1a',
    darkBgTint: '#1a1e1a',
  },
  
  3: {
    accent: '#c4889a',
    accentLight: '#faeef2',
    start: '#c4889a',
    end: '#daa8b4',
    range: '#fdf2f5',
    bgTint: '#fdf7f9',
    todayRing: '#c4889a',
    darkAccent: '#daa8b4',
    darkRange: '#2e2028',
    darkBgTint: '#1e1a1c',
  },
  
  4: {
    accent: '#8a6aaa',
    accentLight: '#f0e8f5',
    start: '#8a6aaa',
    end: '#b094c8',
    range: '#f4eef8',
    bgTint: '#faf6fd',
    todayRing: '#8a6aaa',
    darkAccent: '#b094c8',
    darkRange: '#28203a',
    darkBgTint: '#1c1a20',
  },
  
  5: {
    accent: '#3a9a9a',
    accentLight: '#e2f4f4',
    start: '#3a9a9a',
    end: '#6ab8b8',
    range: '#e8f6f6',
    bgTint: '#f2fafa',
    todayRing: '#3a9a9a',
    darkAccent: '#6ab8b8',
    darkRange: '#1a2e2e',
    darkBgTint: '#1a1e1e',
  },
  
  6: {
    accent: '#b8960a',
    accentLight: '#f8f2dc',
    start: '#b8960a',
    end: '#d4b440',
    range: '#faf6e6',
    bgTint: '#fdfbf2',
    todayRing: '#b8960a',
    darkAccent: '#d4b440',
    darkRange: '#2e2a18',
    darkBgTint: '#1e1c18',
  },
  
  7: {
    accent: '#5a8a78',
    accentLight: '#e6f0ea',
    start: '#5a8a78',
    end: '#82aa98',
    range: '#ecf4f0',
    bgTint: '#f4faf7',
    todayRing: '#5a8a78',
    darkAccent: '#82aa98',
    darkRange: '#1a2a24',
    darkBgTint: '#1a1e1c',
  },
  
  8: {
    accent: '#a87040',
    accentLight: '#f5ece2',
    start: '#a87040',
    end: '#c89868',
    range: '#f8f0e6',
    bgTint: '#fdf8f2',
    todayRing: '#a87040',
    darkAccent: '#c89868',
    darkRange: '#2e2418',
    darkBgTint: '#1e1c18',
  },
  
  9: {
    accent: '#c06030',
    accentLight: '#f8e8dc',
    start: '#c06030',
    end: '#d88858',
    range: '#fceee4',
    bgTint: '#fef8f2',
    todayRing: '#c06030',
    darkAccent: '#d88858',
    darkRange: '#301e14',
    darkBgTint: '#1e1a18',
  },
  
  10: {
    accent: '#88785a',
    accentLight: '#f0ebe2',
    start: '#88785a',
    end: '#a89878',
    range: '#f4efe8',
    bgTint: '#f9f6f2',
    todayRing: '#88785a',
    darkAccent: '#a89878',
    darkRange: '#282420',
    darkBgTint: '#1c1a18',
  },
  
  11: {
    accent: '#4a7888',
    accentLight: '#e4eff2',
    start: '#4a7888',
    end: '#72a0ac',
    range: '#eaf3f6',
    bgTint: '#f2f8fa',
    todayRing: '#4a7888',
    darkAccent: '#72a0ac',
    darkRange: '#1a2830',
    darkBgTint: '#181c1e',
  },
};
