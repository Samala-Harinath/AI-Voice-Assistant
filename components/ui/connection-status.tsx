'use client';

import React from 'react';
import { Wifi, WifiOff, Phone, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CallState } from '@/types/call';

interface ConnectionStatusProps {
  status: CallState['status'];
  duration: string;
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  status,
  duration,
  className,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'connecting':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'connected':
        return <Wifi className="w-4 h-4" />;
      case 'ended':
        return <WifiOff className="w-4 h-4" />;
      default:
        return <Phone className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connecting':
        return 'Connecting...';
      case 'connected':
        return `Connected • ${duration}`;
      case 'ended':
        return 'Call Ended';
      default:
        return 'Ready to Call';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connecting':
        return 'text-yellow-600';
      case 'connected':
        return 'text-green-600';
      case 'ended':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={cn('flex items-center space-x-2', getStatusColor(), className)}>
      {getStatusIcon()}
      <span className="text-sm font-medium">{getStatusText()}</span>
    </div>
  );
};