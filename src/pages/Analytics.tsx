import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { useTraffic } from "@/stores/trafficStore";
import { format, subDays } from "date-fns";

export default function Analytics() {
  const history = useTraffic((s) => s.history);
  const incidents = useTraffic((s) => s.incidents);

  const hourly = history.map((h) => ({
    label: format(new Date(h.time), "HH:mm"),
    speed: h.avgSpeed,
    high: h.high,
    medium: h.medium,
    low: h.low,
  }));

  const weekly = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(now, 6 - i);
      const peak = i === 1 || i === 4;
      return {
        day: format(d, "EEE"),
        accidents: 2 + Math.floor(Math.random() * (peak ? 6 : 3)),
        jams: 4 + Math.floor(Math.random() * (peak ? 8 : 4)),
        roadblocks: 1 + Math.floor(Math.random() * 3),
      };
    });
  }, []);

  const typeMix = ["accident", "jam", "roadblock"].map((t) => ({
    name: t,
    value: incidents.filter((i) => i.type === t).length || 1,
  }));

  const COLORS = ["hsl(var(--destructive))", "hsl(var(--warning))", "hsl(var(--info))"];

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto">
      <div>
        <h2 className="font-display text-2xl font-semibold">Analytics</h2>
        <p className="text-sm text-muted-foreground">Trends across the last day and week.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5 bg-card/60 border-border">
          <p className="font-display font-semibold mb-1">Average speed (24h)</p>
          <p className="text-xs text-muted-foreground mb-4">km/h across monitored roads</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourly}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="speed" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 bg-card/60 border-border">
          <p className="font-display font-semibold mb-1">Incident mix</p>
          <p className="text-xs text-muted-foreground mb-4">By type, all time</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={typeMix} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {typeMix.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-5 bg-card/60 border-border">
        <p className="font-display font-semibold mb-1">Weekly incidents</p>
        <p className="text-xs text-muted-foreground mb-4">Stacked counts per day</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="accidents" stackId="a" fill="hsl(var(--destructive))" radius={[0, 0, 0, 0]} />
              <Bar dataKey="jams" stackId="a" fill="hsl(var(--warning))" />
              <Bar dataKey="roadblocks" stackId="a" fill="hsl(var(--info))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
