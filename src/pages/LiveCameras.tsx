import { useState } from "react";
import { useTraffic } from "@/stores/trafficStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Video, VideoOff, Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function LiveCameras() {
  const cameras = useTraffic((s) => s.cameras);
  const [search, setSearch] = useState("");

  const filteredCameras = cameras.filter((cam) =>
    cam.name.toLowerCase().includes(search.toLowerCase()) ||
    cam.locationDescription.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">Live Camera Monitoring</h1>
          <p className="text-muted-foreground text-sm">Real-time traffic feeds from across the city</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cameras..."
            className="pl-9 h-10 bg-card/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCameras.map((camera) => (
          <Card key={camera.id} className="overflow-hidden border-border bg-card/40 hover:border-primary/50 transition-colors group">
            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
              <div className="min-w-0">
                <CardTitle className="text-base truncate">{camera.name}</CardTitle>
                <p className="text-xs text-muted-foreground truncate">{camera.locationDescription}</p>
              </div>
              <Badge variant={camera.status === "online" ? "default" : "destructive"} className="ml-2">
                {camera.status === "online" ? "Live" : "Offline"}
              </Badge>
            </CardHeader>
            <CardContent className="p-0 relative aspect-video bg-muted">
              {camera.status === "online" ? (
                <>
                  <img
                    src={camera.url}
                    alt={camera.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="gap-2">
                      <Maximize2 className="h-4 w-4" /> Expand Feed
                    </Button>
                  </div>
                  <div className="absolute top-2 left-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-md">REC</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                  <VideoOff className="h-10 w-10 opacity-20" />
                  <span className="text-sm font-medium italic">Feed Unavailable</span>
                </div>
              )}
            </CardContent>
            <div className="p-3 bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground font-mono">CAM_ID: {camera.id.toUpperCase()}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">Lat: {camera.lat.toFixed(4)} Lng: {camera.lng.toFixed(4)}</span>
            </div>
          </Card>
        ))}
      </div>

      {filteredCameras.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No cameras found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
}
