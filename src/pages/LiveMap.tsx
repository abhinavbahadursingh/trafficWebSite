import { useState } from "react";
import { TrafficMap } from "@/components/map/TrafficMap";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { useTraffic } from "@/stores/trafficStore";

export default function LiveMap() {
  const segments = useTraffic((s) => s.segments);
  const [showSegments, setShowSegments] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showSignals, setShowSignals] = useState(true);
  const [showCameras, setShowCameras] = useState(true);
  const [query, setQuery] = useState("");

  const search = () => {
    if (!query.trim()) return;
    const match = segments.find((s) => s.name.toLowerCase().includes(query.toLowerCase()));
    if (match) toast.success(`Found ${match.name} — currently ${match.level} traffic`);
    else toast.error("No matching road found");
  };

  return (
    <div className="p-4 md:p-6 h-[calc(100vh-3.5rem)] flex flex-col gap-4">
      <Card className="p-3 bg-card/60 border-border flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="Search a road…"
              className="pl-9 h-9"
            />
          </div>
          <Button size="sm" onClick={search} className="bg-gradient-primary text-primary-foreground hover:opacity-90">Search</Button>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Switch id="seg" checked={showSegments} onCheckedChange={setShowSegments} />
            <Label htmlFor="seg" className="text-sm">Roads</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="inc" checked={showIncidents} onCheckedChange={setShowIncidents} />
            <Label htmlFor="inc" className="text-sm">Incidents</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="sig" checked={showSignals} onCheckedChange={setShowSignals} />
            <Label htmlFor="sig" className="text-sm">Signals</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="cam" checked={showCameras} onCheckedChange={setShowCameras} />
            <Label htmlFor="cam" className="text-sm">Cameras</Label>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs ml-auto">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-traffic-low" /> Low</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-traffic-medium" /> Medium</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-traffic-high" /> High</span>
        </div>
      </Card>

      <Card className="flex-1 p-2 bg-card/60 border-border overflow-hidden">
        <TrafficMap
          showSegments={showSegments}
          showIncidents={showIncidents}
          showSignals={showSignals}
          showCameras={showCameras}
        />
      </Card>
    </div>
  );
}
