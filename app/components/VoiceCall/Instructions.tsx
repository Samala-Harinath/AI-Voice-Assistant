"use client";

interface InstructionsProps {
  isCallActive: boolean;
}

export function Instructions({ isCallActive }: InstructionsProps) {
  if (isCallActive) return null;

  return (
    <div className="text-center text-white/60 text-xs space-y-1">
      <p className="font-medium">Tap the call button to start talking with the AI assistant</p>
      <p>Make sure your microphone and speakers are enabled</p>
      <p className="text-white/40">Works best in Chrome or Edge browsers</p>
    </div>
  );
}