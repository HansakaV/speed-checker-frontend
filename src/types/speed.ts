export interface SpeedMetrics{
    ping: number;
    download: number;
    upload: number;
    phase: "idle" | "pinging" | "downloading" | "uploading" | "completed";
}

export interface NetworkDetails{
    ip: string;
    isp: string;
    location: string;
}