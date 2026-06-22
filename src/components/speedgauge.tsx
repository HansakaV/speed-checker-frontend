"use client";

import { useEffect, useRef, useState } from "react";

interface SpeedGaugeProps {
  value: number;
  max: number;
  phase: string;
}

const TICKS = [0, 10, 50, 100, 150, 200, 250, 300];

export default function SpeedGauge({ value, max, phase }: SpeedGaugeProps) {
  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const activeCircumference = circumference * (270 / 360); // 353.43
  const gapCircumference = circumference * (90 / 360);    // 117.81

  const [displayValue, setDisplayValue] = useState(0);

  // Cache latest target value in a ref to avoid tearing down the animation loop
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  // --- Ignition Sweep Animation ---
  useEffect(() => {
    if (phase === "pinging") {
      let startTime: number | null = null;
      const duration = 1500; // 1.5 seconds

      const animateSweep = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        let current: number;
        if (progress < 0.5) {
          const t = progress * 2;
          const ease = 1 - Math.pow(1 - t, 3); // cubic ease-out
          current = ease * max;
        } else {
          const t = (progress - 0.5) * 2;
          const ease = t * t * t; // cubic ease-in
          current = max - ease * max;
        }

        setDisplayValue(Math.round(current));

        if (progress < 1) {
          requestAnimationFrame(animateSweep);
        } else {
          setDisplayValue(0);
        }
      };

      requestAnimationFrame(animateSweep);
    }
  }, [phase, max]);

  // --- Smooth Needle LERP (Inertia Simulation) ---
  useEffect(() => {
    if (phase === "pinging") return;

    let animationFrameId: number;

    const updateNeedle = () => {
      setDisplayValue((prev) => {
        const target = valueRef.current;
        const diff = target - prev;
        if (Math.abs(diff) < 0.05) {
          return target;
        }
        // Damping factor for smooth movement
        return prev + diff * 0.08;
      });
      animationFrameId = requestAnimationFrame(updateNeedle);
    };

    animationFrameId = requestAnimationFrame(updateNeedle);

    return () => cancelAnimationFrame(animationFrameId);
  }, [phase]);

  const fillLength = (Math.min(displayValue, max) / max) * activeCircumference;

  // Let's configure phase colors, glows and descriptions
  let themeColor = "stroke-violet-500";
  let themeGlow = "rgba(139, 92, 246, 0.4)";
  let themeGradientId = "violetGradient";
  let displayPhaseName = "Ready";

  if (phase === "downloading") {
    themeColor = "stroke-cyan-500";
    themeGlow = "rgba(6, 182, 212, 0.5)";
    themeGradientId = "cyanGradient";
    displayPhaseName = "Download";
  } else if (phase === "uploading") {
    themeColor = "stroke-pink-500";
    themeGlow = "rgba(236, 72, 153, 0.5)";
    themeGradientId = "pinkGradient";
    displayPhaseName = "Upload";
  } else if (phase === "pinging") {
    themeColor = "stroke-violet-500";
    themeGlow = "rgba(139, 92, 246, 0.5)";
    themeGradientId = "violetGradient";
    displayPhaseName = "Ping";
  } else if (phase === "completed") {
    themeColor = "stroke-emerald-500";
    themeGlow = "rgba(16, 185, 129, 0.5)";
    themeGradientId = "emeraldGradient";
    displayPhaseName = "Completed";
  }

  // Calculate coordinates of the laser tip dot
  const angle = 135 + (Math.min(displayValue, max) / max) * 270;
  const angleRad = (angle * Math.PI) / 180;
  const dotX = 100 + radius * Math.cos(angleRad);
  const dotY = 100 + radius * Math.sin(angleRad);

  // Calculate dynamic rotation speed based on value
  const rotSpeed = displayValue > 0 ? Math.max(1, 10 - (displayValue / max) * 9) : 25;

  return (
    <div className="relative w-72 h-72 mx-auto flex flex-col items-center justify-center animate-fadeIn select-none">
      
      {/* Outer Glowing Neon Border Ring (Gradient + Glow shadow) */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none transition-all duration-700 z-0"
        style={{
          background: phase === "downloading" ? "linear-gradient(135deg, #06b6d4, #3b82f6)" :
                      phase === "uploading" ? "linear-gradient(135deg, #ec4899, #8b5cf6)" :
                      phase === "completed" ? "linear-gradient(135deg, #10b981, #06b6d4)" :
                      "linear-gradient(135deg, #8b5cf6, #6366f1)",
          boxShadow: phase !== "idle" 
            ? `0 0 25px ${themeGlow}, inset 0 0 15px ${themeGlow}` 
            : `0 0 15px rgba(139, 92, 246, 0.25)`,
          padding: "3px"
        }}
      >
        {/* Inner Dark Cutout to make it a border ring */}
        <div className="w-full h-full rounded-full bg-[#060608]" />
      </div>

      {/* Outer Rotating Cyber Ring: spins faster when speed increases */}
      <div 
        className="absolute inset-2 rounded-full border border-dashed border-violet-500/10 pointer-events-none z-0"
        style={{
          borderColor: phase !== "idle" ? themeGlow : "rgba(139, 92, 246, 0.1)",
          boxShadow: phase !== "idle" ? `0 0 15px ${themeGlow}1a, inset 0 0 15px ${themeGlow}1a` : "none",
          animation: `slowRotate ${rotSpeed}s linear infinite`,
        }}
      />

      {/* Cybernetic Aura / Backdrop Glow */}
      <div 
        className="absolute inset-4 rounded-full transition-all duration-1000 bg-zinc-950/80 border border-zinc-800/50 flex items-center justify-center overflow-hidden"
        style={{
          boxShadow: phase !== "idle" 
            ? `0 0 35px ${themeGlow}22, inset 0 0 25px ${themeGlow}11` 
            : `0 0 30px rgba(139, 92, 246, 0.05)`,
        }}
      >
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        
        {/* Animated Ripple Waves for Pinging phase */}
        {phase === "pinging" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute w-24 h-24 rounded-full border border-violet-500/40 animate-ping opacity-75" />
            <div className="absolute w-36 h-36 rounded-full border border-violet-500/20 animate-ping opacity-40 [animation-delay:0.5s]" />
          </div>
        )}
      </div>

      {/* Main SVG Dashboard Meter */}
      <svg className="w-full h-full relative z-10" viewBox="0 0 200 200">
        <defs>
          {/* Neon Gradients */}
          <linearGradient id="cyanGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="pinkGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="violetGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="emeraldGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Circular Sub-ring accent (Tech vibe) */}
        <circle cx="100" cy="100" r="82" className="stroke-zinc-800 fill-none" strokeWidth="1" strokeDasharray="4 8" />
        <circle cx="100" cy="100" r="68" className="stroke-zinc-900 fill-none" strokeWidth="1.5" />

        {/* Outer Unfilled Track (Slate Track) */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          className="stroke-zinc-900 fill-none"
          strokeWidth="6"
          strokeDasharray={`${activeCircumference} ${gapCircumference}`}
          transform="rotate(135 100 100)"
          strokeLinecap="round"
        />

        {/* Dynamic Speed Progress Arc */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke={`url(#${themeGradientId})`}
          className="fill-none transition-all duration-150 ease-out"
          strokeWidth="7"
          strokeDasharray={`${fillLength} ${circumference}`}
          transform="rotate(135 100 100)"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* Scale Ticks & Digital Indicators */}
        {TICKS.map((tick, i) => {
          const tickAngle = 135 + i * (270 / (TICKS.length - 1));
          const tickAngleRad = (tickAngle * Math.PI) / 180;
          const rStart = radius - 10;
          const rEnd = radius - 4;
          const x1 = 100 + rStart * Math.cos(tickAngleRad);
          const y1 = 100 + rStart * Math.sin(tickAngleRad);
          const x2 = 100 + rEnd * Math.cos(tickAngleRad);
          const y2 = 100 + rEnd * Math.sin(tickAngleRad);

          const isLit = displayValue >= tick && phase !== "idle";

          return (
            <g key={tick}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={`transition-all duration-300 ${
                  isLit
                    ? `${themeColor} stroke-[2px]`
                    : "stroke-zinc-800 stroke-[1px]"
                }`}
                style={{
                  filter: isLit ? "drop-shadow(0 0 2px var(--tw-shadow-color))" : "none"
                }}
              />
              <text
                x={100 + (radius - 20) * Math.cos(tickAngleRad)}
                y={100 + (radius - 20) * Math.sin(tickAngleRad) + 3}
                textAnchor="middle"
                className={`text-[7px] font-mono font-bold transition-all duration-300 ${
                  isLit ? "fill-zinc-100 font-extrabold" : "fill-zinc-600"
                }`}
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Laser Tip Indicator (Glowing Dot at current speed) */}
        {phase !== "idle" && displayValue > 0 && (
          <circle
            cx={dotX}
            cy={dotY}
            r="4.5"
            className="fill-zinc-100"
            style={{
              filter: `drop-shadow(0 0 6px ${themeGlow})`,
            }}
          />
        )}
      </svg>

      {/* Center Value Core (Digital Readout) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-6 z-20">
        <span 
          className="text-[9px] font-black uppercase tracking-[0.25em] transition-colors duration-500"
          style={{
            color: phase !== "idle" ? themeGlow.replace(/[\d.]+\)$/, "1)") : "#71717a",
            textShadow: phase !== "idle" ? `0 0 8px ${themeGlow}` : "none",
          }}
        >
          {displayPhaseName}
        </span>
        <h2 className="text-5xl font-black tracking-tight text-white font-mono drop-shadow-[0_2px_10px_rgba(255,255,255,0.05)] mt-1 mb-0.5">
          {Math.round(displayValue)}
        </h2>
        <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">
          Mbps
        </span>
      </div>
    </div>
  );
}