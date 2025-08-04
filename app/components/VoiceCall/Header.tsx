"use client";

import { getStateColor, getStateDisplay } from '@/app/lib/voice-utils';
import type { CallState } from './types';

interface HeaderProps {
  callState: CallState;
  isCallActive: boolean;
  formattedDuration: string;
}

export function Header({ callState, isCallActive, formattedDuration }: HeaderProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-2xl font-bold text-white mb-2">AI Voice Assistant</h1>
      <div className={`text-sm font-medium ${getStateColor(callState)} transition-colors duration-300`}>
        {getStateDisplay(callState)}
      </div>
      {isCallActive && (
        <div className="text-white/70 text-xs mt-1 font-mono">
          {formattedDuration}
        </div>
      )}
    </div>
  );
}