import L from "leaflet";

// Color helpers driven by design tokens (read at runtime so theme switches apply)
export const trafficColor = (level: "low" | "medium" | "high") => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(`--traffic-${level}`).trim();
  return `hsl(${v})`;
};

export const phaseColor = (phase: "red" | "yellow" | "green") => {
  const map: Record<string, string> = {
    green: "--success",
    yellow: "--warning",
    red: "--destructive",
  };
  const v = getComputedStyle(document.documentElement).getPropertyValue(map[phase]).trim();
  return `hsl(${v})`;
};

export const incidentIcon = (type: "accident" | "jam" | "roadblock") => {
  const colors: Record<string, string> = { accident: "#ef4444", jam: "#f59e0b", roadblock: "#6366f1" };
  const emoji: Record<string, string> = { accident: "🚨", jam: "🚗", roadblock: "🚧" };
  return L.divIcon({
    className: "",
    html: `<div style="
      background:${colors[type]};
      color:#fff;
      width:34px;height:34px;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 6px 16px rgba(0,0,0,.45);
      border:2px solid hsl(var(--background));
    "><span style="transform:rotate(45deg);font-size:16px;">${emoji[type]}</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32],
  });
};

export const signalIcon = (phase: "red" | "yellow" | "green") => {
  const c = phase === "green" ? "#22c55e" : phase === "yellow" ? "#f59e0b" : "#ef4444";
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:22px;height:22px;">
      <div style="position:absolute;inset:0;border-radius:50%;background:${c};box-shadow:0 0 14px ${c};"></div>
      <div style="position:absolute;inset:0;border-radius:50%;border:2px solid #fff2;"></div>
    </div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
};

export const cameraIcon = (status: "online" | "offline") => {
  const c = status === "online" ? "#3b82f6" : "#64748b";
  return L.divIcon({
    className: "",
    html: `<div style="
      background:${c};
      color:#fff;
      width:28px;height:28px;border-radius:8px;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 4px 12px rgba(0,0,0,.35);
      border:2px solid hsl(var(--background));
    "><span style="font-size:14px;">📹</span></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

// Use a tasteful dark tile provider that doesn't require a key
export const TILE_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
export const TILE_LIGHT = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
