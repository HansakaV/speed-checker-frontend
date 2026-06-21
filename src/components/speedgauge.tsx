"use client";

interface SpeedGaugeProps {
  value: number;
  max: number;
  phase: string;
}

export default function SpeedGauge({ value, max, phase }: SpeedGaugeProps) {  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  
  const clampedValue = Math.min(value, max);
  const strokeDashoffset = circumference - (clampedValue / max) * circumference;

  return (
    <div className="relative w-72 h-72 mx-auto flex flex-col items-center justify-center animate-fadeIn">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-blue-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* SVG Meter Arc */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        {/* Outer Track Circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          className="stroke-slate-100 fill-none"
          strokeWidth="8"
        />
        {/* Animated Speed Progress Arc */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          className="stroke-cyan-500 fill-none transition-all duration-150 ease-out"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Center Value Core */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
          {phase === "downloading" ? "📥 Download" : phase === "uploading" ? "📤 Upload" : "Ready"}
        </span>
        <h2 className="text-6xl font-black tracking-tight text-slate-800 font-mono transition-all duration-75">
          {value}
        </h2>
        <span className="text-sm font-bold text-cyan-600 tracking-wider mt-1">Mbps</span>
      </div>
    </div>
  );
}