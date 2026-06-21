import { useState } from "react";
import { SpeedMetrics, NetworkDetails } from "../types/speed";
import { runPingAndNetworkTest, runDownloadTest, runUploadTest } from "../api/speedTest";

export function useSpeedTest() {
  const [metrics, setMetrics] = useState<SpeedMetrics>({
    ping: 0,
    download: 0,
    upload: 0,
    phase: "idle",
  });
  const [network, setNetwork] = useState<NetworkDetails | null>(null);
  const [isNetworkLoading, setIsNetworkLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // --- 🔥 CORE SPEED TEST FLOW CONTROL ---
  const startSpeedTest = async () => {
    // 1. Initial Latency Ignition Sweep
    setMetrics({ ping: 0, download: 0, upload: 0, phase: "pinging" });
    setNetwork(null);
    setIsNetworkLoading(true);
    setStatusMessage("⚡ Latency Sweep...");

    try {
      const pingStartTime = performance.now();
      const { duration, network: networkDetails } = await runPingAndNetworkTest();
      
      const elapsed = performance.now() - pingStartTime;
      const minDuration = 1800; // 1.8 seconds
      if (elapsed < minDuration) {
        await new Promise((resolve) => setTimeout(resolve, minDuration - elapsed));
      }

      setNetwork(networkDetails);
      setIsNetworkLoading(false);
      setMetrics((prev) => ({ ...prev, ping: duration }));

      // Phase Delay Alert: "Checking Download Speed..."
      setStatusMessage("📥 Checking Download Speed...");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second pause

      // Move into download phase
      setMetrics((prev) => ({ ...prev, phase: "downloading" }));

      // 2. Download Speed Streaming Phase
      const downloadResult = await runDownloadTest(() => {}); // run download test in background
      
      // Visual progress animation (4 seconds)
      const downloadStart = performance.now();
      const downloadDuration = 4000; // 4s
      
      await new Promise<void>((resolve) => {
        const update = (timestamp: number) => {
          const elapsed = timestamp - downloadStart;
          const progress = Math.min(elapsed / downloadDuration, 1);
          
          // Easing for climb: cubic ease-out
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          let currentSpeed = downloadResult * easeProgress;
          
          // Add small realistic fluctuations
          if (progress < 1) {
            const fluctuation = Math.sin(timestamp / 100) * (downloadResult * 0.03);
            currentSpeed = Math.max(0, currentSpeed + fluctuation);
          } else {
            currentSpeed = downloadResult;
          }
          
          setMetrics((prev) => ({ ...prev, download: Math.round(currentSpeed) }));
          
          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            resolve();
          }
        };
        requestAnimationFrame(update);
      });

      // 3. Upload Ignition Sweep
      setMetrics((prev) => ({ ...prev, phase: "pinging" }));
      setStatusMessage("⚡ Upload Sweep...");
      await new Promise((resolve) => setTimeout(resolve, 1800)); // 1.8 seconds for sweep

      // Phase Delay Alert: "Checking Upload Speed..."
      setStatusMessage("📤 Checking Upload Speed...");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second pause

      // Move into upload phase
      setMetrics((prev) => ({ ...prev, phase: "uploading" }));

      // 4. Upload Speed Payload Phase
      const uploadResult = await runUploadTest(() => {}); // run upload test in background
      
      // Visual progress animation (4 seconds)
      const uploadStart = performance.now();
      const uploadDuration = 4000; // 4s
      
      await new Promise<void>((resolve) => {
        const update = (timestamp: number) => {
          const elapsed = timestamp - uploadStart;
          const progress = Math.min(elapsed / uploadDuration, 1);
          
          // Easing for climb: cubic ease-out
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          let currentSpeed = uploadResult * easeProgress;
          
          // Add small realistic fluctuations
          if (progress < 1) {
            const fluctuation = Math.sin(timestamp / 100) * (uploadResult * 0.03);
            currentSpeed = Math.max(0, currentSpeed + fluctuation);
          } else {
            currentSpeed = uploadResult;
          }
          
          setMetrics((prev) => ({ ...prev, upload: Math.round(currentSpeed) }));
          
          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            resolve();
          }
        };
        requestAnimationFrame(update);
      });

      setMetrics((prev) => ({ ...prev, phase: "completed" }));
      setStatusMessage("✅ Speed Test Completed");
      // Hide status message after 3 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);

    } catch (err) {
      console.error("Network benchmark failed:", err);
      setIsNetworkLoading(false);
      setStatusMessage("❌ Test Failed");
      setMetrics({ ping: 0, download: 0, upload: 0, phase: "idle" });
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    }
  };

  return {
    metrics,
    network,
    isNetworkLoading,
    statusMessage,
    startSpeedTest,
  };
}
