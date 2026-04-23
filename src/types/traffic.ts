export type UserRole = "admin" | "police" | "public";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export type TrafficLevel = "low" | "medium" | "high";

export interface TrafficSegment {
  id: string;
  name: string;
  // road as a polyline of [lat, lng]
  path: [number, number][];
  level: TrafficLevel;
  speedKph: number;
  updatedAt: string;
}

export type IncidentType = "accident" | "jam" | "roadblock";
export type IncidentStatus = "pending" | "approved" | "rejected" | "resolved";

export interface Incident {
  id: string;
  type: IncidentType;
  description: string;
  lat: number;
  lng: number;
  imageDataUrl?: string;
  status: IncidentStatus;
  reportedBy: string; // user id
  reportedByName: string;
  createdAt: string;
  resolvedAt?: string;
  address?: string;
}

export type SignalPhase = "red" | "yellow" | "green";

export interface TrafficSignal {
  id: string;
  name: string;
  lat: number;
  lng: number;
  phase: SignalPhase;
  durations: { red: number; yellow: number; green: number }; // seconds
  remaining: number;
  manualOverride?: SignalPhase;
}

export interface Camera {
  id: string;
  name: string;
  lat: number;
  lng: number;
  url: string; // Video stream or placeholder
  status: "online" | "offline";
  locationDescription: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  level: "info" | "warning" | "critical";
  createdAt: string;
  read: boolean;
}
