"use client";

import { Phone } from 'lucide-react';
import type { CallState } from './types';

interface VoiceVisualizationProps {
  isCallActive: boolean;
  callState: CallState;
}

export function VoiceVisualization({ isCallActive, callState }: VoiceVisualizationProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="relative">
        <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
          isCallActive 
            ? callState === 'listening' 
              ? 'border-emerald-400 bg-emerald-400/20 shadow-lg shadow-emerald-400/25' 
              : callState === 'speaking'
              ? 'border-blue-400 bg-blue-400/20 shadow-lg shadow-blue-400/25'
              : callState === 'processing'
              ? 'border-amber-400 bg-amber-400/20 shadow-lg shadow-amber-400/25'
              : 'border-white/30 bg-white/10'
            : 'border-white/30 bg-white/10 hover:border-white/50 hover:bg-white/15'
        }`}>
          {isCallActive ? (
            <div className="flex space-x-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    (callState === 'listening' || callState === 'speaking') 
                      ? 'bg-white animate-pulse'
                      : callState === 'processing'
                      ? 'bg-amber-300 animate-bounce'
                      : 'bg-white/50'
                  }`}
                  style={{
                    height: (callState === 'listening' || callState === 'speaking') 
                      ? `${Math.random() * 24 + 12}px` 
                      : '12px',
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: callState === 'processing' ? '0.6s' : '1s'
                  }}
                />
              ))}
            </div>
          ) : (
            <Phone className="w-12 h-12 text-white/70" />
          )}
        </div>
        
        {/* Pulse rings for active states */}
        {(callState === 'listening' || callState === 'speaking') && (
          <>
            <div className={`absolute inset-0 rounded-full border-2 animate-ping ${
              callState === 'listening' ? 'border-emerald-400/30' : 'border-blue-400/30'
            }`} style={{ animationDuration: '2s' }} />
            <div className={`absolute inset-2 rounded-full border animate-ping ${
              callState === 'listening' ? 'border-emerald-400/20' : 'border-blue-400/20'
            }`} style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
          </>
        )}
      </div>
    </div>
  );
}