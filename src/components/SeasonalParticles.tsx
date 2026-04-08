'use client';

import { useEffect, useState } from 'react';

interface SeasonalParticlesProps {
  month: number;
}

interface Particle {
  id: number;
  left: number;      
  delay: number;      
  duration: number;   
  size: number;       
  opacity: number;
  drift: number;      
  char?: string;      
}

const SEASON_CONFIG: Record<number, {
  type: string;
  count: number;
  color: string;
  color2?: string;
}> = {
  0:  { type: 'snow',        count: 35, color: '#ffffff' },               
  1:  { type: 'snow',        count: 20, color: '#e8e4f0' },               
  2:  { type: 'petals',      count: 18, color: '#8bc48b', color2: '#c4e0a8' }, 
  3:  { type: 'cherry',      count: 25, color: '#f5c6d0', color2: '#f0a0b8' }, 
  4:  { type: 'petals',      count: 18, color: '#d4a8e0', color2: '#e8c4f0' }, 
  5:  { type: 'none',        count: 0,  color: 'transparent' },             
  6:  { type: 'none',        count: 0,  color: 'transparent' },             
  7:  { type: 'none',        count: 0,  color: 'transparent' },             
  8:  { type: 'leaves',      count: 15, color: '#d4a050', color2: '#c07830' }, 
  9:  { type: 'leaves',      count: 22, color: '#d05030', color2: '#e08040' }, 
  10: { type: 'rain',        count: 30, color: '#a0b0c0' },               
  11: { type: 'snow',        count: 40, color: '#ffffff', color2: '#d0e8ff' }, 
};

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 4 + Math.random() * 6,
    size: 4 + Math.random() * 8,
    opacity: 0.3 + Math.random() * 0.5,
    drift: -30 + Math.random() * 60,
  }));
}

export default function SeasonalParticles({ month }: SeasonalParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const config = SEASON_CONFIG[month];

  useEffect(() => {
    setParticles(generateParticles(config.count));
  }, [month, config.count]);

  if (!particles.length) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => {
        const animClass = `seasonal-${config.type}`;
        return (
          <div
            key={`${month}-${p.id}`}
            className={`absolute ${animClass}`}
            style={{
              left: `${p.left}%`,
              top: '-10px',
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              opacity: p.opacity,
              ['--drift' as string]: `${p.drift}px`,
            }}
          >
            <ParticleShape
              type={config.type}
              size={p.size}
              color={config.color}
              color2={config.color2}
            />
          </div>
        );
      })}
    </div>
  );
}

function ParticleShape({ type, size, color, color2 }: {
  type: string; size: number; color: string; color2?: string;
}) {
  switch (type) {
    case 'snow':
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            filter: 'blur(0.5px)',
          }}
        />
      );

    case 'cherry':
    case 'petals':
      return (
        <div
          style={{
            width: size,
            height: size * 1.3,
            borderRadius: '50% 0 50% 50%',
            background: `linear-gradient(135deg, ${color} 0%, ${color2 || color} 100%)`,
            transform: `rotate(${Math.random() * 360}deg)`,
            filter: 'blur(0.3px)',
          }}
        />
      );

    case 'leaves':
      return (
        <div
          style={{
            width: size * 1.2,
            height: size * 0.8,
            borderRadius: '0 50% 50% 50%',
            background: `linear-gradient(135deg, ${color} 0%, ${color2 || color} 100%)`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      );

    case 'sparkle':
      return (
        <div
          style={{
            width: size * 0.6,
            height: size * 0.6,
            background: color,
            borderRadius: '50%',
            boxShadow: `0 0 ${size}px ${size * 0.5}px ${color2 || color}40`,
            filter: 'blur(0.5px)',
          }}
        />
      );

    case 'firefly':
      return (
        <div
          style={{
            width: size * 0.4,
            height: size * 0.4,
            background: color,
            borderRadius: '50%',
            boxShadow: `0 0 ${size * 1.5}px ${size * 0.8}px ${color}60`,
          }}
        />
      );

    case 'rain':
      return (
        <div
          style={{
            width: 1.5,
            height: size * 2,
            background: `linear-gradient(180deg, transparent 0%, ${color} 100%)`,
            borderRadius: '0 0 2px 2px',
            opacity: 0.6,
          }}
        />
      );

    default:
      return (
        <div
          style={{ width: size, height: size, borderRadius: '50%', background: color }}
        />
      );
  }
}
