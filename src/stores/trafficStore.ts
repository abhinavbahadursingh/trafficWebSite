import { create } from "zustand";
import type { Incident, IncidentStatus, IncidentType, TrafficSegment, TrafficSignal, AppNotification, Camera } from "@/types/traffic";

// City center: Delhi, India
const CITY_CENTER: [number, number] = [28.6139, 77.2090];

const seedCameras: Camera[] = [
  { id: "cam-1", name: "Connaught Place Inner Circle", lat: 28.6328, lng: 77.2197, url: "https://images.unsplash.com/photo-1587309147525-632057396655?auto=format&fit=crop&q=80&w=800", status: "online", locationDescription: "Block A view" },
  { id: "cam-2", name: "India Gate Circle", lat: 28.6129, lng: 77.2295, url: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=800", status: "online", locationDescription: "Kartavya Path intersection" },
  { id: "cam-3", name: "ITO Intersection", lat: 28.6301, lng: 77.2400, url: "https://images.unsplash.com/photo-1545147986-a9d6f210df77?auto=format&fit=crop&q=80&w=800", status: "online", locationDescription: "East Delhi approach" },
  { id: "cam-4", name: "AIIMS Flyover", lat: 28.5672, lng: 77.2100, url: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=800", status: "online", locationDescription: "Ring Road traffic" },
  { id: "cam-5", name: "Dhaula Kuan", lat: 28.5918, lng: 77.1615, url: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=800", status: "online", locationDescription: "Airport road junction" },
  { id: "cam-6", name: "Chandni Chowk", lat: 28.6506, lng: 77.2303, url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800", status: "offline", locationDescription: "Red Fort approach" },
];

const seedSegments: TrafficSegment[] = [
  {
    id: "seg-1", name: "Ring Road (Lajpat Nagar)",
    path: [[28.5708, 77.2355], [28.5672, 77.2300], [28.5650, 77.2100], [28.5672, 77.1950]],
    level: "high", speedKph: 12, updatedAt: new Date().toISOString(),
  },
  {
    id: "seg-2", name: "Outer Ring Road (IIT)",
    path: [[28.5450, 77.1800], [28.5455, 77.1900], [28.5460, 77.2000], [28.5480, 77.2200]],
    level: "medium", speedKph: 28, updatedAt: new Date().toISOString(),
  },
  {
    id: "seg-3", name: "Janpath",
    path: [[28.6328, 77.2197], [28.6200, 77.2190], [28.6129, 77.2295]],
    level: "low", speedKph: 42, updatedAt: new Date().toISOString(),
  },
  {
    id: "seg-4", name: "NH-48 (Gurgaon Expressway)",
    path: [[28.5918, 77.1615], [28.5600, 77.1200], [28.5300, 77.0800]],
    level: "medium", speedKph: 55, updatedAt: new Date().toISOString(),
  },
  {
    id: "seg-5", name: "Vikas Marg",
    path: [[28.6301, 77.2400], [28.6350, 77.2600], [28.6400, 77.2800]],
    level: "high", speedKph: 15, updatedAt: new Date().toISOString(),
  },
  {
    id: "seg-6", name: "Barapullah Flyover",
    path: [[28.5850, 77.2300], [28.5860, 77.2500], [28.5880, 77.2700]],
    level: "low", speedKph: 50, updatedAt: new Date().toISOString(),
  },
  {
    id: "seg-7", name: "Nelson Mandela Marg",
    path: [[28.5550, 77.1600], [28.5450, 77.1550], [28.5350, 77.1500]],
    level: "medium", speedKph: 35, updatedAt: new Date().toISOString(),
  },
  {
    id: "seg-8", name: "MG Road (Sultanpur)",
    path: [[28.5000, 77.1600], [28.4900, 77.1400], [28.4800, 77.1200]],
    level: "high", speedKph: 18, updatedAt: new Date().toISOString(),
  },
  {
    id: "seg-9", name: "Pusa Road",
    path: [[28.6440, 77.1900], [28.6440, 77.1800], [28.6440, 77.1700]],
    level: "medium", speedKph: 25, updatedAt: new Date().toISOString(),
  },
  {
    id: "seg-10", name: "Aurobindo Marg",
    path: [[28.5700, 77.2100], [28.5400, 77.2000], [28.5200, 77.2000]],
    level: "high", speedKph: 10, updatedAt: new Date().toISOString(),
  },
  {
    id: "seg-11", name: "Shanti Path",
    path: [[28.6000, 77.1900], [28.5900, 77.1850], [28.5800, 77.1850]],
    level: "low", speedKph: 45, updatedAt: new Date().toISOString(),
  },
  {
    id: "seg-12", name: "Baba Kharak Singh Marg",
    path: [[28.6300, 77.2100], [28.6250, 77.2100], [28.6200, 77.2100]],
    level: "medium", speedKph: 30, updatedAt: new Date().toISOString(),
  },
  {
    id: "seg-13", name: "Lodhi Road",
    path: [[28.5900, 77.2200], [28.5900, 77.2300], [28.5900, 77.2400]],
    level: "low", speedKph: 40, updatedAt: new Date().toISOString(),
  },
  {
    id: "seg-14", name: "Mathura Road",
    path: [[28.5800, 77.2500], [28.5600, 77.2600], [28.5400, 77.2800]],
    level: "high", speedKph: 14, updatedAt: new Date().toISOString(),
  },
  {
    id: "seg-15", name: "Siri Fort Road",
    path: [[28.5550, 77.2200], [28.5500, 77.2200], [28.5450, 77.2200]],
    level: "medium", speedKph: 22, updatedAt: new Date().toISOString(),
  },
];

const seedSignals: TrafficSignal[] = [
  { id: "sig-1", name: "CP Inner Circle", lat: 28.6328, lng: 77.2197, phase: "green", durations: { red: 45, yellow: 5, green: 40 }, remaining: 30 },
  { id: "sig-2", name: "India Gate Hexagon", lat: 28.6129, lng: 77.2295, phase: "red", durations: { red: 60, yellow: 5, green: 30 }, remaining: 45 },
  { id: "sig-3", name: "ITO Crossing", lat: 28.6301, lng: 77.2400, phase: "yellow", durations: { red: 50, yellow: 5, green: 45 }, remaining: 4 },
  { id: "sig-4", name: "AIIMS Crossing", lat: 28.5672, lng: 77.2100, phase: "green", durations: { red: 40, yellow: 5, green: 35 }, remaining: 20 },
  { id: "sig-5", name: "Dhaula Kuan Junction", lat: 28.5918, lng: 77.1615, phase: "red", durations: { red: 70, yellow: 5, green: 40 }, remaining: 10 },
];

const seedIncidents: Incident[] = [
  {
    id: "inc-1", type: "accident", description: "Multi-vehicle pileup near flyover.",
    lat: 28.5672, lng: 77.2100, status: "approved",
    reportedBy: "u-police", reportedByName: "Officer Khanna",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), address: "AIIMS Flyover",
  },
  {
    id: "inc-2", type: "jam", description: "Waterlogging causing slow movement.",
    lat: 28.6301, lng: 77.2400, status: "approved",
    reportedBy: "u-public", reportedByName: "Rajat Sharma",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), address: "ITO Intersection",
  },
  {
    id: "inc-3", type: "roadblock", description: "Metro construction, restricted lanes.",
    lat: 28.5450, lng: 77.1800, status: "pending",
    reportedBy: "u-public", reportedByName: "Ananya Goel",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), address: "IIT Gate Metro",
  },
];

interface TrafficState {
  center: [number, number];
  segments: TrafficSegment[];
  signals: TrafficSignal[];
  incidents: Incident[];
  cameras: Camera[];
  notifications: AppNotification[];
  history: { time: string; low: number; medium: number; high: number; avgSpeed: number }[];

  // actions
  reportIncident: (input: Omit<Incident, "id" | "createdAt" | "status">) => Incident;
  setIncidentStatus: (id: string, status: IncidentStatus) => void;
  filterIncidents: (filters: { type?: IncidentType | "all"; status?: IncidentStatus | "all"; q?: string }) => Incident[];

  setSignalDurations: (id: string, durations: TrafficSignal["durations"]) => void;
  overrideSignal: (id: string, phase: TrafficSignal["phase"] | null) => void;
  resetSignal: (id: string) => void;

  tickRealtime: () => void; // called every second by simulator
  pushNotification: (n: Omit<AppNotification, "id" | "createdAt" | "read">) => void;
  markAllRead: () => void;
}

const buildHistory = () => {
  const now = Date.now();
  const out: TrafficState["history"] = [];
  for (let i = 23; i >= 0; i--) {
    const t = new Date(now - i * 60 * 60 * 1000);
    const hour = t.getHours();
    const peak = (hour >= 8 && hour <= 11) || (hour >= 17 && hour <= 20);
    const high = peak ? 8 + Math.floor(Math.random() * 4) : 1 + Math.floor(Math.random() * 3);
    const medium = peak ? 10 + Math.floor(Math.random() * 5) : 4 + Math.floor(Math.random() * 4);
    const low = 24 - high - medium;
    const avgSpeed = peak ? 12 + Math.floor(Math.random() * 10) : 35 + Math.floor(Math.random() * 15);
    out.push({ time: t.toISOString(), low, medium, high, avgSpeed });
  }
  return out;
};

const advanceSignal = (s: TrafficSignal): TrafficSignal => {
  if (s.manualOverride) {
    return { ...s, phase: s.manualOverride, remaining: s.durations[s.manualOverride] };
  }
  if (s.remaining > 1) return { ...s, remaining: s.remaining - 1 };
  const order: TrafficSignal["phase"][] = ["green", "yellow", "red"];
  const next = order[(order.indexOf(s.phase) + 1) % order.length];
  return { ...s, phase: next, remaining: s.durations[next] };
};

export const useTraffic = create<TrafficState>((set, get) => ({
  center: CITY_CENTER,
  segments: seedSegments,
  signals: seedSignals,
  incidents: seedIncidents,
  cameras: seedCameras,
  notifications: [
    { id: "n-1", title: "Heavy Jam on Ring Road", body: "Speeds dropped below 10 km/h at Lajpat Nagar.", level: "warning", createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), read: false },
    { id: "n-2", title: "Construction Alert", body: "Metro work at IIT gate is causing delays.", level: "info", createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(), read: false },
  ],
  history: buildHistory(),

  reportIncident: (input) => {
    const inc: Incident = {
      ...input,
      id: "inc-" + Math.random().toString(36).slice(2, 9),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ incidents: [inc, ...s.incidents] }));
    get().pushNotification({
      title: "New incident reported",
      body: `${input.type.toUpperCase()} near ${input.address ?? "location"} — pending review.`,
      level: "info",
    });
    return inc;
  },

  setIncidentStatus: (id, status) =>
    set((s) => ({
      incidents: s.incidents.map((i) =>
        i.id === id ? { ...i, status, resolvedAt: status === "resolved" ? new Date().toISOString() : i.resolvedAt } : i
      ),
    })),

  filterIncidents: ({ type, status, q }) => {
    let list = get().incidents;
    if (type && type !== "all") list = list.filter((i) => i.type === type);
    if (status && status !== "all") list = list.filter((i) => i.status === status);
    if (q && q.trim()) {
      const k = q.toLowerCase();
      list = list.filter((i) => i.description.toLowerCase().includes(k) || (i.address ?? "").toLowerCase().includes(k));
    }
    return list;
  },

  setSignalDurations: (id, durations) =>
    set((s) => ({ signals: s.signals.map((sig) => (sig.id === id ? { ...sig, durations } : sig)) })),

  overrideSignal: (id, phase) =>
    set((s) => ({
      signals: s.signals.map((sig) =>
        sig.id === id
          ? phase
            ? { ...sig, manualOverride: phase, phase, remaining: sig.durations[phase] }
            : { ...sig, manualOverride: undefined }
          : sig
      ),
    })),

  resetSignal: (id) =>
    set((s) => ({
      signals: s.signals.map((sig) =>
        sig.id === id ? { ...sig, manualOverride: undefined, phase: "red", remaining: sig.durations.red } : sig
      ),
    })),

  tickRealtime: () => {
    set((s) => {
      // Advance signals every second
      const signals = s.signals.map(advanceSignal);

      // Occasionally jiggle traffic levels
      let segments = s.segments;
      if (Math.random() < 0.22) {
        const idx = Math.floor(Math.random() * segments.length);
        const levels: TrafficSegment["level"][] = ["low", "medium", "high"];
        const cur = segments[idx].level;
        const choices = cur === "low" ? ["low", "medium"] : cur === "high" ? ["medium", "high"] : levels;
        const next = choices[Math.floor(Math.random() * choices.length)] as TrafficSegment["level"];
        const speed = next === "low" ? 40 + Math.random() * 15 : next === "medium" ? 20 + Math.random() * 10 : 5 + Math.random() * 8;
        segments = segments.map((seg, i) =>
          i === idx ? { ...seg, level: next, speedKph: Math.round(speed), updatedAt: new Date().toISOString() } : seg
        );
      }

      return { signals, segments };
    });
  },

  pushNotification: (n) =>
    set((s) => ({
      notifications: [
        { ...n, id: "n-" + Math.random().toString(36).slice(2, 9), createdAt: new Date().toISOString(), read: false },
        ...s.notifications,
      ].slice(0, 30),
    })),

  markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
}));

// Singleton simulator
let started = false;
export function startRealtimeSimulator() {
  if (started) return;
  started = true;
  setInterval(() => useTraffic.getState().tickRealtime(), 1000);

  // Occasional Delhi-specific alerts
  setInterval(() => {
    const high = useTraffic.getState().segments.filter((s) => s.level === "high");
    if (high.length && Math.random() < 0.45) {
      const seg = high[Math.floor(Math.random() * high.length)];
      useTraffic.getState().pushNotification({
        title: `Congestion Alert: ${seg.name}`,
        body: `Expect delays, current speed is ${seg.speedKph} km/h.`,
        level: "warning",
      });
    }
  }, 25000);
}
