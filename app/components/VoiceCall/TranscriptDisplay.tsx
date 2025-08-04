"use client";

interface TranscriptDisplayProps {
  currentTranscript: string;
}

export function TranscriptDisplay({ currentTranscript }: TranscriptDisplayProps) {
  if (!currentTranscript) return null;

  return (
    <div className="mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
      <p className="text-white/90 text-sm leading-relaxed">
        <span className="text-white/60 font-medium">You: </span>
        <span className="text-white">{currentTranscript}</span>
      </p>
    </div>
  );
}