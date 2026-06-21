"use client";

import { NetworkDetails } from "../types/speed";

interface NetworkInfoProps {
  details: NetworkDetails | null;
  isLoading: boolean;
}

export default function NetworkInfo({ details, isLoading }: NetworkInfoProps) {
  if (isLoading) {
    return (
      <div className="w-full bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex items-center justify-center space-x-3 animate-pulse">
        <div className="w-4 h-4 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-sm text-slate-500 font-medium">Analyzing network provider route...</span>
      </div>
    );
  }

  if (!details) return null;

  return (
    <div className="w-full bg-slate-50/80 border border-slate-200/60 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-cyan-50 text-cyan-600 font-bold text-lg">🌐</div>
        <div className="text-left">
          <span className="block text-xs font-semibold uppercase text-slate-400 tracking-wider">Internet Provider</span>
          <h4 className="text-base font-bold text-slate-800">{details.isp}</h4>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-blue-50 text-blue-600 font-bold text-lg">📍</div>
        <div className="text-left">
          <span className="block text-xs font-semibold uppercase text-slate-400 tracking-wider">Detected Location</span>
          <h4 className="text-base font-bold text-slate-800">{details.location}</h4>
        </div>
      </div>

      <div className="text-center sm:text-right">
        <span className="block text-xs font-semibold uppercase text-slate-400 tracking-wider">Your Public IP</span>
        <span className="font-mono text-sm font-semibold text-slate-600 bg-slate-200/50 px-2.5 py-1 rounded-md">
          {details.ip}
        </span>
      </div>
    </div>
  );
}