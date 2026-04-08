'use client';

import { MONTH_NAMES } from '@/lib/calendarUtils';
import Image from 'next/image';
import SeasonalParticles from './SeasonalParticles';

interface HeroPanelProps {
  month: number;
  year: number;
  imageSrc: string;
  theme: 'light' | 'dark';
}

export default function HeroPanel({ month, year, imageSrc, theme }: HeroPanelProps) {
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9', maxHeight: '420px' }}>
      
      <Image
        src={imageSrc}
        alt={`${MONTH_NAMES[month]} ${year} landscape`}
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1152px"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      <SeasonalParticles month={month} />

      <div className="absolute bottom-5 md:bottom-7 right-5 md:right-8 text-right z-10">
        <div className="text-white/70 text-base md:text-xl font-body font-light tracking-[0.25em]">
          {year}
        </div>
        <h2 className="text-white text-2xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight uppercase drop-shadow-lg">
          {MONTH_NAMES[month]}
        </h2>
      </div>
    </div>
  );
}
