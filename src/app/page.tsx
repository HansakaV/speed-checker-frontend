"use client";

import SpeedGauge from "../components/speedgauge";
import NetworkInfo from "../components/networkinfo";
import { useSpeedTest } from "../services/useSpeedTest";

export default function Home() {
  const { metrics, network, isNetworkLoading, statusMessage, startSpeedTest } = useSpeedTest();
  const isActive = metrics.phase !== "idle";

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800 flex flex-col items-center justify-center p-4 selection:bg-cyan-500/10 selection:text-cyan-600">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-200/20 blur-[120px] pointer-events-none" />

      {/* Main dashboard container with smooth width transition */}
      <div className={`w-full transition-all duration-500 ease-in-out bg-white/95 border border-slate-200 p-5 sm:p-6 rounded-3xl shadow-xl relative overflow-hidden backdrop-blur-md ${
        isActive ? "max-w-3xl" : "max-w-md"
      }`}>
        
        {/* Dynamic layout using conditional grid */}
        <div className={`grid gap-6 items-center transition-all duration-500 ${
          isActive ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
        }`}>
          
          {/* Gauge Section (Left side when active) */}
          <div className="flex justify-center items-center">
            <SpeedGauge 
              value={
                metrics.phase === "downloading" ? metrics.download : 
                metrics.phase === "uploading" ? metrics.upload : 
                0
              } 
              max={300} 
              phase={metrics.phase}
            />
          </div>

          {/* Details & Controls Section (Right side when active) */}
          <div className="space-y-5 flex flex-col justify-center">
            
            {/* Modern Clean Branding Header */}
            <div className="space-y-1 text-center md:text-left">
              <div className="h-7 flex items-center justify-center md:justify-start">
                {statusMessage ? (
                  <div className="bg-cyan-50 border border-cyan-200 text-cyan-700 font-extrabold text-[9px] px-3.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 animate-fadeIn">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                    {statusMessage}
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-500 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                    ⚡️ Core Flow Network Stream
                  </div>
                )}
              </div>
              <h1 className="text-xl font-black tracking-tight text-slate-800 uppercase">
                CHECKMYSPEED<span className="text-cyan-500 drop-shadow-[0_0_4px_rgba(6,182,212,0.15)]">.COM</span>
              </h1>
            </div>

            {/* Metrics Scoreboard Grid - only show when active */}
            {isActive && (
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full mx-auto animate-fadeIn">
                {/* Latency */}
                <div className="bg-slate-50 border border-slate-200/80 p-2 sm:p-2.5 rounded-xl text-center shadow-sm">
                  <span className="block text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Latency</span>
                  <span className="text-sm sm:text-base md:text-lg font-black text-slate-700 font-mono">
                    {metrics.ping} <span className="text-[8px] sm:text-[9px] font-bold text-slate-400">ms</span>
                  </span>
                </div>

                {/* Download */}
                <div className={`border p-2 sm:p-2.5 rounded-xl text-center transition-all ${metrics.phase === 'downloading' ? 'border-cyan-500 bg-cyan-50/50 shadow-[0_0_10px_rgba(6,182,212,0.08)]' : 'border-slate-200/80 bg-slate-50'}`}>
                  <span className="block text-[8px] sm:text-[9px] font-bold text-cyan-500 uppercase tracking-wider mb-0.5">Download</span>
                  <span className="text-sm sm:text-base md:text-lg font-black text-cyan-600 font-mono">
                    {metrics.download} <span className="text-[8px] sm:text-[9px] font-bold text-cyan-500">Mbps</span>
                  </span>
                </div>

                {/* Upload */}
                <div className={`border p-2 sm:p-2.5 rounded-xl text-center transition-all ${metrics.phase === 'uploading' ? 'border-blue-500 bg-blue-50/50 shadow-[0_0_10px_rgba(59,130,246,0.08)]' : 'border-slate-200/80 bg-slate-50'}`}>
                  <span className="block text-[8px] sm:text-[9px] font-bold text-blue-500 uppercase tracking-wider mb-0.5">Upload</span>
                  <span className="text-sm sm:text-base md:text-lg font-black text-blue-600 font-mono">
                    {metrics.upload} <span className="text-[8px] sm:text-[9px] font-bold text-blue-500">Mbps</span>
                  </span>
                </div>
              </div>
            )}

            {/* Main Interactive Button */}
            <div className="w-full pt-1 max-w-xs mx-auto md:mx-0">
              <button
                onClick={startSpeedTest}
                disabled={metrics.phase !== "idle" && metrics.phase !== "completed"}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold py-3 px-5 rounded-xl transition duration-200 shadow-[0_4px_12px_rgba(6,182,212,0.25)] hover:shadow-[0_4px_16px_rgba(6,182,212,0.4)] disabled:from-slate-100 disabled:to-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed uppercase tracking-wider text-xs font-sans"
              >
                {metrics.phase === "idle" || metrics.phase === "completed" ? "Start Test" : `Testing...`}
              </button>
            </div>

          </div>

        </div>

        {/* Automated ISP Display - full-width container at bottom */}
        {isActive && (
          <div className="w-full animate-fadeIn pt-4 mt-4 border-t border-slate-100">
            <NetworkInfo details={network} isLoading={isNetworkLoading} />
          </div>
        )}

      </div>
    </main>
  );
}