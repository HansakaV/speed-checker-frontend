"use client";

import SpeedGauge from "../components/speedgauge";
import NetworkInfo from "../components/networkinfo";
import { useSpeedTest } from "../services/useSpeedTest";

export default function Home() {
  const { metrics, network, isNetworkLoading, statusMessage, startSpeedTest } = useSpeedTest();
  const isActive = metrics.phase !== "idle";

  return (
    <main className="min-h-screen lg:h-screen w-full bg-[#060608] text-zinc-100 flex flex-col items-center justify-between p-6 lg:p-10 relative overflow-y-auto lg:overflow-hidden bg-grid-pattern select-none font-sans">

      {/* Background Glowing Blobs */}
      <div 
        className={`absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full transition-all duration-1000 pointer-events-none`}
        style={{
          background: metrics.phase === "downloading" ? "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)" :
                      metrics.phase === "uploading" ? "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)" :
                      metrics.phase === "completed" ? "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)" :
                      "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
          filter: "blur(80px)"
        }}
      />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

      {/* Header / Brand Logo */}
      <header className="w-full max-w-5xl flex items-center justify-between z-20 pb-4">
        <h2 className="text-xs font-black tracking-[0.3em] text-zinc-500 uppercase">
          COREFLOW <span className="text-zinc-300">STREAM</span>
        </h2>
      </header>

      {/* Main Interactive Grid */}
      <div className="w-full max-w-5xl my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center z-20 py-4 lg:py-0">
        
        {/* Column 1: Title (when idle) OR SpeedGauge (when active) */}
        <div className={`transition-all duration-500 ease-in-out lg:col-span-6 flex flex-col justify-center ${
          isActive ? "items-center" : "items-center lg:items-start text-center lg:text-left"
        }`}>
          {!isActive ? (
            <div className="space-y-4 animate-fadeIn">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-none text-white italic uppercase flex flex-col">
                <span>CHECK</span>
                <span className="text-zinc-500">YOUR</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500 drop-shadow-[0_0_15px_rgba(139,92,246,0.25)]">SPEED</span>
              </h1>
              <p className="text-zinc-600 font-mono text-[9px] tracking-[0.25em] uppercase pl-1">
                ⚡️ High precision network gateway
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full animate-fadeIn">
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
          )}
        </div>

        {/* Column 2: Gauge & GO button (when idle) OR Metrics (when active) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center w-full">
          {!isActive ? (
            <div className="flex flex-col items-center gap-16 w-full animate-fadeIn">
              <SpeedGauge value={0} max={300} phase="idle" />
              
              {/* Glowing circular "GO" Button with concentric blinking ripples */}
              <div className="relative flex items-center justify-center">
                {/* Concentric ripple 1 */}
                <div className="absolute w-24 h-24 rounded-full border border-violet-500/40 animate-ripple pointer-events-none" />
                {/* Concentric ripple 2 */}
                <div className="absolute w-24 h-24 rounded-full border border-cyan-400/30 animate-ripple [animation-delay:0.7s] pointer-events-none" />
                {/* Concentric ripple 3 */}
                <div className="absolute w-24 h-24 rounded-full border border-purple-500/20 animate-ripple [animation-delay:1.4s] pointer-events-none" />

                <button
                  onClick={startSpeedTest}
                  className="relative z-10 w-24 h-24 flex flex-col items-center justify-center rounded-full bg-gradient-to-br from-indigo-950/90 to-purple-950/90 border-2 border-indigo-500/50 text-white font-extrabold text-2xl tracking-widest italic cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] hover:border-cyan-400 hover:text-cyan-200"
                  style={{
                    animation: "float 4s ease-in-out infinite, pulseGlow 2s ease-in-out infinite"
                  }}
                >
                  GO
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-6 animate-fadeIn">
              
              {/* Status terminal alert */}
              <div className="h-6 flex items-center justify-center lg:justify-start">
                {statusMessage && (
                  <div className="bg-zinc-950/80 border border-zinc-800/60 text-[9px] font-mono font-bold text-zinc-300 px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2 shadow-inner">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    {statusMessage}
                  </div>
                )}
              </div>

              {/* Metrics Scoreboard Panel (Upper Right) */}
              <div className="bg-zinc-950/90 border border-zinc-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
                {/* Thin top cyan gradient line */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
                
                <div className="grid grid-cols-3 gap-2">
                  
                  {/* Ping Card */}
                  <div className="space-y-1 text-center md:text-left transition-all hover:translate-y-[-1px]">
                    <span className="block text-[9px] font-black italic uppercase text-zinc-400 tracking-wider">
                      Ping
                    </span>
                    <div className="font-mono text-lg sm:text-xl font-bold text-white">
                      {metrics.ping} <span className="text-[9px] text-zinc-500 font-sans uppercase">ms</span>
                    </div>
                  </div>

                  {/* Download Card */}
                  <div className="space-y-1 text-center md:text-left transition-all hover:translate-y-[-1px] border-l border-zinc-900 pl-3">
                    <span className="block text-[9px] font-black italic uppercase text-zinc-400 tracking-wider">
                      Download Speed
                    </span>
                    <div className={`font-mono text-lg sm:text-xl font-bold transition-all duration-300 ${
                      metrics.phase === "downloading" ? "text-cyan-400 text-neon-cyan" : "text-white"
                    }`}>
                      {metrics.download} <span className="text-[9px] text-zinc-500 font-sans uppercase">Mbps</span>
                    </div>
                  </div>

                  {/* Upload Card */}
                  <div className="space-y-1 text-center md:text-left transition-all hover:translate-y-[-1px] border-l border-zinc-900 pl-3">
                    <span className="block text-[9px] font-black italic uppercase text-zinc-400 tracking-wider">
                      Upload Speed
                    </span>
                    <div className={`font-mono text-lg sm:text-xl font-bold transition-all duration-300 ${
                      metrics.phase === "uploading" ? "text-pink-400 text-neon-magenta" : "text-white"
                    }`}>
                      {metrics.upload} <span className="text-[9px] text-zinc-500 font-sans uppercase">Mbps</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Check Again Button */}
              {(metrics.phase === "completed" || metrics.phase === "idle") && (
                <div className="flex justify-center lg:justify-start pt-1">
                  <button
                    onClick={startSpeedTest}
                    className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white font-extrabold italic py-3 px-8 rounded-xl transition duration-300 uppercase tracking-widest text-[10px] shadow-lg hover:scale-[1.02]"
                  >
                    Check Again
                  </button>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

      {/* Bottom Panel: NetworkInfo (only show when active) */}
      {isActive && (
        <div className="w-full max-w-5xl mt-4 z-20 animate-fadeIn">
          <NetworkInfo details={network} isLoading={isNetworkLoading} />
        </div>
      )}

      {/* Developer Credit */}
      <footer className="absolute bottom-6 right-8 z-20">
        <span className="text-zinc-500 text-[10px] font-extrabold tracking-wider italic">
          Developer:{" "}
          <a
            href="https://new-portfolio-hasa.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-300 hover:text-cyan-400 hover:underline transition-colors duration-200"
          >
            Mahesh Hansaka
          </a>
        </span>
      </footer>

    </main>
  );
}