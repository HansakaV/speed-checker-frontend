"use client";

import { NetworkDetails } from "../types/speed";

interface NetworkInfoProps {
  details: NetworkDetails | null;
  isLoading: boolean;
}

export default function NetworkInfo({ details, isLoading }: NetworkInfoProps) {
  if (isLoading) {
    return (
      <div className="w-full bg-zinc-950/70 border border-zinc-800/80 p-4 rounded-2xl flex items-center justify-center space-x-3 shadow-inner animate-pulse">
        <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-ping" />
        <span className="text-[10px] text-zinc-400 font-mono font-bold tracking-widest uppercase">
          DETECTING SYSTEM GATEWAY...
        </span>
      </div>
    );
  }

  if (!details) return null;

  return (
    <div className="w-full bg-black/95 border border-zinc-800/60 p-5 rounded-2xl shadow-2xl animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left relative z-10">
        
        {/* Internet Provider Column */}
        <div className="space-y-1.5 transition-all duration-300 hover:translate-y-[-2px]">
          <span className="block text-[10px] font-black italic uppercase text-zinc-400 tracking-wider">
            Internet Provider
          </span>
          <h4 className="text-sm font-black text-white font-sans uppercase tracking-wide">
            {details.isp || "Unknown ISP"}
          </h4>
        </div>

        {/* Location Column */}
        <div className="space-y-1.5 transition-all duration-300 hover:translate-y-[-2px] border-t border-zinc-900 md:border-t-0 md:border-x md:border-zinc-900/60 pt-4 md:pt-0 md:px-6">
          <span className="block text-[10px] font-black italic uppercase text-zinc-400 tracking-wider">
            Location
          </span>
          <h4 className="text-sm font-black text-white font-sans uppercase tracking-wide">
            {details.location || "Unknown Location"}
          </h4>
        </div>

        {/* IP Address Column */}
        <div className="space-y-1.5 transition-all duration-300 hover:translate-y-[-2px] border-t border-zinc-900 md:border-t-0 pt-4 md:pt-0">
          <span className="block text-[10px] font-black italic uppercase text-zinc-400 tracking-wider">
            Ip Address
          </span>
          <span className="inline-block font-mono text-xs font-bold text-cyan-400 bg-cyan-950/30 border border-cyan-800/30 px-2.5 py-1 rounded-md shadow-sm">
            {details.ip || "0.0.0.0"}
          </span>
        </div>

      </div>
    </div>
  );
}