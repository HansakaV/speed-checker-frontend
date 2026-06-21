"use client";

import { useEffect, useRef, useState } from "react";

interface SpeedGaugeProps {
  value: number;
  max: number;
  phase: string;
}

const TICKS = [0, 50, 100, 150, 200, 250, 300];

export default function SpeedGauge({ value, max, phase }: SpeedGaugeProps) {
  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const activeCircumference = circumference * (240 / 360); // 314.16
  const gapCircumference = circumference * (120 / 360);    // 157.08

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
      const duration = 1500; // 1.5 seconds (slower & smoother)

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
        // Damping factor: 0.05 makes it climb and fall slowly and smoothly
        return prev + diff * 0.05;
      });
      animationFrameId = requestAnimationFrame(updateNeedle);
    };

    animationFrameId = requestAnimationFrame(updateNeedle);

    return () => cancelAnimationFrame(animationFrameId);
  }, [phase]);

  const fillLength = (Math.min(displayValue, max) / max) * activeCircumference;

  // Needle Rotation relative to vertical pointing up
  // -120deg is bottom-left (0 Mbps), +120deg is bottom-right (300 Mbps)
  const needleRotation = -120 + (Math.min(displayValue, max) / max) * 240;

  return (
    <div className="relative w-64 h-64 mx-auto flex flex-col items-center justify-center animate-fadeIn select-none">
      {/* Background Dashboard Aura Glow (Light theme compatible) */}
      <div className="absolute inset-2 rounded-full bg-slate-50 border border-slate-200/80 shadow-[inset_0_0_20px_rgba(0,0,0,0.02),0_0_30px_rgba(6,182,212,0.02)] pointer-events-none" />

      {/* SVG Meter */}
      <svg className="w-full h-full drop-shadow-[0_4px_12px_rgba(15,23,42,0.05)]" viewBox="0 0 200 200">
        <defs>
          {/* Luminous Gradient for Light Background */}
          <linearGradient id="gaugeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />   {/* Neon Cyan */}
            <stop offset="60%" stopColor="#2563eb" />  {/* Electric Blue */}
            <stop offset="100%" stopColor="#ec4899" /> {/* Luminous Magenta */}
          </linearGradient>
          {/* Inner Grid Pattern (Light) */}
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(148, 163, 184, 0.08)" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Dashboard Grid Backplate */}
        <circle cx="100" cy="100" r="70" fill="url(#grid)" />

        {/* Circular Sub-ring accents */}
        <circle cx="100" cy="100" r="54" className="stroke-slate-200/40 fill-none" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="46" className="stroke-slate-100 fill-none" strokeWidth="0.5" />

        {/* Outer Unfilled Track */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          className="stroke-slate-100 fill-none"
          strokeWidth="6"
          strokeDasharray={`${activeCircumference} ${gapCircumference}`}
          transform="rotate(150 100 100)"
          strokeLinecap="round"
        />

        {/* Dynamic Speed Progress Arc */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="url(#gaugeGradient)"
          className="fill-none transition-all duration-150 ease-out"
          strokeWidth="8"
          strokeDasharray={`${fillLength} ${circumference}`}
          transform="rotate(150 100 100)"
          strokeLinecap="round"
        />

        {/* Dashboard Scale Ticks */}
        {TICKS.map((tick, i) => {
          const angle = 150 + i * (240 / (TICKS.length - 1));
          const angleRad = (angle * Math.PI) / 180;
          const rStart = radius - 11;
          const rEnd = radius - 4;
          const x1 = 100 + rStart * Math.cos(angleRad);
          const y1 = 100 + rStart * Math.sin(angleRad);
          const x2 = 100 + rEnd * Math.cos(angleRad);
          const y2 = 100 + rEnd * Math.sin(angleRad);

          const isLit = Math.round(displayValue) >= tick;

          return (
            <g key={tick}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={`transition-all duration-300 ${
                  isLit
                    ? "stroke-cyan-500 stroke-[2px] drop-shadow-[0_0_3px_rgba(6,182,212,0.6)]"
                    : "stroke-slate-200 stroke-[1px]"
                }`}
              />
              {/* Every tick is labeled with retro monospace text */}
              <text
                x={100 + (radius - 22) * Math.cos(angleRad)}
                y={100 + (radius - 22) * Math.sin(angleRad) + 3.5}
                textAnchor="middle"
                className={`text-[7px] font-mono font-bold transition-colors duration-300 ${
                  isLit ? "fill-cyan-600 drop-shadow-[0_0_1px_rgba(6,182,212,0.3)]" : "fill-slate-400"
                }`}
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Physical Glowing Speedometer Needle */}
        <g>
          {/* Vertical needle pointing to 12 o'clock, rotated via inline CSS transform for smoothness */}
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="30"
            className="stroke-rose-500 stroke-[2.5px] drop-shadow-[0_1px_4px_rgba(244,63,94,0.5)]"
            strokeLinecap="round"
            style={{
              transform: `rotate(${needleRotation}deg)`,
              transformOrigin: "100px 100px",
              transition: "transform 0.15s cubic-bezier(0.1, 0.8, 0.25, 1)",
            }}
          />
          {/* Center Hub */}
          <circle cx="100" cy="100" r="7" className="fill-slate-50 stroke-slate-200 stroke-[1.5px]" />
          <circle cx="100" cy="100" r="2.5" className="fill-rose-500 drop-shadow-[0_0_2px_rgba(244,63,94,0.6)]" />
        </g>
      </svg>

      {/* Center Value Core (Digital Readout) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-8">
        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-0.5">
          {phase === "downloading" ? "📥 Download" : phase === "uploading" ? "📤 Upload" : phase === "completed" ? "✅ Completed" : "Ready"}
        </span>
        <h2 className="text-5xl font-black tracking-tight text-slate-800 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          {Math.round(displayValue)}
        </h2>
        <span className="text-[10px] font-black text-cyan-600 tracking-widest uppercase mt-0.5">
          Mbps
        </span>
      </div>
    </div>
  );
}