import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTraffic } from "@/stores/trafficStore";
import { useAuth } from "@/stores/authStore";
import { Activity, AlertTriangle, Gauge, MapPin, TrendingDown, TrendingUp, Video } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrafficMap } from "@/components/map/TrafficMap";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow } from "date-fns";

const StatCard = ({
  icon: Icon, label, value, hint, trend, accent = "primary",
}: {
  icon: any; label: string; value: string; hint?: string; trend?: { dir: "up" | "down"; v: string }; accent?: "primary" | "warning" | "destructive" | "success";
}) => {
  const accentClass = {
    primary: "text-primary bg-primary/10",
    warning: "text-warning bg-warning/10",
    destructive: "text-destructive bg-destructive/10",
    success: "text-success bg-success/10",
  }[accent];
  return (
    <Card className="p-5 bg-card/60 border-border hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${accentClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className={`flex items-center gap-1 text-xs font-medium ${trend.dir === "up" ? "text-destructive" : "text-success"}`}>
            {trend.dir === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.v}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-4">{label}</p>
      <p className="font-display text-3xl font-semibold mt-1">{value}</p>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </Card>
  );
};

export default function Dashboard() {
  const segments = useTraffic((s) => s.segments);
  const incidents = useTraffic((s) => s.incidents);
  const signals = useTraffic((s) => s.signals);
  const cameras = useTraffic((s) => s.cameras);
  const history = useTraffic((s) => s.history);
  const { user } = useAuth();

  const high = segments.filter((s) => s.level === "high").length;
  const medium = segments.filter((s) => s.level === "medium").length;
  const low = segments.filter((s) => s.level === "low").length;
  const avgSpeed = Math.round(segments.reduce((a, s) => a + s.speedKph, 0) / segments.length);
  const activeIncidents = incidents.filter((i) => i.status === "approved" || i.status === "pending").length;

  const chartData = history.map((h) => ({
    label: format(new Date(h.time), "HH:mm"),
    speed: h.avgSpeed,
    high: h.high,
  }));

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back, {user?.name.split(" ")[0]}</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold">City overview</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-success/40 text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse mr-1.5" />
            Live • updating every second
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Gauge} label="Average speed" value={`${avgSpeed} km/h`} hint="Across monitored roads" trend={{ dir: avgSpeed < 25 ? "down" : "up", v: `${Math.abs(40 - avgSpeed)}%` }} />
        <StatCard icon={Activity} label="High congestion segments" value={`${high}`} hint={`${segments.length} total roads`} accent="destructive" />
        <StatCard icon={AlertTriangle} label="Active incidents" value={`${activeIncidents}`} hint="Pending or in-progress" accent="warning" />
        <StatCard icon={Video} label="Cameras online" value={`${cameras.filter(c => c.status === "online").length}`} hint={`${cameras.length} total units`} accent="primary" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5 bg-card/60 border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-display font-semibold">Average speed (24h)</p>
              <p className="text-xs text-muted-foreground">Lower values indicate heavier congestion</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8, fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="speed" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 bg-card/60 border-border">
          <p className="font-display font-semibold mb-1">Congestion mix</p>
          <p className="text-xs text-muted-foreground mb-5">Right-now distribution</p>
          <div className="space-y-4">
            {[
              { k: "Low", v: low, c: "hsl(var(--traffic-low))" },
              { k: "Medium", v: medium, c: "hsl(var(--traffic-medium))" },
              { k: "High", v: high, c: "hsl(var(--traffic-high))" },
            ].map((row) => (
              <div key={row.k}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: row.c }} />
                    {row.k}
                  </span>
                  <span className="font-mono text-muted-foreground">{row.v} / {segments.length}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(row.v / segments.length) * 100}%`, background: row.c }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-3 bg-card/60 border-border overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-3 py-2">
            <p className="font-display font-semibold">Live map preview</p>
            <Link to="/map"><Button variant="ghost" size="sm">Open full map →</Button></Link>
          </div>
          <div className="flex-1 min-h-[420px]">
            <TrafficMap className="h-full" />
          </div>
        </Card>

        <Card className="p-5 bg-card/60 border-border flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <p className="font-display font-semibold">Live Camera Feeds</p>
            <Link to="/cameras"><Button variant="ghost" size="sm">View all →</Button></Link>
          </div>
          <div className="grid grid-cols-1 gap-3 flex-1 overflow-auto scrollbar-none">
            {cameras.filter(c => c.status === "online").slice(0, 3).map((cam) => (
              <div key={cam.id} className="group relative aspect-video rounded-lg overflow-hidden border border-border">
                <img src={cam.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={cam.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className="text-[10px] font-medium text-white truncate">{cam.name}</span>
                  <Badge className="h-4 px-1 text-[8px] bg-red-500 hover:bg-red-500 border-none">LIVE</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-3 p-5 bg-card/60 border-border">
          <div className="flex items-center justify-between mb-3">
            <p className="font-display font-semibold">Active incidents</p>
            <Link to="/admin"><Button variant="ghost" size="sm">All →</Button></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {incidents.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8 col-span-4">No incidents reported.</p>
            )}
            {incidents.slice(0, 4).map((inc) => (
              <div key={inc.id} className="p-3 rounded-lg border border-border hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium capitalize">{inc.type}</p>
                    <p className="text-xs text-muted-foreground">{inc.address}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      inc.status === "pending" ? "border-warning/40 text-warning" :
                      inc.status === "approved" ? "border-info/40 text-info" :
                      inc.status === "resolved" ? "border-success/40 text-success" :
                      "border-destructive/40 text-destructive"
                    }
                  >
                    {inc.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{inc.description}</p>
                <p className="text-[10px] text-muted-foreground font-mono mt-1">
                  {formatDistanceToNow(new Date(inc.createdAt), { addSuffix: true })}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
