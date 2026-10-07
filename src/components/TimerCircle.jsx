import React, { useEffect } from 'react';

export default function TimerCircle({ totalSeconds, remainingSeconds, size = 96, strokeWidth = 6, label = '' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, remainingSeconds / totalSeconds));
  const strokeDashoffset = circumference - progress * circumference;

  const isLowTime = remainingSeconds <= Math.min(10, Math.floor(totalSeconds * 0.2));
  const isUrgent = remainingSeconds <= 5;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = minutes > 0 
    ? `${minutes}:${seconds.toString().padStart(2, '0')}`
    : `${seconds}s`;

  let strokeColor = '#c8a84b'; // Gold
  if (isUrgent) strokeColor = '#ef4444'; // Red
  else if (isLowTime) strokeColor = '#f59e0b'; // Amber

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#222810"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active Countdown Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Center Countdown Text */}
        <div className={`absolute flex flex-col items-center justify-center font-heading font-bold ${
          isUrgent ? 'text-red-500 scale-105 animate-pulse' : isLowTime ? 'text-amber-400' : 'text-[#c8a84b]'
        }`}>
          <span className="text-xl sm:text-2xl leading-none">{formattedTime}</span>
        </div>
      </div>
      {label && (
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#9a9780] mt-1.5 font-semibold">
          {label}
        </span>
      )}
    </div>
  );
}
