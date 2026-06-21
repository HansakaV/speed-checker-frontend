import { NetworkDetails } from "../types/speed";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000/speed-test";

// --- 1. RUN PING & DETECT ISP TEST ---
export const runPingAndNetworkTest = async (): Promise<{ duration: number; network: NetworkDetails }> => {
  const startTime = performance.now();
  
  const res = await fetch(`${BACKEND_URL}/ping`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Ping test failed: ${res.statusText}`);
  }
  const data = await res.json();
  
  const endTime = performance.now();
  
  return {
    duration: Math.round(endTime - startTime),
    network: {
      ip: data.ip,
      isp: data.isp,
      location: data.location,
    },
  };
};

// --- 2. RUN DOWNLOAD TEST (REAL-TIME STREAMING METHOD) ---
export const runDownloadTest = async (
  onProgress: (speedMbps: number) => void
): Promise<number> => {
  const res = await fetch(`${BACKEND_URL}/download`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Download test failed: ${res.statusText}`);
  }
  if (!res.body) {
    return 0;
  }

  const reader = res.body.getReader();
  let loadedBytes = 0;
  const testStartTime = performance.now();
  let lastUpdateTime = testStartTime;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    loadedBytes += value.byteLength;
    const now = performance.now();
    const timeElapsed = (now - testStartTime) / 1000; // in seconds

    // Add a minimum duration threshold to prevent division by near-zero resulting in huge spikes
    // Throttle progress updates to at most once every 100ms to avoid locking the React/UI thread
    if (timeElapsed > 0.05 && now - lastUpdateTime > 100) {
      const currentSpeedMbps = (loadedBytes * 8) / (timeElapsed * 1000000);
      onProgress(Math.round(currentSpeedMbps));
      lastUpdateTime = now;
    }
  }

  const totalDuration = (performance.now() - testStartTime) / 1000;
  return totalDuration > 0 ? Math.round((loadedBytes * 8) / (totalDuration * 1000000)) : 0;
};

// --- 3. RUN UPLOAD TEST (REAL-TIME PROGRESS METHOD) ---
export const runUploadTest = async (
  onProgress: (speedMbps: number) => void
): Promise<number> => {
  return new Promise((resolve, reject) => {
    // 5MB Dummy Payload Generator
    const dummySize = 5 * 1024 * 1024;
    const dummyData = new Uint8Array(dummySize);
    const testStartTime = performance.now();
    let lastUpdateTime = testStartTime;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BACKEND_URL}/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const now = performance.now();
        const timeElapsed = (now - testStartTime) / 1000; // in seconds
        
        // Throttle progress updates to at most once every 100ms
        if (timeElapsed > 0.05 && now - lastUpdateTime > 100) {
          const currentSpeedMbps = (event.loaded * 8) / (timeElapsed * 1000000);
          onProgress(Math.round(currentSpeedMbps));
          lastUpdateTime = now;
        }
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const totalDuration = (performance.now() - testStartTime) / 1000;
        const finalSpeed = totalDuration > 0 ? Math.round((dummySize * 8) / (totalDuration * 1000000)) : 0;
        resolve(finalSpeed);
      } else {
        reject(new Error(`Upload test failed: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Upload network error"));
    };

    xhr.send(dummyData);
  });
};
