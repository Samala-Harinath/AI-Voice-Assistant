'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AudioVisualizerProps {
  isActive: boolean;
  isSpeaking: boolean;
  className?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isActive,
  isSpeaking,
  className,
}) => {
  const [bars, setBars] = useState<number[]>(new Array(5).fill(0));

  useEffect(() => {
    if (!isActive) {
      setBars(new Array(5).fill(0));
      return;
    }

    const interval = setInterval(() => {
      setBars(prevBars =>
        prevBars.map(() => {
          if (isSpeaking) {
            return Math.random() * 0.8 + 0.2;
          }
          return Math.random() * 0.3;
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, isSpeaking]);

  return (
    <div className={cn('flex items-center justify-center space-x-1', className)}>
      {bars.map((height, index) => (
        <div
          key={index}
          className={cn(
            'bg-blue-500 rounded-full transition-all duration-100 ease-out',
            isActive ? 'animate-pulse' : '',
            isSpeaking ? 'bg-green-500' : 'bg-blue-500'
          )}
          style={{
            width: '4px',
            height: `${Math.max(height * 24, 4)}px`,
            opacity: isActive ? 1 : 0.5,
          }}
        />
      ))}
    </div>
  );
};