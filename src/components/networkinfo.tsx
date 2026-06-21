"use client";

import { NetworkDetails } from "../types/speed";

interface NetworkInfoProps {
  details: NetworkDetails | null;
  isLoading: boolean;
}

export default function NetworkInfo({ details, isLoading }: NetworkInfoProps) {
  if (isLoading) {
    return (
      <div className="w-full bg-slate-50/80 border border-slate-200/60 p-3.5 rounded-2xl flex items-center justify-center space-x-3 animate-pulse">
        <div className="w-3.5 h-3.5 rounded-full bg-cyan-500 animate-ping" />
        <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Analyzing Network Provider Route...</span>
      </div>
    );
  }

  if (!details) return null;

  return (
    <div className="w-full bg-slate-50/80 border border-slate-200/80 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm animate-fadeIn">
      {/* ISP Info */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600 font-bold text-base shadow-sm border border-cyan-100">
          🌐
        </div>
        <div className="text-left">
          <span className="block text-[9px] font-bold uppercase text-slate-400 tracking-wider">Internet Provider</span>
          <h4 className="text-xs font-black text-slate-800">{details.isp}</h4>
        </div>
      </div>

      {/* Location Info */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 font-bold text-base shadow-sm border border-blue-100">
          📍
        </div>
        <div className="text-left">
          <span className="block text-[9px] font-bold uppercase text-slate-400 tracking-wider">Detected Location</span>
          <h4 className="text-xs font-black text-slate-800">{details.location}</h4>
        </div>
      </div>

      {/* IP Address */}
      <div className="text-left sm:text-right w-full sm:w-auto pt-2 sm:pt-0 border-t border-slate-200/40 sm:border-t-0 flex flex-col items-start sm:items-end">
        <span className="block text-[9px] font-bold uppercase text-slate-400 tracking-wider mb-0.5">Your Public IP</span>
        <span className="font-mono text-xs font-semibold text-cyan-600 bg-cyan-50 border border-cyan-100 px-2 py-0.5 rounded-md">
          {details.ip}
        </span>
      </div>
    </div>
  );
}