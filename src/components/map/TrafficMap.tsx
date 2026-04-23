import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { TILE_URL, TILE_LIGHT, TILE_ATTRIBUTION, trafficColor, incidentIcon, signalIcon, cameraIcon } from "./mapHelpers";
import { useTraffic } from "@/stores/trafficStore";
import type { Incident } from "@/types/traffic";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

interface Props {
  height?: string;
  showSignals?: boolean;
  showIncidents?: boolean;
  showSegments?: boolean;
  showCameras?: boolean;
  onMapClick?: (lat: number, lng: number) => void;
  pickedPoint?: { lat: number; lng: number } | null;
  className?: string;
  pendingOnly?: boolean;
}

function ClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) { onMapClick?.(e.latlng.lat, e.latlng.lng); },
  });
  return null;
}

function Recenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.setView(center, map.getZoom()); }, [center, map]);
  return null;
}

function InvalidateSize() {
  const map = useMap();
  useEffect(() => {
    // Small delay to ensure container is fully rendered
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export function TrafficMap({
  height = "100%",
  showSignals = true,
  showIncidents = true,
  showSegments = true,
  showCameras = true,
  onMapClick,
  pickedPoint,
  className,
  pendingOnly,
}: Props) {
  const center = useTraffic((s) => s.center);
  const segments = useTraffic((s) => s.segments);
  const incidents = useTraffic((s) => s.incidents);
  const signals = useTraffic((s) => s.signals);
  const cameras = useTraffic((s) => s.cameras);
  const [, force] = useState(0);

  // re-render when theme changes (so polyline colors refresh)
  useEffect(() => {
    const obs = new MutationObserver(() => force((n) => n + 1));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const isLight = typeof document !== "undefined" && document.documentElement.classList.contains("light");

  const incidentList: Incident[] = pendingOnly ? incidents.filter((i) => i.status === "pending") : incidents.filter((i) => i.status !== "rejected");

  return (
    <div className={className} style={{ height, width: "100%", minHeight: height === "100%" ? "400px" : undefined }}>
      <MapContainer center={center} zoom={13} scrollWheelZoom className="h-full w-full rounded-xl overflow-hidden z-0">
        <TileLayer url={isLight ? TILE_LIGHT : TILE_URL} attribution={TILE_ATTRIBUTION} />
        <InvalidateSize />
        <Recenter center={center} />
        <ClickHandler onMapClick={onMapClick} />

        {showSegments && segments.map((seg) => (
          <Polyline
            key={seg.id}
            positions={seg.path}
            pathOptions={{ color: trafficColor(seg.level), weight: 6, opacity: 0.85, lineCap: "round" }}
          >
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold">{seg.name}</p>
                <p className="text-xs capitalize">Level: <span style={{ color: trafficColor(seg.level) }}>{seg.level}</span></p>
                <p className="text-xs">Avg speed: {seg.speedKph} km/h</p>
              </div>
            </Popup>
          </Polyline>
        ))}

        {showIncidents && incidentList.map((inc) => (
          <Marker key={inc.id} position={[inc.lat, inc.lng]} icon={incidentIcon(inc.type)}>
            <Popup>
              <div className="space-y-1 max-w-[220px]">
                <p className="font-semibold capitalize">{inc.type} • <span className="text-xs uppercase">{inc.status}</span></p>
                <p className="text-xs text-muted-foreground">{inc.address}</p>
                <p className="text-sm">{inc.description}</p>
                <p className="text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(inc.createdAt), { addSuffix: true })}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {showSignals && signals.map((sig) => (
          <Marker key={sig.id} position={[sig.lat, sig.lng]} icon={signalIcon(sig.phase)}>
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold">{sig.name}</p>
                <p className="text-xs capitalize">Phase: {sig.phase} ({sig.remaining}s)</p>
                {sig.manualOverride && <p className="text-xs text-warning">Manual override active</p>}
              </div>
            </Popup>
          </Marker>
        ))}

        {showCameras && cameras.map((cam) => (
          <Marker key={cam.id} position={[cam.lat, cam.lng]} icon={cameraIcon(cam.status)}>
            <Popup>
              <div className="space-y-2 min-w-[160px]">
                <p className="font-semibold">{cam.name}</p>
                <p className="text-xs text-muted-foreground">{cam.locationDescription}</p>
                {cam.status === "online" && (
                  <img src={cam.url} className="w-full aspect-video object-cover rounded shadow-sm" alt={cam.name} />
                )}
                <Link to="/cameras" className="text-[10px] text-primary hover:underline block text-center pt-1 font-medium">
                  View all camera feeds
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}

        {pickedPoint && (
          <Marker position={[pickedPoint.lat, pickedPoint.lng]}>
            <Popup>Selected location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
