"use client";

import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface CallControlsProps {
  isCallActive: boolean;
  isMuted: boolean;
  isSpeakerOn: boolean;
  onStartCall: () => void;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
}

export function CallControls({
  isCallActive,
  isMuted,
  isSpeakerOn,
  onStartCall,
  onEndCall,
  onToggleMute,
  onToggleSpeaker
}: CallControlsProps) {
  return (
    <div className="flex justify-center items-center space-x-6 mb-6">
      {!isCallActive ? (
        <button
          onClick={onStartCall}
          className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          <Phone className="w-6 h-6" />
        </button>
      ) : (
        <>
          <button
            onClick={onToggleMute}
            className={`rounded-full w-12 h-12 flex items-center justify-center border-2 transition-all duration-200 transform hover:scale-105 active:scale-95 ${
              isMuted 
                ? 'bg-red-500/20 border-red-400 text-red-400 shadow-lg shadow-red-500/25' 
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={onEndCall}
            className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          <button
            onClick={onToggleSpeaker}
            className={`rounded-full w-12 h-12 flex items-center justify-center border-2 transition-all duration-200 transform hover:scale-105 active:scale-95 ${
              !isSpeakerOn 
                ? 'bg-red-500/20 border-red-400 text-red-400 shadow-lg shadow-red-500/25' 
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30'
            }`}
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </>
      )}
    </div>
  );
}