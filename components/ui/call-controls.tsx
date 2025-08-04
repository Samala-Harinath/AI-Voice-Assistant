'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CallControlsProps {
  isActive: boolean;
  isMuted: boolean;
  isSpeakerOn: boolean;
  onStartCall: () => void;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
}

export const CallControls: React.FC<CallControlsProps> = ({
  isActive,
  isMuted,
  isSpeakerOn,
  onStartCall,
  onEndCall,
  onToggleMute,
  onToggleSpeaker,
}) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      {!isActive ? (
        <Button
          onClick={onStartCall}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Phone className="w-6 h-6" />
        </Button>
      ) : (
        <>
          <Button
            onClick={onToggleMute}
            variant="outline"
            size="lg"
            className={cn(
              'rounded-full p-4 transition-all duration-200 hover:scale-105',
              isMuted 
                ? 'bg-red-100 border-red-300 text-red-600 hover:bg-red-200' 
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            )}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          <Button
            onClick={onEndCall}
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-105"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>

          <Button
            onClick={onToggleSpeaker}
            variant="outline"
            size="lg"
            className={cn(
              'rounded-full p-4 transition-all duration-200 hover:scale-105',
              isSpeakerOn 
                ? 'bg-blue-100 border-blue-300 text-blue-600 hover:bg-blue-200' 
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            )}
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
        </>
      )}
    </div>
  );
};